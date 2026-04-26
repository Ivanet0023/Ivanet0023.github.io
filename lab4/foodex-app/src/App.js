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

import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from './firebase';

function App() {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('foodex_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('foodex_cart', JSON.stringify(cart));
    }, [cart]);

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

    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth);
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

            const newOrder = {
                userId: user.uid,
                userEmail: user.email,
                date: new Date().toLocaleString(),
                items: cart.map(item => ({ name: item.name, quantity: item.quantity })),
                total: totalPrice,
                status: "In Progress"
            };

            await addDoc(collection(db, "orders"), newOrder);

            setCart([]);
            alert("Order is successful!");
        } catch (error) {
            console.error("БД:", error);
            alert("An error ocured.");
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
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;