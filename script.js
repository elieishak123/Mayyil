// Get necessary elements
const wrapper = document.querySelector('.wrapper');
const loginLinks = document.querySelectorAll('.login-link'); // Get all login links
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const forgotLink = document.querySelector('.remember-forgot a');
const planIcon = document.getElementById('plan-icon');
const loginButton = document.getElementById('login-button');

// Base URL for the backend
const backendURL = 'https://mayyil-aa-libnen-production.up.railway.app';

// Event for opening the register form
registerLink?.addEventListener('click', () => {
    wrapper.classList.add('active'); // Show the register form
    wrapper.classList.remove('active-forgot'); // Hide forgot password form
});

// Event for opening the login form from register or forgot password
loginLinks?.forEach((link) => {
    link.addEventListener('click', () => {
        wrapper.classList.remove('active'); // Hide register form
        wrapper.classList.remove('active-forgot'); // Hide forgot password form
    });
});

// Event for opening the forgot password form
forgotLink?.addEventListener('click', () => {
    wrapper.classList.add('active-forgot'); // Show forgot password form
    wrapper.classList.remove('active'); // Hide register form
});

// Popup to open the login form
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup'); // Show popup
    wrapper.classList.remove('active-forgot'); // Hide forgot password form
    wrapper.classList.remove('active'); // Hide register form
});

// Close the popup
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup'); // Hide popup
});

// Event listener for "My Plan" button
planIcon.addEventListener("click", () => {
    fetch(`${backendURL}/verify-token`, { credentials: 'include' })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Invalid or missing token');
            }
        })
        .then((data) => {
            console.log('User verified:', data);
            window.location.href = "plan.html"; // Redirect to planner
        })
        .catch((error) => {
            console.error("Error validating token:", error);
            alert("You need to log in to access the planner.");
        });
});



// Function to update the UI state based on login status
function updateUIState(isLoggedIn) {
    const loginButton = document.getElementById('login-button');
    const planIcon = document.getElementById('plan-icon');

    if (isLoggedIn) {
        loginButton.textContent = 'Logout';
        loginButton.removeEventListener('click', showLoginPopup);
        loginButton.addEventListener('click', handleLogout);
    } else {
        loginButton.textContent = 'Login';
        loginButton.removeEventListener('click', handleLogout);
        loginButton.addEventListener('click', showLoginPopup);
    }
}

// Function to show the login popup
function showLoginPopup() {
    document.querySelector('.wrapper').classList.add('active-popup');
}

// Handle login form submission
document.querySelector('#login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.querySelector('#login-form input[name="email"]').value;
    const password = document.querySelector('#login-form input[name="password"]').value;

    fetch(`${backendURL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password }),
    })
        .then((response) => {
            if (!response.ok) throw new Error('Failed to log in');
            return response.json();
        })
        .then((data) => {
            alert(data.message);

            if (data.message === 'Login successful') {
                document.querySelector('.wrapper').classList.remove('active-popup'); // Hide login popup
                updateUIState(true); // Update UI to logged-in state
            }
        })
        .catch((error) => {
            console.error('Error during login fetch:', error);
            alert('Login failed. Please try again.');
        });
});

// Handle registration form submission
document.querySelector('#registration-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.querySelector('#registration-form input[name="username"]').value;
    const email = document.querySelector('#registration-form input[name="email"]').value;
    const password = document.querySelector('#registration-form input[name="password"]').value;
    const termsCheckbox = document.getElementById('terms-checkbox').checked;

    if (!termsCheckbox) {
        alert('Please agree to the terms and conditions.');
        return;
    }

    console.log('Submitting signup form...');

    fetch(`${backendURL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message || 'Registration successful!');

            if (data.message.includes('OTP sent')) {
                // Save email in sessionStorage for verification in emailotp.html
                sessionStorage.setItem('userEmail', email);

                // Redirect to the OTP page
                window.location.href = 'emailotp.html';
            }
        })
        .catch((error) => {
            console.error('Error during signup:', error);
            alert('Something went wrong. Please try again.');
        });
});

// Handle forgot password form submission
document.querySelector('#forgot-password-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = e.target.email.value;

    try {
        const response = await fetch(`${backendURL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error during forgot password process:', error);
    }
});

// Handle logout
function handleLogout() {
    fetch(`${backendURL}/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies to clear them
    })
        .then((response) => {
            if (!response.ok) throw new Error('Logout failed');
            return response.json();
        })
        .then((data) => {
            alert(data.message);
            updateUIState(false); // Update UI to logged-out state
        })
        .catch((error) => {
            console.error('Error during logout:', error);
        });
}

// Check login state on page load
document.addEventListener('DOMContentLoaded', () => {
    fetch(`${backendURL}/verify-token`, {
        method: 'GET',
        credentials: 'include', // Ensure cookies are included
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('User not logged in');
        }
    })
    .then((data) => {
        console.log('User is logged in:', data); // Debug log
        updateUIState(true); // Set the UI to the logged-in state
    })
    .catch((error) => {
        console.log('Not logged in:', error.message);
        updateUIState(false); // Set the UI to the logged-out state
    });
});
