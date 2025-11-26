// Site-wide UI behaviors: snackbar, benefit section animations
(function () {
    function initSnackbar() {
        const form = document.querySelector('.hero-form');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Show snackbar
            const snackbar = document.getElementById('snackbar');
            if (!snackbar) return;
            snackbar.classList.add('show');

            // Hide snackbar after 3 seconds
            setTimeout(function() {
                snackbar.classList.remove('show');
            }, 3000);

            // Optional: Reset form
            // form.reset();
        });
    }

    function initBenefitsAnimation() {
        const benefitsSection = document.querySelector('.benefits-section');
        if (!benefitsSection) return;

        // Use Intersection Observer for lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Also animate all benefit items within
                    const benefitItems = entry.target.querySelectorAll('.benefit-item');
                    benefitItems.forEach(item => {
                        item.classList.add('visible');
                    });
                    
                    // Stop observing after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of element is visible
        });

        observer.observe(benefitsSection);
    }

    function init() {
        initSnackbar();
        initBenefitsAnimation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// Testimonials Carousel Script
class TestimonialsCarousel {
    constructor() {
        this.carousel = document.querySelector('.testimonials-carousel');
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.dots = document.querySelectorAll('.carousel-dot');
        
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        this.autoPlayDelay = 3000; // 2 seconds
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        // Initialize
        this.setupEventListeners();
        this.updateCarousel();
        this.startAutoPlay();
    }
    
    setupEventListeners() {
        // Dots click handlers
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.pauseAutoPlay();
                this.startAutoPlay();
            });
        });
        
        // Pause on hover
        const section = document.querySelector('.testimonials-section');
        section.addEventListener('mouseenter', () => this.pauseAutoPlay());
        section.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slideCount;
        this.updateCarousel();
    }
    
    updateCarousel() {
        // Update slides visibility
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === this.currentIndex) {
                slide.classList.add('active');
            }
        });
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === this.currentIndex) {
                dot.classList.add('active');
            }
        });
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    destroy() {
        this.pauseAutoPlay();
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ClientCarousel();
    new TestimonialsCarousel();
    new ProductivityCarousel();
});

// Productivity Carousel Script
class ProductivityCarousel {
    constructor() {
        this.carousel = document.querySelector('.productivity-carousel');
        if (!this.carousel) return;
        
        this.track = this.carousel.querySelector('.productivity-carousel-track');
        this.slides = Array.from(this.carousel.querySelectorAll('.productivity-carousel-slide'));
        this.prevBtn = this.carousel.querySelector('.productivity-carousel-btn.prev');
        this.nextBtn = this.carousel.querySelector('.productivity-carousel-btn.next');
        this.indicators = Array.from(this.carousel.querySelectorAll('.indicator'));
        
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        this.autoPlayDelay = 4000; // 4 seconds
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        if (this.slideCount === 0) return;
        
        this.setupEventListeners();
        this.updateCarousel();
        this.startAutoPlay();
    }
    
    setupEventListeners() {
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.previousSlide();
                this.pauseAutoPlay();
                this.startAutoPlay();
            });
        }
        
        // Next button
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.pauseAutoPlay();
                this.startAutoPlay();
            });
        }
        
        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
                this.pauseAutoPlay();
                this.startAutoPlay();
            });
        });
        
        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.carousel.matches(':hover')) {
                if (e.key === 'ArrowLeft') {
                    this.previousSlide();
                    this.pauseAutoPlay();
                    this.startAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                    this.pauseAutoPlay();
                    this.startAutoPlay();
                }
            }
        });
    }
    
    goToSlide(index) {
        // Add prev class to current slide
        this.slides[this.currentIndex].classList.add('prev');
        
        // Update current index
        this.currentIndex = index;
        
        // Remove prev class after animation
        setTimeout(() => {
            this.slides.forEach(slide => slide.classList.remove('prev'));
        }, 500);
        
        this.updateCarousel();
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slideCount;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
        this.goToSlide(prevIndex);
    }
    
    updateCarousel() {
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === this.currentIndex) {
                slide.classList.add('active');
            }
        });
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            }
        });
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    destroy() {
        this.pauseAutoPlay();
    }
}

// Floating Action Button (FAB) Script
(function() {
    const fab = document.querySelector('.fab');
    if (!fab) return;
    
    // Hide FAB on scroll down, show on scroll up
    let lastScrollTop = 0;
    const scrollThreshold = 300; // Show FAB after scrolling 300px
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide based on scroll position
        if (scrollTop > scrollThreshold) {
            fab.style.opacity = '1';
            fab.style.pointerEvents = 'auto';
        } else {
            fab.style.opacity = '0';
            fab.style.pointerEvents = 'none';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    // FAB click handler - scroll to top
    fab.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();

// Benefits Section - All content displayed upfront (no accordion interaction)

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsCarousel();
});