document.addEventListener('DOMContentLoaded', function() {
    // Role selection
    const roleCards = document.querySelectorAll('.role-card');
    const forms = document.querySelectorAll('.role-form');
    
    roleCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            roleCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Hide all forms
            forms.forEach(form => form.classList.add('hidden'));
            
            // Show selected form
            const formId = this.id.replace('-role', '-form');
            document.getElementById(formId).classList.remove('hidden');
        });
    });
    
    // Form submission
    const donorForm = document.getElementById('donor-form');
    if (donorForm) {
        donorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate passwords
            const password = document.getElementById('donor-password').value;
            const confirmPassword = document.getElementById('donor-confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // Collect form data
            const formData = {
                name: document.getElementById('donor-name').value,
                age: document.getElementById('donor-age').value,
                gender: document.getElementById('donor-gender').value,
                blood_type: document.getElementById('donor-blood-type').value,
                contact_no: document.getElementById('donor-contact').value,
                email: document.getElementById('donor-email').value,
                address: document.getElementById('donor-address').value,
                last_donation_date: document.getElementById('donor-last-donation').value
            };
            
            // Send registration request
            fetch('/api/register/donor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registration successful! Please login with your name and contact number.');
                    window.location.href = '/login';
                } else {
                    alert('Registration failed: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Registration error:', error);
                alert('Registration failed. Please try again.');
            });
        });
    }
    
    const recipientForm = document.getElementById('recipient-form');
    if (recipientForm) {
        recipientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate passwords
            const password = document.getElementById('recipient-password').value;
            const confirmPassword = document.getElementById('recipient-confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // Collect form data
            const formData = {
                name: document.getElementById('recipient-name').value,
                age: document.getElementById('recipient-age').value,
                gender: document.getElementById('recipient-gender').value,
                blood_type: document.getElementById('recipient-blood-type').value,
                contact_no: document.getElementById('recipient-contact').value,
                hospital_id: document.getElementById('recipient-hospital').value
            };
            
            // Send registration request
            fetch('/api/register/recipient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registration successful! Please login with your name and contact number.');
                    window.location.href = '/login';
                } else {
                    alert('Registration failed: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Registration error:', error);
                alert('Registration failed. Please try again.');
            });
        });
    }
    
    const doctorForm = document.getElementById('doctor-form');
    if (doctorForm) {
        doctorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate passwords
            const password = document.getElementById('doctor-password').value;
            const confirmPassword = document.getElementById('doctor-confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // Collect form data
            const formData = {
                name: document.getElementById('doctor-name').value,
                specialization: document.getElementById('doctor-specialization').value,
                contact_no: document.getElementById('doctor-contact').value,
                email: document.getElementById('doctor-email').value,
                hospital_id: document.getElementById('doctor-hospital').value
            };
            
            // Send registration request
            fetch('/api/register/doctor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registration successful! Please login with your name and contact number.');
                    window.location.href = '/login';
                } else {
                    alert('Registration failed: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Registration error:', error);
                alert('Registration failed. Please try again.');
            });
        });
    }
});
