import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0wfPJHbeTjkoEhmvLFI7taB53q6IgApI",
  authDomain: "new-born-f2cb6.firebaseapp.com",
  projectId: "new-born-f2cb6",
  storageBucket: "new-born-f2cb6.firebasestorage.app",
  messagingSenderId: "171649936148",
  appId: "1:171649936148:web:ded54cc43e130cf987f001",
  measurementId: "G-706ZL2PPPV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    const ADMIN_USER = "admin";
    const ADMIN_PASS = "admin";

    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        if (user === ADMIN_USER && pass === ADMIN_PASS) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
        } else {
            loginError.style.display = 'block';
            loginForm.reset();
        }
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('adminLoggedIn');
        hideDashboard();
    });

    function showDashboard() {
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'flex';
        loginError.style.display = 'none';
        fetchOrders();
    }

    function hideDashboard() {
        dashboardContainer.style.display = 'none';
        loginContainer.style.display = 'flex';
        loginForm.reset();
    }
    
    function fetchOrders() {
        const ordersQuery = query(collection(db, "orders"), orderBy("timestamp", "desc"));
        
        onSnapshot(ordersQuery, (snapshot) => {
            const tbody = document.querySelector('.recent-orders tbody');
            tbody.innerHTML = '';
            
            let totalSales = 0;
            let totalOrders = 0;
            
            snapshot.forEach((doc) => {
                const order = doc.data();
                totalOrders++;
                totalSales += order.totalAmount;
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>#${doc.id.substring(0,6).toUpperCase()}</td>
                    <td>
                        <strong>${order.customerName}</strong><br>
                        <small>${order.customerPhone}</small><br>
                        <small style="color:#888;">${order.items.map(i => i.quantity + 'x ' + i.name).join(', ')}</small>
                    </td>
                    <td>₹${order.totalAmount}</td>
                    <td><span class="status pending">${order.status}</span></td>
                `;
                tbody.appendChild(tr);
            });
            
            // Update stats
            document.querySelectorAll('.stat-details p')[0].textContent = `₹${totalSales}`;
            document.querySelectorAll('.stat-details p')[1].textContent = totalOrders;
        });
    }
});
