import React, { useState, useEffect } from 'react';
import DishCard from '../components/DishCard';
import { getApiUrl } from '../App';

export default function MenuPage({ onAddToCart }) {
    const [menuData, setMenuData] = useState([]);
    const [category, setCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch(`${getApiUrl()}/api/menu`);
                const data = await response.json();
                if (response.ok) {
                    setMenuData(data);
                }
            } catch (error) {
                console.error("Error fetching menu:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenu();
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