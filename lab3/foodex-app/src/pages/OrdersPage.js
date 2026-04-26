import React from 'react';

export default function OrdersPage({ orders }) {
    return (
        <section id="orders">
            <h2>My orders</h2>
            <div className="orders_list">
                {orders.length === 0 ? (
                    <p>No orders yet.</p>
                ) : (
                    orders.map(order => (
                        <article key={order.id} className="order_item">
                            <header style={{background: '#34495e', color: 'white', padding: '10px'}}>
                                <strong>Order #{order.id}</strong>
                                <span style={{float: 'right'}}>{order.date}</span>
                            </header>
                            <p style={{padding: '10px'}}>{order.items}</p>
                            <footer style={{background: '#2c3e50', color: 'white', padding: '15px'}}>
                                <span>Status: <mark>{order.status}</mark></span>
                                <strong style={{float: 'right'}}>Total: {order.total} UAH</strong>
                            </footer>
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}