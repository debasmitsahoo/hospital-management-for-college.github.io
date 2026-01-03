/**
 * Authentication Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('loginError');

    // Check if already logged in
    const session = Utils.Storage.get('session');
    if (session && session.user) {
        window.location.href = 'dashboard.html';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            // Get users from storage (populated by data.js)
            const users = Utils.Storage.get('users') || [];

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Login Success
                errorMsg.style.display = 'none';

                // precise session with timestamp
                const sessionData = {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    loginTime: new Date().toISOString()
                };

                Utils.Storage.set('session', sessionData);

                Utils.showToast('Login Successful! Redirecting...', 'success');

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);

            } else {
                // Login Failed
                errorMsg.style.display = 'block';
                errorMsg.classList.add('fade-in');
                Utils.showToast('Invalid credentials', 'error');
            }
        });
    }
});
