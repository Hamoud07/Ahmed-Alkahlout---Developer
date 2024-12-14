import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Initialize Firebase with your config
const firebaseConfig = {
    apiKey: "AIzaSyAPMed36OlUdcwkzUHb0Lr35GOyeY-nOoU",
    authDomain: "brewtech-9bd37.firebaseapp.com",
    projectId: "brewtech-9bd37",
    storageBucket: "brewtech-9bd37.firebasestorage.app",
    messagingSenderId: "488918197341",
    appId: "1:488918197341:web:791f92ef15f49ae24259b4",
    measurementId: "G-M2ZXJQLYF7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Add click handler for My Orders in the dropdown
document.getElementById('myOrders').addEventListener('click', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Query orders for current user
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        let ordersHTML = '';
        
        if (querySnapshot.empty) {
            ordersHTML = `
                <div class="no-orders">
                    <p>No orders found</p>
                    <a href="products.html" class="view-all-button">Start Shopping</a>
                </div>
            `;
        } else {
            ordersHTML = `
                <div class="orders-list">
                    ${querySnapshot.docs.map(doc => {
                        const order = doc.data();
                        return `
                            <div class="order-card">
                                <div class="order-header">
                                    <span class="order-number">${order.orderNumber}</span>
                                    <span class="order-date">${new Date(order.orderDate).toLocaleDateString()}</span>
                                </div>
                                <div class="order-items">
                                    ${order.items.map(item => `
                                        <div class="order-item">
                                            <span>${item.name} x${item.quantity}</span>
                                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="order-total">
                                    <span>Total:</span>
                                    <span>$${order.total.toFixed(2)}</span>
                                </div>
                                <div class="order-status ${order.status}">
                                    ${order.status.toUpperCase()}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }

        // Create modal to display orders
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>My Orders</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    ${ordersHTML}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        showNotification('Failed to load orders', 'error');
    }
}); 