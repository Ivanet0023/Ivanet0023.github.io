import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import menuData from './menu.json';
import DishCard from './DishCard';

function App() {
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);

    // Логіка додавання в кошик (з урахуванням кількості)
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    // Зміна кількості (+1 або -1)
    const updateQuantity = (id, delta) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + delta } : item
            ).filter(item => item.quantity > 0) // Видаляємо, якщо кількість 0
        );
    };

    // Оформлення замовлення
    const placeOrder = () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newOrder = {
            id: orders.length + 1,
            date: new Date().toLocaleDateString(),
            items: cart.map(item => `${item.name} x${item.quantity}`).join(", "),
            total: totalPrice,
            status: "In Progress"
        };

        setOrders([...orders, newOrder]);
        setCart([]); // Очищуємо кошик
        alert("Order placed successfully!");
    };

    return (
        <Router>
            <div className="App">
                <header>
                    <h1>FoodEx Delivery</h1>
                    <nav>
                        <ul>
                            <li><Link to="/">Menu</Link></li>
                            <li><Link to="/cart">Cart ({cart.length})</Link></li>
                            <li><Link to="/orders">My orders</Link></li>
                        </ul>
                    </nav>
                </header>

                <Routes>
                    <Route path="/" element={<MenuPage onAddToCart={addToCart} />} />
                    <Route path="/cart" element={
                        <CartPage
                            cart={cart}
                            updateQuantity={updateQuantity}
                            onPlaceOrder={placeOrder}
                        />
                    } />
                    <Route path="/orders" element={<OrdersPage orders={orders} />} />
                </Routes>

                <footer>
                    <h2>Contact us</h2>
                    <p>FoodEx Delivery | +380 99 999 99 99 | Foodex@gmail.com</p>
                </footer>
            </div>
        </Router>
    );
}

// Сторінка Меню (Варіант 12: Фільтрація)
function MenuPage({ onAddToCart }) {
    const [category, setCategory] = useState('All');
    const filteredMenu = category === 'All' ? menuData : menuData.filter(item => item.category === category);

    return (
        <main id="menu">
            <h2>Our menu</h2>
            <div className="filter-bar">
                {['All', 'Pizza', 'Sides', 'Drinks'].map(cat => (
                    <button key={cat} className={category === cat ? 'active' : ''} onClick={() => setCategory(cat)}>
                        {cat}
                    </button>
                ))}
            </div>
            <section className="menu_grid">
                {filteredMenu.map(item => (
                    <DishCard key={item.id} item={item} onAddToCart={onAddToCart} />
                ))}
            </section>
        </main>
    );
}

// СТОРІНКА КОШИКА (Відновлюємо вашу таблицю)
function CartPage({ cart, updateQuantity, onPlaceOrder }) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <section id="cart">
            <h2>Cart</h2>
            {cart.length === 0 ? (
                <div className="no-items"><p>Your cart is empty.</p></div>
            ) : (
                <>
                    <div className="cart_list">
                        <div className="cart_header">
                            <span>Item</span><span>Price</span><span>Qty</span><span>Sub</span>
                        </div>
                        {cart.map(item => (
                            <div key={item.id} className="cart_row">
                                <span>{item.name}</span>
                                <span>{item.price} UAH</span>
                                <div className="qty_controls">
                                    <button className="qty_btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                    <span className="qty_val">{item.quantity}</span>
                                    <button className="qty_btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                </div>
                                <span>{item.price * item.quantity} UAH</span>
                            </div>
                        ))}
                    </div>
                    <div className="cart_summary">
                        <p className="cart_total"><strong>Total: {total} UAH</strong></p>
                        <button id="checkout_btn" onClick={onPlaceOrder}>Place Order</button>
                    </div>
                </>
            )}
        </section>
    );
}

// Сторінка замовлень
function OrdersPage({ orders }) {
    return (
        <section id="orders">
            <h2>My orders</h2>
            <div className="orders_list">
                {orders.length === 0 ? <p>No orders yet.</p> : orders.map(order => (
                    <article key={order.id} className="order_item">
                        <header style={{background: '#34495e', color: 'white', padding: '10px'}}>
                            <strong>Order #{order.id}</strong>
                            <span style={{float: 'right'}}>{order.date}</span>
                        </header>
                        <p style={{padding: '10px'}}>{order.items}</p>
                        <footer style={{background: '#2c3e50', color: 'white', padding: '15px'}}>
                            <span>Status: <mark>{order.status}</mark></span>
                            <strong style={{float: 'right'}}>Total: {order.total} UAH</strong>
                        </footer>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default App;