import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ cartCount }) {
    return (
        <header>
            <h1>FoodEx Delivery</h1>
            <nav>
                <ul>
                    <li><Link to="/">Menu</Link></li>
                    <li><Link to="/cart">Cart ({cartCount})</Link></li>
                    <li><Link to="/orders">My orders</Link></li>
                </ul>
            </nav>
        </header>
    );
}