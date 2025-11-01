ParkEasy: Smart Parking Finder (Frontend)

This repository contains the modular frontend application for the ParkEasy Smart Parking Finder System. It is a user-interactive dashboard built using pure HTML, CSS (Tailwind CSS), and Vanilla JavaScript to simulate the core functions of a modern parking reservation system.

--> Key Features

The application provides a smooth, responsive user experience across five main pages:

Login/Register: Secure entry point with separate tabs for user authentication and new account creation.

Dashboard: Personalized welcome screen with quick links to the two main application functions.

Parking Slots (slots.html):

Visual representation of parking spaces.

Slots are color-coded (Green: Available, Red: Occupied).

Interactive: Users can click an available slot to initiate a booking via a custom confirmation modal.

My Bookings (booking.html):

Displays a list of the user's current, active reservations.

Allows users to cancel a booking using a confirmation modal.

Simulated Backend: All data fetching and state management (login, booking, cancellation) are handled locally within script.js to demonstrate frontend logic without a live API connection.

-->Project Structure

The project follows a clean, modular structure for easy navigation and maintenance:

smart-parking-frontend/
│
├── index.html          # Entry point; redirects to the Login page.
├── style.css           # Minimal custom CSS rules (for components not covered by Tailwind).
├── script.js           # Core application logic, simulated data, modal functions, and event handlers.
│
├── pages/
│   ├── login.html      # Authentication forms (Login/Register).
│   ├── dashboard.html  # Main navigation and user greeting.
│   ├── slots.html      # Parking visualization and booking interface.
│   └── booking.html    # List of active user bookings with cancellation option.
│
└── assets/             # Reserved for future static assets (logos, custom icons, images).


--. Technologies Used

HTML5: Application structure.

Vanilla JavaScript: All interactivity and state management.

Tailwind CSS: Utility-first framework for responsive design and modern styling.

Font Awesome: For all icons used across the dashboard (e.g., parking, search, logout).

->Getting Started

Since this is a static frontend application, no complex build process or server is required.

1. Clone the Repository

git clone [https://github.com/urzarai/ParkEasy.git](https://github.com/urzarai/ParkEasy.git)
cd ParkEasy


2. Run the Application

Simply open the entry point file in your web browser:

Navigate to the smart-parking-frontend/ directory.

Right-click on index.html and choose "Open with" -> "Chrome," "Firefox," or your preferred browser.

The index.html file will automatically redirect you to the Login page (pages/login.html).

3. Testing Credentials

Use any username and password to log in, as the authentication is currently simulated in script.js.
