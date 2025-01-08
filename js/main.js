document.addEventListener('DOMContentLoaded', () => {
    // Hero Section Carousel
    const heroCarousel = {
        container: document.querySelector('.portfolio-carousel'),
        items: Array.from(document.querySelectorAll('.portfolio-carousel .carousel-item')),
        currentIndex: 0,

        init() {
            if (this.items.length === 0) return;
            this.items[0].classList.add('active');
            this.startAutoPlay();
        },

        showNext() {
            if (this.items.length <= 1) return;
            this.items[this.currentIndex].classList.remove('active');
            this.currentIndex = (this.currentIndex + 1) % this.items.length;
            this.items[this.currentIndex].classList.add('active');
        },

        startAutoPlay() {
            setInterval(() => this.showNext(), 3000);
        }
    };

    // Initialize hero carousel if it exists
    if (heroCarousel.container) {
        heroCarousel.init();
    }

    // Featured Work Carousel
    const initFeaturedCarousel = () => {
        const carousel = document.querySelector('.featured-carousel');
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.next-btn');
        const prevButton = carousel.querySelector('.prev-btn');
        const progressBar = carousel.querySelector('.progress-bar');

        let currentIndex = 0;

        // Set initial position of slides
        slides.forEach((slide, index) => {
            slide.style.left = `${index * 100}%`;
        });

        const updateProgress = () => {
            const progress = (currentIndex / (slides.length - 1)) * 100;
            progressBar.style.width = `${progress}%`;
        };

        const updateButtons = () => {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
            prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
            nextButton.style.opacity = currentIndex === slides.length - 1 ? '0.5' : '1';
        };

        const moveToSlide = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
            updateProgress();
            updateButtons();
        };

        nextButton?.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                moveToSlide(currentIndex + 1);
            }
        });

        prevButton?.addEventListener('click', () => {
            if (currentIndex > 0) {
                moveToSlide(currentIndex - 1);
            }
        });

        // Initialize carousel state
        updateProgress();
        updateButtons();

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        track.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
        });

        track.addEventListener('touchend', () => {
            const difference = touchStartX - touchEndX;
            if (Math.abs(difference) > 50) {
                if (difference > 0 && currentIndex < slides.length - 1) {
                    moveToSlide(currentIndex + 1);
                } else if (difference < 0 && currentIndex > 0) {
                    moveToSlide(currentIndex - 1);
                }
            }
        });
    };

    // Initialize featured carousel
    initFeaturedCarousel();

    // Like button functionality
    document.querySelectorAll('.btn-like').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('liked');
            
            // Optional: Add a little bounce animation
            const icon = this.querySelector('i');
            icon.style.transform = 'scale(1.3)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Theme Toggle
    const initThemeToggle = () => {
        const themeToggle = document.querySelector('.theme-toggle-btn');
        if (!themeToggle) return;

        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateComponentsForTheme(newTheme);
        });
    };

    // Update components for theme
    const updateComponentsForTheme = (theme) => {
        const isDark = theme === 'dark';
        
        document.querySelectorAll('.geometric-pattern').forEach(pattern => {
            pattern.style.opacity = isDark ? '0.1' : '0.05';
        });
        
        const progressBar = document.querySelector('.carousel-progress');
        if (progressBar) {
            progressBar.style.backgroundColor = isDark ? '#333' : '#eee';
        }
        
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.style.backgroundColor = isDark ? '#333' : '#fff';
            input.style.color = isDark ? '#fff' : '#333';
        });
    };

    // Initialize theme toggle
    initThemeToggle();

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form submission
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('.submit-btn');
            
            // Add loading state
            submitBtn.classList.add('loading');
            
            try {
                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Message sent successfully!';
                form.appendChild(successMessage);
                
                // Reset form
                form.reset();
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error sending your message. Please try again.');
            } finally {
                submitBtn.classList.remove('loading');
            }
        });
    }

    // Add scroll-based animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.portfolio-item, .timeline-item, .featured-work').forEach(el => {
        observer.observe(el);
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuBtn?.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-menu .nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Navbar scroll state
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Newsletter Form Handling
    document.querySelector('.newsletter-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        const button = form.querySelector('button');
        const successMessage = document.querySelector('.newsletter-success');
        const errorMessage = document.querySelector('.newsletter-error');

        // Reset messages
        successMessage.classList.remove('show');
        errorMessage.classList.remove('show');

        // Add loading state
        button.classList.add('loading');

        try {
            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            successMessage.textContent = 'Thank you for subscribing!';
            successMessage.classList.add('show');
            form.reset();
        } catch (error) {
            // Show error message
            errorMessage.textContent = 'Something went wrong. Please try again.';
            errorMessage.classList.add('show');
        } finally {
            // Remove loading state
            button.classList.remove('loading');
        }
    });

    // Navbar functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Function to update active link
    function updateActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight/3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });

        // If we're at the very top of the page, activate home
        if (window.scrollY < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        }
    }

    // Add smooth scrolling to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active state on scroll
    window.addEventListener('scroll', updateActiveLink);
    
    // Initial call to set active state
    updateActiveLink();

    // Warning banner functionality
    document.getElementById('warning-close')?.addEventListener('click', (e) => {
        e.preventDefault();
        const banner = document.querySelector('.warning-banner');
        banner.style.display = 'none';
        document.querySelector('.navbar').style.top = '0';
        document.querySelector('.hero').style.paddingTop = '8rem';
    });

    // Additional protection
    document.addEventListener('DOMContentLoaded', () => {
        // Disable text selection
        document.body.style.userSelect = 'none';
        
        // Add watermark
        const watermark = document.createElement('div');
        watermark.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 12px;
            color: rgba(0,0,0,0.2);
            pointer-events: none;
            z-index: 1000;
            transform: rotate(-45deg);
        `;
        watermark.textContent = '© The Minimalist Designer 2024';
        document.body.appendChild(watermark);
        
        // Console warning
        console.log('%c⚠️ Stop!', 'color: red; font-size: 30px; font-weight: bold;');
        console.log('%cThis is a protected website. All content is monitored and protected by copyright law.', 'font-size: 14px;');
    });
}); 
