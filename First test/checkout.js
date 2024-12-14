// Move clearCart function outside DOMContentLoaded
function clearCart() {
    localStorage.removeItem('cart');
    const cartSection = document.querySelector('.cart-items');
    cartSection.innerHTML = `
        <div class="cart-header">
            <h2>Your Cart</h2>
            <button class="clear-cart-button" onclick="clearCart()">Clear Cart</button>
        </div>
        <div class="empty-cart">
            <p>Your cart is empty</p>
            <a href="products.html" class="view-all-button">Continue Shopping</a>
        </div>
    `;
    // Update totals to zero
    document.querySelector('.summary-item:nth-child(1) span:last-child').textContent = '$0.00';
    document.querySelector('.summary-item:nth-child(3) span:last-child').textContent = '$0.00';
    document.querySelector('.summary-total span:last-child').textContent = '$0.00';
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart functionality
    loadCartItems();

    // Calculate and update totals
    function updateTotals() {
        let subtotal = 0;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Calculate subtotal from cart items
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        const tax = subtotal * 0.2; // 20% tax
        const total = subtotal + tax;

        // Update summary
        document.querySelector('.summary-item:nth-child(1) span:last-child').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.summary-item:nth-child(3) span:last-child').textContent = `$${tax.toFixed(2)}`;
        document.querySelector('.summary-total span:last-child').textContent = `$${total.toFixed(2)}`;
    }

    // Check for empty cart
    function checkEmptyCart() {
        const cartItems = document.querySelectorAll('.cart-item');
        if (cartItems.length === 0) {
            const cartSection = document.querySelector('.cart-items');
            cartSection.innerHTML = `
                <div class="cart-header">
                    <h2>Your Cart</h2>
                    <button class="clear-cart-button" onclick="clearCart()">Clear Cart</button>
                </div>
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <a href="products.html" class="view-all-button">Continue Shopping</a>
                </div>
            `;
        }
    }

    // Handle step navigation
    checkoutButton.addEventListener('click', function() {
        const currentStep = document.querySelector('.step.active');
        const nextStep = currentStep.nextElementSibling.nextElementSibling;
        const cartSection = document.querySelector('.cart-items');
        const shippingForm = document.querySelector('.shipping-form');
        
        if (nextStep && nextStep.classList.contains('step')) {
            currentStep.classList.remove('active');
            nextStep.classList.add('active');
            
            // Update content and button text based on step
            if (nextStep.querySelector('.step-text').textContent === 'Shipping') {
                cartSection.style.display = 'none';
                shippingForm.style.display = 'block';
                this.textContent = 'Proceed to Payment';
            } else if (nextStep.querySelector('.step-text').textContent === 'Payment') {
                shippingForm.style.display = 'none';
                this.textContent = 'Place Order';
                // Here you could show payment form
                const cartSection = document.querySelector('.cart-items');
                cartSection.innerHTML = `
                    <h2>Payment Information</h2>
                    <form class="payment-form">
                        <div class="form-group">
                            <label for="cardNumber">Card Number</label>
                            <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="expiry">Expiry Date</label>
                                <input type="text" id="expiry" placeholder="MM/YY" required>
                            </div>
                            <div class="form-group">
                                <label for="cvv">CVV</label>
                                <input type="text" id="cvv" placeholder="123" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="cardName">Name on Card</label>
                            <input type="text" id="cardName" required>
                        </div>
                    </form>
                `;
                cartSection.style.display = 'block';
            }
        }
    });

    // Add input validation
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checkValidity()) {
                this.style.borderColor = '#ddd';
            } else {
                this.style.borderColor = '#e74c3c';
            }
        });
    });

    // Add at the start of DOMContentLoaded
    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartSection = document.querySelector('.cart-items');
        const orderItems = document.getElementById('order-items');
        let subtotal = 0;
        
        if (cart.length === 0) {
            cartSection.innerHTML = `
                <div class="cart-header">
                    <h2>Your Cart</h2>
                    <button class="clear-cart-button" onclick="clearCart()">Clear Cart</button>
                </div>
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <a href="products.html" class="view-all-button">Continue Shopping</a>
                </div>
            `;
            updateTotals();
            return;
        }

        let cartHTML = `
            <div class="cart-header">
                <h2>Your Cart</h2>
                <button class="clear-cart-button" onclick="clearCart()">Clear Cart</button>
            </div>
        `;
        
        orderItems.innerHTML = ''; // Clear existing items
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            cartHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                    <div class="item-price">
                        <span class="price">$${itemTotal.toFixed(2)}</span>
                    </div>
                </div>
            `;

            // Add to order summary
            orderItems.innerHTML += `
                <div class="summary-item">
                    <span>${item.name} (${item.quantity}x)</span>
                    <span>$${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });

        cartSection.innerHTML = cartHTML;

        // Update totals
        const tax = subtotal * 0.2;
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    // Call loadCartItems when page loads
    loadCartItems();
}); 

// Add this to your checkout.js
async function saveOrder(cart) {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) return;

    const db = getFirestore();
    
    try {
        const orderData = {
            userId: user.uid,
            items: cart,
            total: calculateTotal(cart),
            status: 'pending',
            orderDate: new Date().toISOString(),
            orderNumber: generateOrderNumber()
        };

        // Add to orders collection
        await addDoc(collection(db, "orders"), orderData);
        
        // Clear cart after successful order
        localStorage.removeItem('cart');
        
        // Show success notification
        showNotification('Order placed successfully!', 'success');
        
        // Redirect to thank you page
        setTimeout(() => {
            window.location.href = 'thank-you.html';
        }, 1500);
    } catch (error) {
        showNotification('Failed to place order. Please try again.', 'error');
    }
}

function calculateTotal(cart) {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let tax = subtotal * 0.2;
    return subtotal + tax;
}

function generateOrderNumber() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
} 