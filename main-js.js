document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle (for smaller screens)
    const createMobileNav = () => {
        const nav = document.querySelector('nav');
        const menuToggle = document.createElement('div');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.style.display = 'none';
        
        // Insert before the first child of nav
        nav.insertBefore(menuToggle, nav.firstChild);
        
        const navUl = document.querySelector('nav ul');
        
        // Toggle menu on click
        menuToggle.addEventListener('click', function() {
            navUl.classList.toggle('active');
        });
        
        // Media query for responsive design
        const checkScreenSize = () => {
            if (window.innerWidth <= 768) {
                menuToggle.style.display = 'block';
                navUl.classList.add('mobile');
            } else {
                menuToggle.style.display = 'none';
                navUl.classList.remove('mobile', 'active');
            }
        };
        
        // Check on page load
        checkScreenSize();
        
        // Check on resize
        window.addEventListener('resize', checkScreenSize);
    };
    
    // Create mobile navigation if needed
    createMobileNav();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Login modal functionality
    const setupLoginModal = () => {
        // Create login modal if it doesn't exist
        if (!document.getElementById('login-modal')) {
            const loginModal = document.createElement('div');
            loginModal.id = 'login-modal';
            loginModal.className = 'modal-overlay';
            
            loginModal.innerHTML = `
                <div class="modal">
                    <div class="modal-header">
                        <h3>Login to LifeStream</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="login-options">
                            <div class="login-option active" data-role="donor">Donor</div>
                            <div class="login-option" data-role="recipient">Recipient</div>
                            <div class="login-option" data-role="doctor">Doctor</div>
                        </div>
                        <form id="login-form">
                            <div class="form-group">
                                <label for="login-email">Email/Username</label>
                                <input type="text" id="login-email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="login-password">Password</label>
                                <input type="password" id="login-password" name="password" required>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn-primary">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            
            document.body.appendChild(loginModal);
            
            // Toggle login option
            const loginOptions = loginModal.querySelectorAll('.login-option');
            loginOptions.forEach(option => {
                option.addEventListener('click', function() {
                    loginOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Close modal
            loginModal.querySelector('.modal-close').addEventListener('click', function() {
                loginModal.classList.remove('active');
            });
            
            // Close modal when clicking outside
            loginModal.addEventListener('click', function(e) {
                if (e.target === loginModal) {
                    loginModal.classList.remove('active');
                }
            });
            
            // Handle login form submission
            const loginForm = loginModal.querySelector('#login-form');
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const activeRole = loginModal.querySelector('.login-option.active').dataset.role;
                const email = loginForm.elements['email'].value;
                const password = loginForm.elements['password'].value;
                
                // Simple validation
                if (!email || !password) {
                    alert('Please fill in all fields');
                    return;
                }
                
                // Simulate login and redirect to dashboard
                let dashboardUrl;
                
                switch (activeRole) {
                    case 'donor':
                        dashboardUrl = 'donor-dashboard.html';
                        break;
                    case 'recipient':
                        dashboardUrl = 'recipient-dashboard.html';
                        break;
                    case 'doctor':
                        dashboardUrl = 'doctor-dashboard.html';
                        break;
                    default:
                        dashboardUrl = 'index.html';
                }
                
                window.location.href = dashboardUrl;
            });
        }
        
        // Login button click handler
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('login-modal').classList.add('active');
            });
        }
    };
    
    // Setup login modal
    setupLoginModal();
    
    // Update copyright year
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.textContent = footerYear.textContent.replace(/\d{4}/, currentYear);
    }
});
