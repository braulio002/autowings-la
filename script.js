document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.querySelector('.preloader');
    
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1200);

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('#mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Testimonial slider
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const sliderDots = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    let currentSlide = 0;
    
    testimonialSlides.forEach((slide, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.slider-dot');
    
    function showSlide(index) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonialSlides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    function goToSlide(index) {
        showSlide(index);
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        showSlide(currentSlide);
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    let slideInterval = setInterval(nextSlide, 6000);
    
    // Pause on hover
    const slider = document.querySelector('.testimonials-slider');
    
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .gallery-item, .about-content, .about-image');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .about-content, .about-image');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
});

// Set minimum date to today
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

// Special Requests validation
const notesField = document.getElementById('notes');
const notesWarning = document.getElementById('notesWarning');
let lastInputTime = 0;

notesField.addEventListener('input', function(e) {
    const now = Date.now();
    
    if (now - lastInputTime < 100) {
        this.value = this.value.slice(0, -1);
        return;
    }
    lastInputTime = now;
    
    const input = this.value;
    
    let sanitized = input.replace(/<[^>]*>/g, '');
    
    sanitized = sanitized.replace(/[<>{}()\[\]\\;=]/g, '');
    
    const suspiciousPatterns = [
        /(\.\s*){3,}/g,
        /(=\s*){2,}/g,
        /(\(\s*){3,}/g,
        /(\)\s*){3,}/g,
        /(function\s*)/gi,
        /(var\s+|let\s+|const\s+)/gi,
        /(=>\s*)/g,
        /(;\s*){2,}/g,
        /(\/\*[\s\S]*?\*\/|\/\/.*)/g
    ];
    
    let containsCode = false;
    suspiciousPatterns.forEach(pattern => {
        if (pattern.test(input)) {
            containsCode = true;
            sanitized = sanitized.replace(pattern, '');
        }
    });
    
    if (containsCode) {
        this.classList.add('suspicious-input');
        notesWarning.style.display = 'block';
        setTimeout(() => {
            this.classList.remove('suspicious-input');
            notesWarning.style.display = 'none';
        }, 3000);
        this.value = sanitized;
    } else {
        this.value = sanitized;
    }
});

// Booking form submission
const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    notesField.value = notesField.value.replace(/[<>{}()\[\]\\;=]/g, '');
    
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Form submitted:', data);
    
    alert('Thank you for your booking request! Our concierge will contact you shortly to confirm your appointment.');
    
    bookingForm.reset();
});
