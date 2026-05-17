require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('./middleware/auth');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким email вже існує' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || ''
            }
        });

        res.status(201).json({ message: 'Користувач успішно зареєстрований' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Невірний email або пароль' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Невірний email або пароль' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

app.get('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, name: true }
        });
        if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// Orders Routes
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            orderBy: { id: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка отримання замовлень' });
    }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const { date, items, total, status } = req.body;
        
        // Validate items count
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Кошик порожній. Додайте мінімум одну страву.' });
        }
        
        // Calculate total quantity of all dishes
        const totalDishes = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        if (totalDishes < 1 || totalDishes > 10) {
            return res.status(400).json({ message: 'Можна замовити від 1 до 10 страв включно.' });
        }

        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                date,
                items,
                total,
                status: status || 'In Progress'
            }
        });
        
        res.status(201).json({ message: 'Замовлення успішно створено', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка створення замовлення' });
    }
});

app.delete('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
        const orderId = parseInt(req.params.id);
        
        // Check if the order belongs to the user
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            return res.status(404).json({ message: 'Замовлення не знайдено' });
        }
        if (order.userId !== req.user.id) {
            return res.status(403).json({ message: 'Немає прав на видалення цього замовлення' });
        }
        
        await prisma.order.delete({ where: { id: orderId } });
        res.json({ message: 'Замовлення видалено' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка видалення замовлення' });
    }
});

// Host static React files (for deployment)
const clientBuildPath = path.join(__dirname, '../foodex-app/build');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
