let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.slide-item');
    const totalSlides = slides.length;

    // Wrap the slide index if out of range
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    // Move the slider by changing the opacity
    slides.forEach((slide, i) => {
        slide.style.opacity = i === currentSlide ? '1' : '0';
    });
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Initialize the slider
showSlide(currentSlide);
