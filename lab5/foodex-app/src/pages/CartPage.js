import React from 'react';

export default function CartPage({ cart, updateQuantity, onPlaceOrder }) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <section id="cart">
            <h2>Cart</h2>
            {cart.length === 0 ? (
                <div className="no-items"><p>Your cart is empty.</p></div>
            ) : (
                <>
                    <div className="cart_list">
                        <div className="cart_header">
                            <span>Item</span><span>Price</span><span>Qty</span><span>Sub</span>
                        </div>
                        {cart.map(item => (
                            <div key={item.id} className="cart_row">
                                <span>{item.name}</span>
                                <span>{item.price} UAH</span>
                                <div className="qty_controls">
                                    <button className="qty_btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                    <span className="qty_val">{item.quantity}</span>
                                    <button className="qty_btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                </div>
                                <span>{item.price * item.quantity} UAH</span>
                            </div>
                        ))}
                    </div>
                    <div className="cart_summary">
                        <p className="cart_total"><strong>Total: {total} UAH</strong></p>
                        <button id="checkout_btn" onClick={onPlaceOrder}>Place Order</button>
                    </div>
                </>
            )}
        </section>
    );
}