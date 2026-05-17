import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../App';

export default function OrdersPage() {
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${getApiUrl()}/api/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (response.ok) {
                setUserOrders(data);
            } else {
                console.error("Помилка завантаження:", data.message);
            }
        } catch (error) {
            console.error("Помилка завантаження:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDelete = async (orderId) => {
        if (window.confirm("Видалити цей запис про замовлення?")) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${getApiUrl()}/api/orders/${orderId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setUserOrders(prev => prev.filter(order => order.id !== orderId));
                } else {
                    const data = await response.json();
                    alert("Помилка видалення: " + data.message);
                }
            } catch (error) {
                alert("Помилка підключення до сервера");
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