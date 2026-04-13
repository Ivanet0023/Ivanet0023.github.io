import React from 'react';

function DishCard({ item, onAddToCart }) {
    return (
        <article>
            <img src={item.img} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.desc}</p>
            <strong>{item.price} UAH</strong><br/><br/>
            <button className="add-to-cart-btn" onClick={() => onAddToCart(item)}>
                Add to Cart
            </button>
        </article>
    );
}

export default DishCard;