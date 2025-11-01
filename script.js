// script.js (Core logic for Smart Parking Finder Frontend)

// --- Global Configuration ---
const API_BASE_URL = "http://localhost:5000/api";
const USER_ID = 1; // Simulated user ID for a single-developer frontend test

// Simulated Database
let username = localStorage.getItem('username') || 'Guest';

let simulatedSlots = [
    { id: 1, isAvailable: true, name: "A-1" },
    { id: 2, isAvailable: false, name: "A-2" },
    { id: 3, isAvailable: true, name: "B-1" },
    { id: 4, isAvailable: true, name: "B-2" },
    { id: 5, isAvailable: false, name: "C-1" },
    { id: 6, isAvailable: true, name: "C-2" },
    { id: 7, isAvailable: false, name: "D-1" },
    { id: 8, isAvailable: true, name: "D-2" },
];

let simulatedBookings = [
    { id: 101, slotId: 3, slotName: "B-1", startTime: new Date(Date.now() - 3600000) },
];


// --- Utility Functions ---

/**
 * Custom Modal/Message Box instead of alert()/confirm()
 * @param {string} title - Modal title.
 * @param {string} message - Modal body message.
 * @param {boolean} isConfirm - If true, shows OK and Cancel buttons.
 * @returns {Promise<boolean>} - Resolves with true (OK) or false (Cancel/Close).
 */
function showMessage(title, message, isConfirm = false) {
    return new Promise(resolve => {
        const modalHtml = `
            <div id="custom-modal" class="custom-modal-backdrop">
                <div class="custom-modal-content bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                    <h3 class="text-xl font-bold mb-4 ${isConfirm ? 'text-danger' : 'text-primary'} border-b pb-2">
                        <i class="${isConfirm ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle'} mr-2"></i>${title}
                    </h3>
                    <p class="text-gray-700 mb-6">${message}</p>
                    <div class="flex justify-end space-x-3">
                        ${isConfirm ? `
                            <button id="modal-cancel" class="px-4 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition">Cancel</button>
                            <button id="modal-ok" class="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-danger hover:bg-red-600 transition">Confirm</button>
                        ` : `
                            <button id="modal-ok" class="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-primary hover:bg-blue-600 transition">OK</button>
                        `}
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('custom-modal');
        const okButton = document.getElementById('modal-ok');
        const cancelButton = document.getElementById('modal-cancel');

        const closeModal = (result) => {
            modal.remove();
            resolve(result);
        };

        // Event listeners for resolution
        okButton.addEventListener('click', () => closeModal(true));
        if (cancelButton) {
            cancelButton.addEventListener('click', () => closeModal(false));
        }
        
        // Handle backdrop click to close (only if not a confirm dialog)
        if (!isConfirm) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(false); 
            });
        }
    });
}


/**
 * --- Login/Auth Logic ---
 */
function checkAuth() {
    const currentPage = window.location.pathname.split('/').pop();
    const isAuthenticated = localStorage.getItem('username');

    if (currentPage !== 'login.html' && !isAuthenticated) {
        showMessage("Access Denied", "Please log in to view the dashboard.").then(() => {
            window.location.href = 'login.html';
        });
        return false;
    }
    return true;
}

function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const inputUsername = form.username.value;
    const inputPassword = form.password.value;

    if (inputUsername && inputPassword) {
        // In a real app, this would be an API call
        localStorage.setItem('username', inputUsername);
        username = inputUsername;
        showMessage("Success!", `Welcome back, ${inputUsername}!`).then(() => {
            window.location.href = 'dashboard.html';
        });
    } else {
        showMessage("Error", "Please enter both username and password.");
    }
}

function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const inputUsername = form.reg_username.value;
    const inputPassword = form.reg_password.value;

    if (!inputUsername || !inputPassword) {
        return showMessage("Error", "Please fill out all fields.");
    }

    // In a real app, this would be an API call
    showMessage("Success!", `Registration successful for ${inputUsername}! You can now login.`).then(() => {
        // Optionally redirect back to login (using a tab toggle for this demo)
        document.getElementById('login-tab')?.click();
        document.getElementById('reg_username').value = '';
        document.getElementById('reg_password').value = '';
    });
}

function logout() {
    showMessage("Logout", "Are you sure you want to log out?", true).then(confirmed => {
        if (confirmed) {
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        }
    });
}


/**
 * --- Dashboard Logic ---
 */
function setupDashboard() {
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        greetingElement.textContent = `Welcome, ${username}!`;
    }
}


/**
 * --- Parking Slots Logic ---
 */
function loadSlots() {
    const container = document.getElementById("slots-container");
    if (!container) return;
    
    // Check if the user has an active booking to prevent double booking
    const hasActiveBooking = simulatedBookings.some(b => b.slotId);

    container.innerHTML = simulatedSlots.map(slot => {
        const isBookedByMe = simulatedBookings.some(b => b.slotId === slot.id);
        const statusClass = slot.isAvailable ? 'bg-success hover:bg-green-600 cursor-pointer' : 
                            (isBookedByMe ? 'bg-indigo-500 cursor-default' : 'bg-danger cursor-not-allowed opacity-70');
        const icon = slot.isAvailable ? 'fa-check-circle' : 'fa-times-circle';
        
        let clickHandler = '';
        if (slot.isAvailable && !hasActiveBooking) {
            clickHandler = `bookSlot(${slot.id}, '${slot.name}')`;
        } else if (hasActiveBooking && slot.isAvailable) {
            // Cannot book if user already has an active booking
            clickHandler = `showMessage('Booking Limit', 'You already have one active booking. Please cancel it first.', false)`;
        } else {
            clickHandler = `showMessage('Occupied', 'This slot is currently occupied.', false)`;
        }

        return `
            <div 
                class="slot p-4 text-white text-center rounded-xl shadow-lg transition transform hover:scale-[1.02] ${statusClass}"
                onclick="${clickHandler}">
                <i class="fas ${icon} fa-2x mb-2"></i>
                <div class="font-bold text-lg">${slot.name}</div>
                <small>${slot.isAvailable ? 'Available' : (isBookedByMe ? 'Your Booking' : 'Occupied')}</small>
            </div>
        `;
    }).join('');
}

function bookSlot(slotId, slotName) {
    showMessage("Confirm Booking", `Do you want to book Slot ${slotName}?`, true).then(confirmed => {
        if (confirmed) {
            // Simulate API call and state update
            const now = new Date();
            simulatedBookings.push({ 
                id: Date.now(), 
                slotId: slotId, 
                slotName: slotName, 
                startTime: now 
            });
            
            // Mark the slot as unavailable in the simulation
            const slotIndex = simulatedSlots.findIndex(s => s.id === slotId);
            if (slotIndex !== -1) {
                simulatedSlots[slotIndex].isAvailable = false;
            }

            showMessage("Booking Confirmed!", `Slot ${slotName} is now reserved for you.`).then(() => {
                loadSlots(); // Refresh the list to reflect the change
            });
        }
    });
}


/**
 * --- My Bookings Logic ---
 */
function loadMyBookings() {
    const container = document.getElementById("bookings-list");
    if (!container) return;

    if (simulatedBookings.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    You have no active parking bookings.
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = simulatedBookings.map(booking => {
        const formattedTime = new Date(booking.startTime).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });

        return `
            <tr class="hover:bg-gray-50 transition duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#${booking.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                    <i class="fas fa-parking text-primary mr-2"></i>${booking.slotName}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formattedTime}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="px-3 py-1 text-white bg-danger rounded-lg hover:bg-red-600 transition shadow-md" 
                            onclick="cancelBooking(${booking.id}, ${booking.slotId}, '${booking.slotName}')">
                        <i class="fas fa-times mr-1"></i> Cancel
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function cancelBooking(bookingId, slotId, slotName) {
    showMessage("Cancel Booking", `Are you sure you want to cancel your reservation for Slot ${slotName}?`, true).then(confirmed => {
        if (confirmed) {
            // Simulate API call and state update
            
            // 1. Remove from bookings
            const initialLength = simulatedBookings.length;
            simulatedBookings = simulatedBookings.filter(b => b.id !== bookingId);

            if (simulatedBookings.length < initialLength) {
                // 2. Mark slot as available again
                const slotIndex = simulatedSlots.findIndex(s => s.id === slotId);
                if (slotIndex !== -1) {
                    simulatedSlots[slotIndex].isAvailable = true;
                }
                
                showMessage("Cancellation Success", `Booking #${bookingId} for Slot ${slotName} has been cancelled.`).then(() => {
                    loadMyBookings(); // Refresh the list
                });
            } else {
                showMessage("Error", "Booking not found or could not be cancelled.");
            }
        }
    });
}


// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication state for secure pages
    if (!checkAuth()) return;

    // Run page-specific setup
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'dashboard.html') {
        setupDashboard();
    } else if (currentPage === 'slots.html') {
        loadSlots();
    } else if (currentPage === 'booking.html') {
        loadMyBookings();
    }
});
