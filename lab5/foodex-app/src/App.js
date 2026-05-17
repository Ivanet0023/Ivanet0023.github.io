import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Helper function to get API URL
export const getApiUrl = () => {
    // If it's running locally in development mode, point to port 5000. 
    // In production (Render), the API is on the same host, so use empty string.
    return process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';
};

function App() {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('foodex_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [user, setUser] = useState(null);

    useEffect(() => {
        localStorage.setItem('foodex_cart', JSON.stringify(cart));
    }, [cart]);

    // Check for user token on load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${getApiUrl()}/api/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser(data.user);
                } else {
                    localStorage.removeItem('token');
                }
            })
            .catch(err => console.error("Error fetching profile:", err));
        }
    }, []);

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateQuantity = (id, delta) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + delta } : item
            ).filter(item => item.quantity > 0)
        );
    };

    const placeOrder = async () => {
        if (!user) {
            alert("Login to make an order .");
            return;
        }

        if (cart.length === 0) return;

        try {
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const token = localStorage.getItem('token');
            const response = await fetch(`${getApiUrl()}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: new Date().toLocaleString(),
                    items: cart.map(item => ({ name: item.name, quantity: item.quantity })),
                    total: totalPrice,
                    status: "In Progress"
                })
            });

            const data = await response.json();

            if (response.ok) {
                setCart([]);
                alert("Order is successful!");
            } else {
                alert(data.message || "An error occurred.");
            }
        } catch (error) {
            console.error("API Error:", error);
            alert("An error occurred connecting to the server.");
        }
    };

    const clearAllData = () => {
        if (window.confirm("Are you sure to clear order history?")) {
            setCart([]);
            localStorage.removeItem('foodex_cart');
        }
    };

    return (
        <Router>
            <div className="App">
                <Header
                    cartCount={cart.length}
                    user={user}
                    onLogout={handleLogout}
                />
                <Routes>
                    <Route path="/" element={<MenuPage onAddToCart={addToCart} />} />
                    <Route path="/cart" element={
                        <CartPage cart={cart} updateQuantity={updateQuantity} onPlaceOrder={placeOrder} />
                    } />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/login" element={<LoginPage setUser={setUser} />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;