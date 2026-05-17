import React, { useState, useEffect } from 'react';
import DishCard from '../components/DishCard';
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function MenuPage({ onAddToCart }) {
    const [menuData, setMenuData] = useState([]);
    const [category, setCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMenuFromFirestore = async () => {
            try {
                const menuCollection = collection(db, 'menu');
                const menuSnapshot = await getDocs(menuCollection);

                const menuList = menuSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setMenuData(menuList);
                setIsLoading(false);
            } catch (error) {
                console.error("Помилка завантаження з бази:", error);
                setIsLoading(false);
            }
        };

        fetchMenuFromFirestore();
    }, []);

    const filteredMenu = category === 'All'
        ? menuData
        : menuData.filter(item => item.category === category);

    if (isLoading) return <p>Loading menu from cloud...</p>;

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