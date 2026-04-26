import React, { useState } from 'react';
import DishCard from '../components/DishCard';
import menuData from '../menu.json';

export default function MenuPage({ onAddToCart }) {
    const [category, setCategory] = useState('All');
    const filteredMenu = category === 'All' ? menuData : menuData.filter(item => item.category === category);

    return (
        <main id="menu">
            <h2>Our menu</h2>
            <div className="filter-bar">
                {['All', 'Pizza', 'Potato', 'Meat'].map(cat => (
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