const menuItems = [
    { id: 1, name: "Pizza Pepperoni", price: 199, img: "img/pizza_pepp.png", desc: "Thin crispy dough with San Marzano sauce and pepperoni." },
    { id: 2, name: "Pizza Margherita", price: 239, img: "img/pizza_marg.png", desc: "Traditional Italian pizza with mozzarella and basil." },
    { id: 3, name: "Baked Potatoes", price: 149, img: "img/backed_potatoes.png", desc: "Crispy outside, melt-in-your-mouth inside." },
    { id: 4, name: "French Fries", price: 119, img: "img/french_fries.png", desc: "Golden and crispy on the outside while maintaining a fluffy, soft interior" }
];

let cart = [];
let orders = [];

function renderMenu() {
    const menuGrid = document.querySelector('.menu_grid');
    if (!menuGrid) return;

    menuGrid.innerHTML = '';
    for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];
        menuGrid.innerHTML += `
            <article>
                <img src="${item.img}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <strong>${item.price} UAH</strong><br><br>
                <button class="add-to-cart-btn" onclick="addToCart(${item.id}, this)">Add to Cart</button>
            </article>`;
    }
}

function addToCart(id, button) {
    button.classList.add('btn-added');
    const originalText = button.innerText;
    button.innerText = "Added!";

    setTimeout(() => {
        button.classList.remove('btn-added');
        button.innerText = originalText;
    }, 1000);
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const product = menuItems.find(item => item.id === id);
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
}

function updateQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    renderCart();
}

function renderCart() {
    const cartList = document.querySelector('.cart_list');
    if (!cartList) return;

    cartList.innerHTML = `
        <li class="cart_header">
            <span>Item</span><span>Price</span><span>Qty</span><span>Sub</span>
        </li>`;

    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const subtotal = item.price * item.quantity;
        total += subtotal;

        cartList.innerHTML += `
            <li class="cart_row">
                <span>${item.name}</span>
                <span>${item.price} UAH</span>
                <div class="qty_controls">
                    <button class="qty_btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="qty_val">${item.quantity}</span>
                    <button class="qty_btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <span>${subtotal} UAH</span>
            </li>`;
    }

    document.querySelector('.cart_total strong').innerText = `Total: ${total} UAH`;
}

function renderOrders() {
    const ordersList = document.querySelector('.orders_list');
    if (!ordersList) return;

    ordersList.innerHTML = '';
    let i = 0;
    while (i < orders.length) {
        const order = orders[i];
        ordersList.innerHTML += `
            <li class="order_item">
                <article>
                    <header style="background: #34495e; color: white; padding: 10px; border-radius: 5px 5px 0 0;">
                        <strong>Order #${order.id}</strong>
                        <span style="float: right;">${order.date}</span>
                    </header>
                    <p style="padding: 10px;">${order.items}</p>
                    <footer style="background: #2c3e50; color: white; padding: 15px; border-radius: 0 0 5px 5px;">
                        <span>Status: <mark style="padding: 2px 5px; border-radius: 3px;">${order.status}</mark></span>
                        <strong style="float: right;">Total: ${order.total} UAH</strong>
                    </footer>
                </article>
            </li>`;
        i++;
    }
}

// Додаємо другий параметр orderId
function startDeliveryTimer(minutes, orderId) {
    const ordersSection = document.getElementById('orders');
    const timerDisplay = document.createElement('div');
    timerDisplay.className = "delivery-alert";
    timerDisplay.style.cssText = "background:#e67e22; color:white; padding:15px; margin:20px; border-radius:8px; font-weight:bold;";
    ordersSection.prepend(timerDisplay);

    let seconds = minutes * 60;
    const countdown = setInterval(() => {
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;

        timerDisplay.innerHTML = `Delivery in progress: ${mins}:${secs < 10 ? '0' : ''}${secs}`;

        if (seconds <= 0) {
            clearInterval(countdown);
            timerDisplay.innerHTML = "Your order has been delivered!";
            timerDisplay.style.background = "#27ae60";

            const deliveredOrder = orders.find(o => o.id === orderId);
            if (deliveredOrder) {
                deliveredOrder.status = "Done";
                renderOrders();
            }
        }
        seconds--;
    }, 1000);
}

document.getElementById('checkout_btn').onclick = function() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const itemsSummary = cart.map(item => `${item.name} x${item.quantity}`).join(", ");
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder = {
        id: orders.length + 1,
        date: new Date().toLocaleDateString(),
        items: itemsSummary,
        total: totalPrice,
        status: "In Progress"
    };

    orders.push(newOrder);
    cart = [];

    renderCart();
    renderOrders();
    startDeliveryTimer(1, newOrder.id);

    window.location.hash = "orders";
};

window.onload = () => {
    renderMenu();
    renderCart();
    renderOrders();
};