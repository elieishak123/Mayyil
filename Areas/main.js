// Backend API Base URL
const API_BASE_URL = 'https://mayyil-aa-libnen-production.up.railway.app'// Production backend URL

// Image Slider Functionality
let slideIndex = 0;

function plusSlides(n) {
    slideIndex += n;
    showSlides();
}

function showSlides() {
    let slides = document.getElementsByClassName("slide");
    let captions = document.getElementsByClassName("caption");

    // Loop back to the first slide if we reach the end
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    // Loop back to the last slide if we go back past the first slide
    if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }

    // Hide all slides and captions
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        captions[i].style.opacity = "0"; // Hide captions initially
    }

    // Show the current slide and its caption
    slides[slideIndex].style.display = "block";
    captions[slideIndex].style.opacity = "1"; // Display caption with opacity transition
}

// Automatically initialize the slider on page load
document.addEventListener("DOMContentLoaded", () => {
    showSlides();
});

// Function to navigate to the review page with areaId as a query parameter
function navigateToReview(button) {
    const areaId = button.getAttribute("data-area-id");
    if (!areaId) {
        console.error("Area ID not found for this button.");
        return;
    }
    // Navigate to the review page
    window.location.href = `Reviews/index.html?areaId=${areaId}`;
}

// Add event listeners for navigating to the review page
document.addEventListener("DOMContentLoaded", () => {
    const reviewButtons = document.querySelectorAll(".add-review-container");
    reviewButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            navigateToReview(button); // Call the navigate function
        });
    });
});

// "Add to Planner" Functionality
async function addToPlanner(areaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/planner`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify({ areaId }),
        });

        if (!response.ok) {
            const errorMessage = await response.json(); // Capture any error message from the backend
            throw new Error(errorMessage.message || 'Failed to add area to planner.');
        }

        const result = await response.json();
        alert(result.message || 'Area added to planner successfully!');
    } catch (err) {
        console.error('Error adding to planner:', err);
        alert(err.message || 'An error occurred while adding the area to the planner.');
    }
}

// Add event listeners for all "Add to Planner" buttons
document.addEventListener("DOMContentLoaded", () => {
    const plannerButtons = document.querySelectorAll(".add-to-planner");
    plannerButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default anchor behavior

            // Get the area ID from the button's dataset
            const areaId = button.dataset.areaId;

            if (!areaId) {
                console.error('Area ID not found for this button.');
                return;
            }

            // Call addToPlanner with the area ID
            addToPlanner(areaId);
        });
    });
});

// Filter Functionality
function setupFilters() {
    const liItems = document.querySelectorAll("ul li");
    const infoCards = document.querySelectorAll(".info-card");

    liItems.forEach(li => {
        li.addEventListener("click", () => {
            // Remove the active class from all buttons
            liItems.forEach(li => li.classList.remove("active"));
            li.classList.add("active");

            // Get the selected filter category
            const filterValue = li.textContent;

            // Filter the info cards
            infoCards.forEach(card => {
                const img = card.querySelector("img");
                const category = img.getAttribute("data-filter");

                if (filterValue === "All Menu" || category === filterValue) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
}

// Initialize filter functionality
document.addEventListener("DOMContentLoaded", setupFilters);
