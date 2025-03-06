document.addEventListener('DOMContentLoaded', function() {
    // References to role cards
    const donorRoleCard = document.getElementById('donor-role');
    const recipientRoleCard = document.getElementById('recipient-role');
    const doctorRoleCard = document.getElementById('doctor-role');
    
    // References to role forms
    const donorForm = document.getElementById('donor-form');
    const recipientForm = document.getElementById('recipient-form');
    const doctorForm = document.getElementById('doctor-form');
    
    // Function to reset active states
    function resetActiveStates() {
        // Remove active class from all role cards
        donorRoleCard.classList.remove('active');
        recipientRoleCard.classList.remove('active');
        doctorRoleCard.classList.remove('active');
        
        // Hide all forms
        donorForm.classList.add('hidden');
        recipientForm.classList.add('hidden');
        doctorForm.classList.add('hidden');
    }
    
    // Event listeners for role cards
    donorRoleCard.addEventListener('click', function() {
        resetActiveStates();
        donorRoleCard.classList.add('active');
        donorForm.classList.remove('hidden');
    });
    
    recipientRoleCard.addEventListener('click', function() {
        resetActiveStates();
        recipientRoleCard.classList.add('active');
        recipientForm.classList.remove('hidden');
    });
    
    doctorRoleCard.addEventListener('click', function() {
        resetActiveStates();
        doctorRoleCard.classList.add('active');
        doctorForm.classList.remove('hidden');
    });
    
    // Form validation
    const allForms = document.querySelectorAll('.role-form');
    
    allForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formId = form.id;
            let passwordField, confirmPasswordField;
            
            if (formId === 'donor-form') {
                passwordField = document.getElementById('donor-password');
                confirmPasswordField = document.getElementById('donor-confirm-password');
            } else if (formId === 'recipient-form') {
                passwordField = document.getElementById('recipient-password');
                confirmPasswordField = document.getElementById('recipient-confirm-password');
            } else if (formId === 'doctor-form') {
                passwordField = document.getElementById('doctor-password');
                confirmPasswordField = document.getElementById('doctor-confirm-password');
            }
            
            // Check if passwords match
            if (passwordField.value !== confirmPasswordField.value) {
                alert('Passwords do not match');
                return;
            }
            
            // If validation passes, simulate form submission
            alert('Registration successful! You can now log in with your credentials.');
            window.location.href = 'index.html';
        });
    });
});
