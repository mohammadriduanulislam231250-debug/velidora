function initSlider() {
  const slider = document.getElementById('heroSlider');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  
  if (!slider || !slides.length) return;
  
  let currentSlide = 0;
  let slideInterval;
  let isTransitioning = false;
  
  /**
   * Show a specific slide and update dots
   * @param {number} index - The index of the slide to show
   */
  const showSlide = (index) => {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // Deactivate all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Activate current slide and dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    
    // Update current slide index
    currentSlide = index;
    
    // Reset transition lock after animation completes
    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  };
  
  /**
   * Go to the next slide
   */
  const nextSlide = () => {
    const newIndex = (currentSlide + 1) % slides.length;
    showSlide(newIndex);
  };
  
  /**
   * Go to the previous slide
   */
  const prevSlide = () => {
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(newIndex);
  };
  
  /**
   * Start the automatic slider
   */
  const startSlideShow = () => {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
    slideInterval = setInterval(nextSlide, 5000);
  };
  
  // Add click events to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (currentSlide !== index) {
        showSlide(index);
        startSlideShow();
      }
    });
  });
  
  // Add touch support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      startSlideShow();
    }
  };
  
  // Initialize the slider
  showSlide(0);
  startSlideShow();
  
  // Pause slideshow when hovering over the slider
  slider.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  
  // Resume slideshow when mouse leaves the slider
  slider.addEventListener('mouseleave', () => {
    startSlideShow();
  });
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      startSlideShow();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      startSlideShow();
    }
  });
}