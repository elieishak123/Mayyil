document.addEventListener("DOMContentLoaded", async () => {
    const reviewsContainer = document.getElementById("reviews-container");
    const areaNameElement = document.getElementById("area-name");

    // Deployed backend URL
    const baseURL = "https://mayyil-aa-libnen-production.up.railway.app";

    const areaId = new URLSearchParams(window.location.search).get("area_id");
    console.log("Fetched Area ID:", areaId); // Debugging log

    if (!areaId) {
        reviewsContainer.innerHTML = `<p>Error: Area ID is missing in the URL.</p>`;
        return;
    }

    try {
        // Fetch area details
        const areaResponse = await fetch(`${baseURL}/api/areas/${areaId}`);
        if (!areaResponse.ok) {
            console.error("Error fetching area details:", await areaResponse.text());
            throw new Error("Failed to fetch area details");
        }
        const area = await areaResponse.json();
        console.log("Fetched Area Details:", area); // Debugging log
        areaNameElement.textContent = area.area_name || "Unknown Area"; // Corrected field name

        // Fetch reviews for the area
        const reviewsResponse = await fetch(`${baseURL}/api/reviews?area_id=${areaId}`, {
            credentials: "include", // Ensure cookies are sent
        });

        if (!reviewsResponse.ok) {
            console.error("Error fetching reviews:", await reviewsResponse.text());
            throw new Error("Failed to fetch reviews");
        }

        const { reviews, currentUserId } = await reviewsResponse.json();
        console.log("Fetched Reviews:", reviews);
        console.log("Current User ID:", currentUserId);

        if (reviews.length === 0) {
            reviewsContainer.innerHTML = `<p>No reviews yet for this area. Be the first to leave a review!</p>`;
            return;
        }

        reviewsContainer.innerHTML = ""; // Clear placeholder content

        reviews.forEach((review) => {
            console.log("Processing Review:", review); // Debugging log

            const reviewCard = document.createElement("div");
            reviewCard.classList.add("review-card");

            reviewCard.innerHTML = `
                <h3>${review.username}</h3>
                <p>${review.review}</p>
                <p class="rating">Rating: ${review.rating}</p>
                <hr />
            `;

            // Add delete button if the review belongs to the logged-in user
            if (review.user_id === currentUserId || currentUserId === 1) {
                console.log("Adding delete button for user review:", review); // Debugging log
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-btn");
                deleteButton.addEventListener("click", async () => {
                    try {
                        const deleteResponse = await fetch(
                            `${baseURL}/api/reviews/${review.review_id}`,
                            {
                                method: "DELETE",
                                credentials: "include",
                            }
                        );
                        if (!deleteResponse.ok) {
                            console.error("Error deleting review:", await deleteResponse.text());
                            throw new Error("Failed to delete review");
                        }
                        alert("Review deleted successfully!");
                        reviewCard.remove();
                    } catch (error) {
                        console.error("Error deleting review:", error);
                        alert("Failed to delete the review. Please try again.");
                    }
                });
                reviewCard.appendChild(deleteButton);
            }

            reviewsContainer.appendChild(reviewCard); // Add review to the container
        });
    } catch (error) {
        console.error("Error in frontend script:", error);
        reviewsContainer.innerHTML = `<p>Failed to load reviews. Please try again later.</p>`;
    }
});
