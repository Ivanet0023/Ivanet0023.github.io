import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import Footer from './components/Footer';

function App() {
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);

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

    const updateQuantity = (id, delta) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + delta } : item
            ).filter(item => item.quantity > 0)
        );
    };

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
        setCart([]);
        alert("Order placed successfully!");
    };

    return (
        <Router>
            <div className="App">
                <Header cartCount={cart.length} />

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

                <Footer />
            </div>
        </Router>
    );
}

export default App;