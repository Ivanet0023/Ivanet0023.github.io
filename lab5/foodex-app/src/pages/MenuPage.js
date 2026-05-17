import React, { useState, useEffect } from 'react';
import DishCard from '../components/DishCard';

const MOCK_MENU = [
    { id: '1', name: 'Pizza Margarita', price: 200, category: 'Pizza', img: 'img/pizza_marg.png', description: 'Classic pizza' },
    { id: '2', name: 'Pizza Pepperoni', price: 250, category: 'Pizza', img: 'img/pizza_pepp.png', description: 'Spicy pizza' },
    { id: '3', name: 'French Fries', price: 80, category: 'Potato', img: 'img/french_fries.png', description: 'Crispy fries' },
    { id: '4', name: 'Baked Potatoes', price: 100, category: 'Potato', img: 'img/backed_potatoes.png', description: 'Delicious baked potatoes' },
    { id: '5', name: 'Chicken Wings', price: 180, category: 'Meat', img: 'img/chicken_wings.png', description: 'Spicy wings' }
];

export default function MenuPage({ onAddToCart }) {
    const [menuData, setMenuData] = useState([]);
    const [category, setCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetching from local mock data since Firebase is removed
        setTimeout(() => {
            setMenuData(MOCK_MENU);
            setIsLoading(false);
        }, 500);
    }, []);

    const filteredMenu = category === 'All'
        ? menuData
        : menuData.filter(item => item.category === category);

    if (isLoading) return <p>Loading menu...</p>;

    return (
        <main id="menu">
            <h2>Our menu</h2>
            <div className="filter-bar">
                {['All', 'Pizza', 'Potato', 'Meat'].map(cat => (
                    <button
                        key={cat}
                        className={category === cat ? 'active' : ''}
                        onClick={() => setCategory(cat)}
                    >
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