import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function OrdersPage() {
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = auth.currentUser;

    const fetchOrders = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const q = query(
                collection(db, "orders"),
                where("userId", "==", user.uid)
            );
            const querySnapshot = await getDocs(q);
            const ordersData = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setUserOrders(ordersData);
        } catch (error) {
            console.error("Помилка завантаження:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    // Функція для видалення замовлення з бази [cite: 47]
    const handleDelete = async (orderId) => {
        if (window.confirm("Видалити цей запис про замовлення?")) {
            try {
                await deleteDoc(doc(db, "orders", orderId));
                // Оновлюємо список локально після видалення
                setUserOrders(prev => prev.filter(order => order.id !== orderId));
            } catch (error) {
                alert("Помилка видалення: " + error.message);
            }
        }
    };

    if (loading) return <div className="loader">Завантаження замовлень...</div>;

    return (
        <main className="orders-container">
            <h2>My Orders</h2>
            {userOrders.length === 0 ? (
                <div className="empty-message">У вас ще немає замовлень.</div>
            ) : (
                <div className="orders-grid">
                    {userOrders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <span className="order-date">{order.date}</span>
                                <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="order-details">
                                <p><strong>Сума:</strong> {order.total} грн</p>
                                <div className="order-items-list">
                                    {/* Якщо ви зберігали items як масив об'єктів */}
                                    {Array.isArray(order.items) ?
                                        order.items.map((item, index) => (
                                            <span key={index}>{item.name} x{item.quantity}{index < order.items.length - 1 ? ', ' : ''}</span>
                                        )) : <span>{order.items}</span>
                                    }
                                </div>
                            </div>
                            <button className="delete-btn" onClick={() => handleDelete(order.id)}>
                                Delete Order
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}