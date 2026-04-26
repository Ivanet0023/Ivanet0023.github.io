import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ cartCount, user, onLogout }) {
    return (
        <header>
            <h1>FoodEx Delivery</h1>
            <nav>
                <ul>
                    <li><Link to="/">Menu</Link></li>
                    <li><Link to="/cart">Cart ({cartCount})</Link></li>

                    {/* Перевірка: якщо користувач увійшов, показуємо email та Logout */}
                    {user ? (
                        <>
                            <li><Link to="/orders">Orders</Link></li>
                            <li className="user-email">{user.email}</li>
                            <li><button onClick={onLogout} className="btn-logout">Logout</button></li>
                        </>
                    ) : (
                        /* Якщо ні — показуємо посилання на Login та Register */
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}