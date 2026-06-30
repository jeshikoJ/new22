// Removed Firebase dependencies since we are now using a MongoDB Backend API

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
    
    async function fetchOrders() {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            
            if (!data.success) {
                throw new Error("Failed to load orders");
            }

            const tbody = document.querySelector('.recent-orders tbody');
            tbody.innerHTML = '';
            
            let totalSales = 0;
            let totalOrders = 0;
            
            data.orders.forEach((order) => {
                totalOrders++;
                totalSales += order.totalAmount;
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>#${order._id.substring(order._id.length - 6).toUpperCase()}</td>
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
        } catch (error) {
            console.error("Error fetching orders:", error);
            const tbody = document.querySelector('.recent-orders tbody');
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Failed to load orders from database.</td></tr>';
        }
    }
});
