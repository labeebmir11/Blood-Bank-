document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    initDashboard();
    
    // Initialize sidebar menu
    initSidebar();
    
    // Load blood inventory data
    loadBloodInventory();
});

function initDashboard() {
    // Display welcome message
    const doctorName = document.getElementById('doctor-name');
    if (doctorName) {
        // In a real application, this would be retrieved from a database or session
        // For demo purposes, we'll use a hardcoded value
        doctorName.textContent = 'Dr. Asif Iqbal';
    }
    
    // Set up dashboard statistics
    updateDashboardStats();
}

function updateDashboardStats() {
    // In a real application, these values would be fetched from an API or backend
    // For demo purposes, we'll use hardcoded values
    
    // Fetch statistic elements
    const totalBloodUnits = document.getElementById('total-blood-units');
    const pendingRequests = document.getElementById('pending-requests');
    const registeredDonors = document.getElementById('registered-donors');
    const registeredRecipients = document.getElementById('registered-recipients');
    
    // Update with demo data
    if (totalBloodUnits) totalBloodUnits.textContent = '152';
    if (pendingRequests) pendingRequests.textContent = '8';
    if (registeredDonors) registeredDonors.textContent = '102';
    if (registeredRecipients) registeredRecipients.textContent = '75';
    
    // Animate the numbers (optional enhancement)
    animateNumbers();
}

function animateNumbers() {
    // This is a simple animation for numbers
    const statNumbers = document.querySelectorAll('.stat-card-info p');
    
    statNumbers.forEach(number => {
        const finalValue = parseInt(number.textContent);
        let startValue = 0;
        const duration = 1500;
        const increment = finalValue / (duration / 16); // 60 fps
        
        const updateNumber = () => {
            startValue += increment;
            if (startValue < finalValue) {
                number.textContent = Math.floor(startValue);
                requestAnimationFrame(updateNumber);
            } else {
                number.textContent = finalValue;
            }
        };
        
        updateNumber();
    });
}

function initSidebar() {
    // Highlight active menu item
    const sidebarItems = document.querySelectorAll('.sidebar-nav ul li');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
    
    // Add mobile sidebar toggle for responsive design
    const createMobileSidebarToggle = () => {
        const dashboardMain = document.querySelector('.dashboard-main');
        const sidebar = document.querySelector('.sidebar');
        
        if (!dashboardMain || !sidebar) return;
        
        const sidebarToggle = document.createElement('button');
        sidebarToggle.className = 'sidebar-toggle';
        sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        dashboardMain.querySelector('.dashboard-header').prepend(sidebarToggle);
        
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 992 && 
                !sidebar.contains(e.target) && 
                e.target !== sidebarToggle &&
                !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    };
    
    createMobileSidebarToggle();
}

function loadBloodInventory() {
    // Sample blood inventory data
    // In a real application, this would be fetched from a database
    const bloodGroups = [
        { group: 'A+', units: 32, level: '65%' },
        { group: 'A-', units: 17, level: '35%' },
        { group: 'B+', units: 28, level: '55%' },
        { group: 'B-', units: 12, level: '25%' },
        { group: 'AB+', units: 18, level: '40%' },
        { group: 'AB-', units: 8, level: '15%' },
        { group: 'O+', units: 25, level: '50%' },
        { group: 'O-', units: 12, level: '25%' }
    ];
    
    // Display inventory
    const bloodInventory = document.querySelector('.blood-inventory');
    
    if (!bloodInventory) return;
    
    // Clear existing content
    bloodInventory.innerHTML = '';
    
    // Add blood group items
    bloodGroups.forEach(group => {
        // Check if blood level is critical (less than 20%)
        const isCritical = parseInt(group.level) < 20;
        
        const bloodGroupItem = document.createElement('div');
        bloodGroupItem.className = 'blood-group-item';
        bloodGroupItem.innerHTML = `
            <div class="blood-group">${group.group}</div>
            <div class="blood-level ${isCritical ? 'critical' : ''}" style="--level: ${group.level}"></div>
            <div class="blood-quantity">${group.units} units</div>
        `;
        
        bloodInventory.appendChild(bloodGroupItem);
    });
    
    // Add inventory update functionality
    const updateButton = document.querySelector('.btn-secondary');
    
    if (updateButton) {
        updateButton.addEventListener('click', function() {
            // Create a modal for updating inventory
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal">
                    <div class="modal-header">
                        <h3>Update Blood Inventory</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="inventory-form">
                            <div class="form-group">
                                <label for="blood-group">Blood Group</label>
                                <select id="blood-group" name="blood_group" required>
                                    <option value="">Select</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="operation">Operation</label>
                                <select id="operation" name="operation" required>
                                    <option value="">Select</option>
                                    <option value="add">Add Units</option>
                                    <option value="remove">Remove Units</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="units">Number of Units</label>
                                <input type="number" id="units" name="units" min="1" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-primary" id="update-inventory">Update</button>
                        <button class="btn-secondary modal-close-btn">Cancel</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Show modal
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            
            // Close modal functions
            const closeModal = () => {
                modal.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            };
            
            modal.querySelector('.modal-close').addEventListener('click', closeModal);
            modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
            
            // Close when clicking outside
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // Handle inventory update
            modal.querySelector('#update-inventory').addEventListener('click', function() {
                const form = modal.querySelector('#inventory-form');
                const bloodGroup = form.elements['blood_group'].value;
                const operation = form.elements['operation'].value;
                const units = parseInt(form.elements['units'].value);
                
                if (!bloodGroup || !operation || isNaN(units) || units < 1) {
                    alert('Please fill in all fields correctly');
                    return;
                }
                
                // Simulate updating the inventory
                alert(`${operation === 'add' ? 'Added' : 'Removed'} ${units} units of ${bloodGroup} blood.`);
                
                closeModal();
                
                // In a real app, this would trigger a refresh of the inventory data
                // For demo purposes, we'll just reload the current data
                loadBloodInventory();
            });
        });
    }
}
