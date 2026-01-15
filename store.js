// Shopping Cart Functionality

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function parsePrice(priceText) {
    // Extract the current price, handling sale prices
    const priceMatch = priceText.match(/₱\s*([\d,]+)/);
    return priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;
}

function addToCart(productName, productImage, productPrice) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            image: productImage,
            price: productPrice,
            quantity: 1
        });
    }
    saveCart();
    updateCartCount();
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = newQuantity;
        saveCart();
        updateCartCount();
        renderCart();
    }
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0';
        return;
    }

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>₱${item.price}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(itemElement);
    });

    cartTotal.textContent = calculateTotal().toLocaleString();
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count and render
    updateCartCount();
    renderCart();

    // Cart button event listener
    document.getElementById('cart-btn').addEventListener('click', toggleCart);

    // Close cart event listener
    document.getElementById('close-cart').addEventListener('click', toggleCart);

    // Add to cart buttons event listeners
    document.querySelectorAll('.card button:first-of-type').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const productName = card.querySelector('h2').textContent;
            const productImage = card.querySelector('img').src;
            const priceElement = card.querySelector('.price');
            const productPrice = parsePrice(priceElement.textContent);

            addToCart(productName, productImage, productPrice);
        });
    });

    // Checkout button (for presentation, just alert)
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
        } else {
            alert(`Checkout total: ₱${calculateTotal().toLocaleString()}\n\nThank you for your purchase!`);
            cart = [];
            saveCart();
            updateCartCount();
            renderCart();
            toggleCart();
        }
    });
});
