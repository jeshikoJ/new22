document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    // Hardcoded credentials for static UI demo
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "admin";

    // Check if already logged in (using sessionStorage for temporary auth)
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
    }

    function hideDashboard() {
        dashboardContainer.style.display = 'none';
        loginContainer.style.display = 'flex';
        loginForm.reset();
    }
});
