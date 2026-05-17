const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const MOCK_MENU = [
    { name: 'Pizza Margarita', price: 200, category: 'Pizza', img: 'img/pizza_marg.png', description: 'Classic pizza' },
    { name: 'Pizza Pepperoni', price: 250, category: 'Pizza', img: 'img/pizza_pepp.png', description: 'Spicy pizza' },
    { name: 'French Fries', price: 80, category: 'Potato', img: 'img/french_fries.png', description: 'Crispy fries' },
    { name: 'Baked Potatoes', price: 100, category: 'Potato', img: 'img/backed_potatoes.png', description: 'Delicious baked potatoes' },
    { name: 'Chicken Wings', price: 180, category: 'Meat', img: 'img/chicken_wings.png', description: 'Spicy wings' }
];

async function main() {
    console.log('Start seeding...');
    
    for (const dish of MOCK_MENU) {
        const existingDish = await prisma.dish.findFirst({
            where: { name: dish.name }
        });
        
        if (!existingDish) {
            await prisma.dish.create({
                data: dish
            });
            console.log(`Created dish: ${dish.name}`);
        } else {
            console.log(`Dish already exists: ${dish.name}`);
        }
    }
    
    console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
