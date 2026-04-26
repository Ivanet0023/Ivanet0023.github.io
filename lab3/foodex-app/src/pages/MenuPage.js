import React, { useState, useEffect } from 'react';
import DishCard from '../components/DishCard';

export default function MenuPage({ onAddToCart }) {
    const [menuData, setMenuData] = useState([]); // Стан для зберігання завантаженого меню
    const [category, setCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true); // Стан завантаження

    useEffect(() => {
        fetch('/menu.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setMenuData(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Помилка завантаження:", error);
                setIsLoading(false);
            });
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