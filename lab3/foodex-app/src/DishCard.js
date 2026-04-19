import React, { useState } from 'react';

function DishCard({ item, onAddToCart }) {
    // Стан для відстеження кліку
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        onAddToCart(item); // Викликаємо глобальну функцію додавання
        setIsAdded(true);  // Міняємо стан на "Додано"

        // Через 1 секунду повертаємо стан назад
        setTimeout(() => {
            setIsAdded(false);
        }, 1000);
    };

    return (
        <article className="dish-card">
            <img src={item.img} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.desc}</p>
            <strong>{item.price} UAH</strong><br/><br/>

            {/* Динамічний клас та текст */}
            <button
                className={`add-to-cart-btn ${isAdded ? 'btn-added' : ''}`}
                onClick={handleAdd}
            >
                {isAdded ? "Added!" : "Add to Cart"}
            </button>
        </article>
    );
}

export default DishCard;