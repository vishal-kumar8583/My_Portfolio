// Immediately reset scroll position on script load
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

// Disable scroll restoration to prevent browser from remembering scroll position
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Mobile Navigation Toggle with enhanced mobile experience
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Enhanced mobile menu toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open (mobile UX improvement)
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

hamburger.addEventListener('click', toggleMobileMenu);

// Close menu when tapping outside (mobile UX enhancement)
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !hamburger.contains(e.target) && 
        !navMenu.contains(e.target)) {
        toggleMobileMenu();
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = ''; // Restore body scroll
}));

// Mobile-specific enhancements
function addMobileEnhancements() {
    // Detect mobile device
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Add touch feedback to interactive elements
        const touchElements = document.querySelectorAll('.btn, .certificate-card, .project-card, .skill-category, .contact-item');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }, { passive: true });
        });
        
        // Smooth scroll behavior specifically for mobile
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    // Mobile-optimized smooth scroll
                    target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                    });
                }
            });
        });
    }
}

// Initialize mobile enhancements
addMobileEnhancements();

// Mobile-specific optimization for activities section
if (window.innerWidth <= 768) {
    // Pre-load activities section on mobile for faster scrolling
    const activitiesSection = document.querySelector('.activities');
    if (activitiesSection) {
        const mobileActivitiesObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Immediately trigger all activity cards
                    const activityCards = entry.target.querySelectorAll('.activity-card');
                    activityCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 50); // Much faster stagger on mobile
                    });
                    mobileActivitiesObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' }); // Trigger earlier
        
        mobileActivitiesObserver.observe(activitiesSection);
    }
}

// Re-initialize on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(addMobileEnhancements, 250);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Use native smooth scrolling with CSS scroll-margin
            target.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'
            });
            
            // Add a gentle emphasis animation when navigating to About
            const isAbout = target.id === 'about';
            if (isAbout) {
                target.classList.add('visible');
                setTimeout(() => {
                    target.classList.add('highlight-section');
                    setTimeout(() => target.classList.remove('highlight-section'), 800);
                }, 300);
            }
        }
    });
});

// Navbar background change on scroll (toggle class)
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Enhanced Intersection Observer for scroll animations with mobile optimization
const isMobile = window.innerWidth <= 768;
const observerOptions = {
    threshold: isMobile ? 0.1 : 0.15,
    rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill bars when skills section is visible
            if (entry.target.classList.contains('skills')) {
                animateSkillBars();
                // Add staggered animation to skill cards
                animateSkillCards();
            }
            
            // Add pulse animation to profile card when about section is visible
            if (entry.target.classList.contains('about')) {
                const profileCard = entry.target.querySelector('.profile-card');
                if (profileCard) {
                    setTimeout(() => {
                        profileCard.classList.add('pulse-on-scroll');
                    }, 500);
                }
            }
            
            // Add floating animation to project cards
            if (entry.target.classList.contains('projects')) {
                const projectCards = entry.target.querySelectorAll('.project-card');
                projectCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('float-element');
                    }, index * 200);
                });
            }
            
            // Add section transition effect
            entry.target.classList.add('section-transition');
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.querySelectorAll('section').forEach((section, index) => {
    // Add different animation classes based on section
    const animationClasses = ['fade-in', 'slide-up', 'scale-in'];
    const animationClass = animationClasses[index % animationClasses.length];
    section.classList.add(animationClass);
    observer.observe(section);
});

// Reveal child elements smoothly when they enter viewport - mobile optimized
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { 
    threshold: isMobile ? 0.05 : 0.15, 
    rootMargin: isMobile ? '0px 0px -5% 0px' : '0px 0px -10% 0px' 
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Observe generic reveal utilities
document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => revealObserver.observe(el));

// Staggered containers: observe each child
document.querySelectorAll('.stagger').forEach(container => {
    container.querySelectorAll(':scope > *').forEach(child => {
        revealObserver.observe(child);
    });
});

// Scroll progress bar at top
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
}

window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('load', updateProgress);

// Animate skill bars with enhanced effects
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
            // Add a glow effect when bar fills
            setTimeout(() => {
                bar.style.boxShadow = '0 2px 15px rgba(99, 102, 241, 0.6)';
            }, 800);
        }, index * 150);
    });
}

// Animate skill cards with staggered effect
function animateSkillCards() {
    const skillCards = document.querySelectorAll('.skill-category');
    skillCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
            // Add a subtle bounce effect
            card.style.animation = 'skillCardBounce 0.6s ease';
        }, index * 200);
    });
}

// Create engaging floating tech/programming icons
function createFloatingShapes() {
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'floating-tech-icons';
    shapesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    document.body.appendChild(shapesContainer);
    
    // Create subtle tech/programming related icons with theme-matching colors
    const techIcons = [
        { icon: 'fas fa-code', size: 16, color: 'rgba(99, 102, 241, 0.08)' }, // Code brackets
        { icon: 'fab fa-react', size: 18, color: 'rgba(59, 130, 246, 0.08)' }, // React
        { icon: 'fas fa-database', size: 14, color: 'rgba(139, 92, 246, 0.08)' }, // Database
        { icon: 'fab fa-js-square', size: 15, color: 'rgba(99, 102, 241, 0.08)' }, // JavaScript
        { icon: 'fas fa-laptop-code', size: 17, color: 'rgba(147, 51, 234, 0.08)' }, // Laptop with code
        { icon: 'fab fa-node-js', size: 16, color: 'rgba(99, 102, 241, 0.08)' }, // Node.js
        { icon: 'fab fa-git-alt', size: 15, color: 'rgba(139, 92, 246, 0.08)' }, // Git
        { icon: 'fas fa-server', size: 14, color: 'rgba(59, 130, 246, 0.08)' }, // Server
        { icon: 'fab fa-python', size: 16, color: 'rgba(147, 51, 234, 0.08)' }, // Python
        { icon: 'fas fa-terminal', size: 15, color: 'rgba(99, 102, 241, 0.08)' }, // Terminal
        { icon: 'fas fa-cog', size: 14, color: 'rgba(139, 92, 246, 0.08)' }, // Settings/Config
        { icon: 'fas fa-cloud', size: 16, color: 'rgba(59, 130, 246, 0.08)' } // Cloud computing
    ];
    
    techIcons.forEach((iconConfig, index) => {
        const icon = document.createElement('i');
        icon.className = `floating-tech-icon ${iconConfig.icon}`;
        
        // Icon styling (very subtle)
        icon.style.cssText = `
            position: absolute;
            font-size: ${iconConfig.size}px;
            color: ${iconConfig.color};
            opacity: 0;
            text-shadow: 0 0 3px ${iconConfig.color};
        `;
        
        shapesContainer.appendChild(icon);
    });
}

// Animate floating tech icons with smooth, organic movement
function animateFloatingShapes() {
    const techIcons = document.querySelectorAll('.floating-tech-icon');
    
    techIcons.forEach((icon, index) => {
        // Random starting position (avoid edges for better visibility)
        const startX = 50 + Math.random() * (window.innerWidth - 100);
        const startY = 50 + Math.random() * (window.innerHeight - 100);
        
        // Unique animation parameters for each icon
        const duration = 10000 + (index * 1500); // 10-25 seconds per cycle
        const amplitude = 60 + (index * 20); // Different movement ranges
        const startTime = Date.now() + (index * 800); // Staggered start
        
        function updateIcon() {
            const elapsed = Date.now() - startTime;
            const progress = (elapsed % duration) / duration;
            
            // Smooth floating movement using multiple sine waves
            const x = startX + Math.sin(progress * Math.PI * 2 + index) * amplitude;
            const y = startY + Math.cos(progress * Math.PI * 1.3 + index * 0.8) * (amplitude * 0.7);
            
            // Gentle rotation for some icons (not all, to keep them readable)
            let rotation = 0;
            if (index % 3 === 0) {
                rotation = Math.sin(progress * Math.PI * 2) * 15; // Subtle wobble
            }
            
            // Very subtle opacity pulsing
            const opacity = 0.2 + Math.sin(progress * Math.PI * 2.5) * 0.1;
            
            // Subtle scale pulsing
            const scale = 0.9 + Math.sin(progress * Math.PI * 3) * 0.2;
            
            // Apply transformations
            icon.style.left = `${x}px`;
            icon.style.top = `${y}px`;
            icon.style.opacity = opacity;
            icon.style.transform = `rotate(${rotation}deg) scale(${scale})`;
            
            requestAnimationFrame(updateIcon);
        }
        
        requestAnimationFrame(updateIcon);
    });
}

// Start floating shapes animation
function startFloatingShapes() {
    createFloatingShapes();
    setTimeout(() => {
        animateFloatingShapes();
    }, 500); // Small delay to ensure DOM is ready
}

// Animate profile particles
function animateProfileParticles() {
    const profileParticles = document.querySelectorAll('.profile-particle');
    
    profileParticles.forEach((particle, index) => {
        // Create unique animation for each particle
        const duration = 2000 + (index * 500); // Different speeds
        const delay = index * 200; // Staggered start
        
        function animateParticle() {
            const startTime = Date.now() + delay;
            
            function updateParticle() {
                const elapsed = Date.now() - startTime;
                const progress = (elapsed % duration) / duration;
                
                // Circular movement with varying radius
                const radius = 30 + (Math.sin(elapsed * 0.001) * 20);
                const angle = progress * Math.PI * 2;
                
                // Calculate position
                const x = Math.cos(angle + (index * 0.5)) * radius;
                const y = Math.sin(angle + (index * 0.5)) * radius;
                
                // Apply transform
                particle.style.transform = `translate(${x}px, ${y}px)`;
                
                // Pulsing opacity
                const opacity = 0.3 + (Math.sin(elapsed * 0.003) * 0.4);
                particle.style.opacity = opacity;
                
                requestAnimationFrame(updateParticle);
            }
            
            requestAnimationFrame(updateParticle);
        }
        
        animateParticle();
    });
}

// Background particle animations removed for cleaner, more professional look

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Force scroll to top on page load/refresh
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// Reset scroll position immediately on page load
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Ensure page starts at top
window.addEventListener('load', () => {
    // Force scroll to top immediately
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Disable typing effect to prevent HTML rendering issues
        // The title will display normally with proper HTML formatting
        console.log('Hero title loaded with proper HTML formatting');
    }
    
    // Start floating shapes background animation
    startFloatingShapes();
    
    // Animate profile particles around profile image
    animateProfileParticles();
    
    // Add initial animation classes to elements
    initializeScrollAnimations();
    
    // Initialize enhanced profile image effects
    initializeProfileImageEffects();
    
    // Add image interaction styles
    addImageInteractionStyles();
    
    // Initialize 3D skill card effects
    initialize3DSkillCards();
    
    // Reset any transform effects that might cause positioning issues
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = 'translateY(0)';
    }
});

// Initialize scroll animations for various elements
function initializeScrollAnimations() {
    // Add stagger class to skill items
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        skillsGrid.classList.add('stagger');
    }
    
    // Add animation classes to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        const animationClass = index % 2 === 0 ? 'slide-left' : 'slide-right';
        card.classList.add(animationClass);
    });
    
    // Add animation classes to experience/education cards
    const experienceCards = document.querySelectorAll('.experience-card, .education-card');
    experienceCards.forEach((card, index) => {
        card.classList.add('scale-in');
    });
    
    // Add animation classes to activity cards
    const activityCards = document.querySelectorAll('.activity-card');
    activityCards.forEach((card, index) => {
        const animationClass = index % 2 === 0 ? 'rotate-in' : 'slide-up';
        card.classList.add(animationClass);
    });
    
    // Add floating animation to certificate cards
    const certificateCards = document.querySelectorAll('.certificate-card');
    certificateCards.forEach(card => {
        card.classList.add('float-element');
    });
}

// Enhanced scroll effects
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.3;
        hero.style.transform = `translateY(${rate}px)`;
    }
    
    // Dynamic navbar styling based on scroll position
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const scrollPercentage = scrolled / (document.documentElement.scrollHeight - window.innerHeight);
        navbar.style.backdropFilter = `blur(${10 + scrollPercentage * 10}px)`;
    }
    
    // Animate sections as they come into view
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            const visibilityRatio = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
            
            // Add subtle scaling effect based on scroll position
            if (section.classList.contains('skills') || section.classList.contains('projects')) {
                section.style.transform = `scale(${0.95 + visibilityRatio * 0.05})`;
            }
        }
    });
});

// First-visit hero intro animation
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    // Mark elements for intro animation
    hero.classList.add('hero-intro');
    // Allow layout to settle, then play
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            hero.classList.add('hero-intro-play');
        });
    });
    // Remove staging class after play begins
    setTimeout(() => hero.classList.remove('hero-intro'), 1200);
});

// Contact form handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        // Get form data for validation
        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const subject = contactForm.querySelector('input[name="subject"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            e.preventDefault();
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            e.preventDefault();
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // If validation passes, let the form submit to Formspree
        showNotification('Sending message...', 'info');
        // Form will now submit naturally to Formspree
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced Profile Image Interactions
function initializeProfileImageEffects() {
    const profileImg = document.querySelector('.profile-img');
    const profileCard = document.querySelector('.profile-card');
    
    if (!profileImg || !profileCard) return;
    
    // Add click effect with ripple animation
    profileImg.addEventListener('click', function(e) {
        // Create ripple effect
        createRippleEffect(e, this);
        
        // Add temporary glow effect
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 600);
        
        // Show a subtle notification
        showImageNotification('✨ Nice photo! 📸');
    });
    
    // Add double-click effect
    let clickCount = 0;
    profileImg.addEventListener('click', function() {
        clickCount++;
        setTimeout(() => {
            if (clickCount === 2) {
                // Double-click effect - zoom and rotate
                this.style.transform = 'scale(1.2) rotate(360deg)';
                this.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.transition = '';
                }, 800);
                
                showImageNotification('🎉 Double-click magic! 🌟');
            }
            clickCount = 0;
        }, 300);
    });
    
    // Add mouse move parallax effect
    profileCard.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        profileImg.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    // Reset transform on mouse leave
    profileCard.addEventListener('mouseleave', function() {
        profileImg.style.transform = '';
    });
    
    // Add keyboard interaction
    profileImg.setAttribute('tabindex', '0');
    profileImg.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
}

// Create ripple effect on click
function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10;
        animation: ripple 0.6s ease-out forwards;
    `;
    
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => ripple.remove(), 600);
}

// Show image interaction notification
function showImageNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(99, 102, 241, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2s forwards;
        box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 2.5 seconds
    setTimeout(() => notification.remove(), 2500);
}

// Add CSS animations for ripple and notifications
function addImageInteractionStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes slideInRight {
            0% {
                transform: translateX(100%);
                opacity: 0;
            }
            100% {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .profile-img.clicked {
            animation: clickPulse 0.6s ease !important;
        }
        
        @keyframes clickPulse {
            0% { transform: scale(1); }
            50% { 
                transform: scale(1.1);
                filter: brightness(1.3) contrast(1.2) saturate(1.4) hue-rotate(15deg);
                box-shadow: 0 0 50px rgba(79, 172, 254, 0.8);
            }
            100% { transform: scale(1); }
        }
        
        .profile-img:focus {
            outline: 3px solid rgba(79, 172, 254, 0.6);
            outline-offset: 4px;
        }
    `;
    document.head.appendChild(style);
}

// Smooth Scroll-Triggered Shrinking Animation for Skills
function initialize3DSkillCards() {
    const skillCards = document.querySelectorAll('.skill-category');
    const skillsSection = document.querySelector('.skills');
    
    if (!skillsSection || skillCards.length === 0) return;
    
    let ticking = false;
    
    function updateSkillsOnScroll() {
        const scrolled = window.pageYOffset;
        const skillsTop = skillsSection.offsetTop;
        const skillsHeight = skillsSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculate the exact middle of the skills section
        const skillsMiddle = skillsTop + (skillsHeight / 2);
        const skillsBottom = skillsTop + skillsHeight;
        const viewportTop = scrolled;
        
        // Determine which state we're in
        if (viewportTop < skillsMiddle) {
            // Before or at middle of skills - keep normal size
            skillsSection.classList.remove('skills-shrinking', 'skills-shrunk');
            skillsSection.classList.add('skills-normal');
            
        } else if (viewportTop >= skillsMiddle && viewportTop <= skillsBottom + windowHeight) {
            // Started scrolling past middle - begin shrinking
            const shrinkDistance = (skillsHeight / 2) + windowHeight; // Distance to complete shrinking
            const scrolledPastMiddle = viewportTop - skillsMiddle;
            const shrinkProgress = Math.min(1, scrolledPastMiddle / shrinkDistance);
            
            skillsSection.classList.remove('skills-normal', 'skills-shrunk');
            skillsSection.classList.add('skills-shrinking');
            
            // Set CSS custom property for smooth interpolation
            skillsSection.style.setProperty('--shrink-progress', shrinkProgress);
            
        } else {
            // Completely past skills - fully shrunk
            skillsSection.classList.remove('skills-normal', 'skills-shrinking');
            skillsSection.classList.add('skills-shrunk');
        }
        
        ticking = false;
    }
    
    // Smooth scroll listener with requestAnimationFrame
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateSkillsOnScroll);
            ticking = true;
        }
    }, { passive: true });
    
    // Initial calculation
    updateSkillsOnScroll();
}

// Add CSS for smooth scroll-triggered animations
function enhance3DSkillsCSS() {
    const style = document.createElement('style');
    style.textContent = `
        /* Smooth scroll animation with CSS transitions */
        .skills {
            will-change: transform;
            transform-origin: center center;
            transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .skill-category {
            will-change: transform, opacity, filter, box-shadow;
            transform-origin: center center;
            transition: 
                transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                filter 0.3s ease, 
                box-shadow 0.3s ease;
            backface-visibility: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        /* Skills section states */
        .skills.skills-normal {
            transform: translateY(0px) scale(1);
        }
        
        .skills.skills-normal .skill-category {
            transform: translateY(0px) scale(1);
            opacity: 1;
        }
        
        .skills.skills-shrinking {
            --shrink-progress: 0;
            transform: 
                translateY(calc(-20px * var(--shrink-progress))) 
                scale(calc(1 - 0.05 * var(--shrink-progress)));
        }
        
        .skills.skills-shrinking .skill-category {
            transform: 
                translateY(calc(-60px * var(--shrink-progress))) 
                scale(calc(1 - 0.25 * var(--shrink-progress)));
            opacity: calc(1 - 0.3 * var(--shrink-progress));
        }
        
        /* Staggered animation for cards */
        .skills.skills-shrinking .skill-category:nth-child(1) { transition-delay: 0ms; }
        .skills.skills-shrinking .skill-category:nth-child(2) { transition-delay: 50ms; }
        .skills.skills-shrinking .skill-category:nth-child(3) { transition-delay: 100ms; }
        .skills.skills-shrinking .skill-category:nth-child(4) { transition-delay: 150ms; }
        .skills.skills-shrinking .skill-category:nth-child(5) { transition-delay: 200ms; }
        .skills.skills-shrinking .skill-category:nth-child(6) { transition-delay: 250ms; }
        
        .skills.skills-shrunk {
            transform: translateY(-20px) scale(0.95);
        }
        
        .skills.skills-shrunk .skill-category {
            transform: translateY(-60px) scale(0.75);
            opacity: 0.7;
        }
        
        /* Smooth progress bar animations */
        .skill-progress {
            will-change: transform;
            backface-visibility: hidden;
            transition: transform 0.3s ease, filter 0.3s ease;
        }
        
        /* Enhanced hover effects */
        .skill-category:hover {
            filter: brightness(1.05) !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
        }
        
        .skill-category:hover .skill-progress {
            transform: translateY(-2px);
            filter: brightness(1.1) saturate(1.1);
        }
        
        /* Hardware acceleration */
        .skills,
        .skill-category {
            -webkit-transform: translateZ(0);
            -moz-transform: translateZ(0);
            -ms-transform: translateZ(0);
            -o-transform: translateZ(0);
            transform: translateZ(0);
        }
        
        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
            .skills,
            .skill-category {
                transform: none !important;
                opacity: 1 !important;
                transition: none !important;
            }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
            .skill-category {
                will-change: auto;
            }
            .skills.skills-shrinking .skill-category {
                transition-delay: 0ms; /* Remove stagger on mobile */
            }
        }
        
        /* Resume Button Styling */
        .btn-resume {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            position: relative;
            overflow: hidden;
            font-weight: 600;
            letter-spacing: 0.5px;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .btn-resume::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .btn-resume:hover::before {
            left: 100%;
        }
        
        .btn-resume:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }
        
        .btn-resume i {
            margin-right: 8px;
            font-size: 1.1em;
        }
        
        /* Resume Modal Styling */
        .resume-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            animation: fadeIn 0.3s ease-out;
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
        }
            opacity: 0;
        }
        
        .resume-modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            pointer-events: all;
            opacity: 1;
            visibility: visible;
        }
            opacity: 1;
        }
        
        .resume-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
        }
        
        .resume-modal-content {
            position: relative;
            width: 90%;
            max-width: 1000px;
            height: 90%;
            max-height: 800px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: modalSlideUp 0.4s ease-out;
        }
        
        .resume-modal-header {
            padding: 20px 25px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .resume-modal-header h2 {
            margin: 0;
            font-size: 1.5em;
            font-weight: 600;
        }
        
        .resume-modal-header i {
            margin-right: 10px;
        }
        
        .resume-modal-controls {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        
        .btn-download {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 0.9em;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .btn-download:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
        }
        
        .btn-open-tab {
            background: rgba(255, 255, 255, 0.15);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.25);
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 0.9em;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .btn-open-tab:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
        }
        
        .btn-open-tab i {
            margin-right: 6px;
        }
        
        .resume-modal-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5em;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
        
        .resume-modal-close:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: rotate(90deg);
        }
        
        .resume-modal-body {
            flex: 1;
            position: relative;
            overflow: hidden;
            background: #ffffff;
        }
        
        .resume-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #666;
        }
        
        .resume-loading i {
            font-size: 2em;
            margin-bottom: 15px;
            color: #667eea;
        }
        
        .resume-viewer {
            width: 100%;
            height: 100%;
        }
        
        .resume-viewer iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        
        .resume-fallback {
            padding: 30px;
            height: 100%;
            overflow-y: auto;
            background: #ffffff !important;
            transition: none !important;
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            position: relative !important;
            z-index: 1000 !important;
            width: 100% !important;
        }
        
        .resume-preview {
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
            font-family: 'Poppins', Arial, sans-serif;
            background: #ffffff !important;
            color: #333333 !important;
            font-size: 14px;
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        .resume-preview h3 {
            color: #2c3e50;
            margin-bottom: 5px;
            font-size: 2.2em;
            font-weight: 700;
            text-align: center;
        }
        
        .resume-subtitle {
            color: #667eea;
            font-size: 1.3em;
            margin-bottom: 30px;
            font-weight: 500;
            text-align: center;
            border-bottom: 2px solid #667eea;
            padding-bottom: 15px;
        }
        
        .resume-section {
            margin-bottom: 35px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .resume-section h4 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.4em;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .resume-section h4 i {
            color: #667eea;
            font-size: 1.2em;
        }
        
        .resume-item {
            margin-bottom: 20px;
            padding: 15px;
            background: white;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .resume-item strong {
            color: #2c3e50;
            display: block;
            margin-bottom: 8px;
            font-size: 1.1em;
            font-weight: 600;
        }
        
        .resume-item p {
            color: #555;
            margin: 5px 0;
            font-size: 0.95em;
        }
        
        .resume-item ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        .resume-item li {
            color: #666;
            margin: 5px 0;
            font-size: 0.9em;
        }
        
        .resume-skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        /* Enhanced CV Header */
        .resume-header {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .resume-contact-bar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            backdrop-filter: blur(10px);
        }
        
        .resume-contact-bar span {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9em;
        }
        
        .resume-contact-bar i {
            width: 16px;
            text-align: center;
        }
        
        /* Enhanced Resume Item Headers */
        .resume-item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            flex-wrap: wrap;
        }
        
        .resume-date {
            color: #667eea;
            font-weight: 600;
            font-size: 0.9em;
            background: rgba(102, 126, 234, 0.1);
            padding: 4px 12px;
            border-radius: 20px;
            border: 1px solid rgba(102, 126, 234, 0.2);
        }
        
        .resume-institution {
            color: #666;
            font-style: italic;
            margin: 4px 0;
        }
        
        .resume-company {
            color: #666;
            font-style: italic;
            margin: 4px 0;
            font-weight: 500;
        }
        
        .resume-grade {
            color: #27ae60;
            font-weight: 600;
            margin: 4px 0;
        }
        
        .resume-tech {
            color: #667eea;
            font-size: 0.9em;
            margin: 8px 0;
            font-weight: 500;
            background: rgba(102, 126, 234, 0.1);
            padding: 8px 12px;
            border-radius: 6px;
            border-left: 3px solid #667eea;
        }
        
        .resume-achievements {
            margin: 12px 0;
            padding-left: 20px;
        }
        
        .resume-achievements li {
            margin: 6px 0;
            line-height: 1.5;
        }
        
        /* Skills Grid Layout */
        .resume-skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .skill-category-resume {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .skill-category-resume h5 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.1em;
            font-weight: 600;
        }
        
        .resume-skill {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 500;
            margin: 4px;
            display: inline-block;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }
        
        /* Certifications Layout */
        .resume-certs {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        
        .resume-cert-item {
            padding: 15px;
            background: #f8f9fa;
            border-radius: 6px;
            border-left: 3px solid #f39c12;
            transition: transform 0.2s ease;
        }
        
        .resume-cert-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes modalSlideUp {
            from {
                opacity: 0;
                transform: translateY(50px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .resume-modal-content {
                width: 95%;
                height: 95%;
            }
            
            .resume-modal-header {
                padding: 15px 20px;
            }
            
            .resume-modal-header h2 {
                font-size: 1.2em;
            }
            
            .resume-modal-controls {
                gap: 10px;
            }
            
            .btn-download,
            .btn-open-tab {
                font-size: 0.8em;
                padding: 6px 12px;
            }
            
            .resume-fallback {
                padding: 20px;
            }
            
            .resume-preview h3 {
                font-size: 1.5em;
            }
        }
    `;
    document.head.appendChild(style);
}


// Resume Modal Functionality - Load Your CV.pdf
function initializeResumeModal() {
    const resumeModal = document.getElementById('resumeModal');
    const resumeViewer = document.getElementById('resumeViewer');
    const resumeIframe = document.getElementById('resumeIframe');
    const viewResumeBtn = document.getElementById('viewResumeBtn');
    const navCertificationsBtn = document.getElementById('navCertificationsBtn');
    const closeResumeModal = document.getElementById('closeResumeModal');
    const resumeModalOverlay = document.getElementById('resumeModalOverlay');
    const downloadResumeBtn = document.getElementById('downloadResumeBtn');
    const openInNewTabBtn = document.getElementById('openInNewTabBtn');
    
    // Resume file path - using your actual CV.pdf file
    const resumePdfPath = 'CV.pdf';
    
    function openResumeModal() {
        console.log('Opening resume modal with your CV.pdf...');
        
        // Open modal
        if (resumeModal) {
            resumeModal.classList.add('active');
            // Clear any inline styles that might be hiding the modal
            resumeModal.style.display = 'flex';
            resumeModal.style.pointerEvents = 'all';
            resumeModal.style.opacity = '1';
            resumeModal.style.visibility = 'visible';
            resumeModal.style.zIndex = '10000';
            document.body.style.overflow = 'hidden';
        }
        
        // Load your actual CV.pdf file
        if (resumeIframe) {
            resumeIframe.src = resumePdfPath + '#toolbar=1&navpanes=0&scrollbar=1&page=1&zoom=page-fit';
            console.log('Loading your CV.pdf:', resumePdfPath);
        }
        
        // Show the viewer
        if (resumeViewer) {
            resumeViewer.style.display = 'block';
        }
        
        console.log('Your CV.pdf should now be loading...');
    }
    
    function closeResumeModalFunc() {
        if (resumeModal) {
            resumeModal.classList.remove('active');
            // Reset inline styles to hide the modal completely
            resumeModal.style.display = 'none';
            resumeModal.style.pointerEvents = 'none';
            resumeModal.style.opacity = '0';
            resumeModal.style.visibility = 'hidden';
            resumeModal.style.zIndex = '-1';
            document.body.style.overflow = '';
        }
        
        // Clear iframe
        if (resumeIframe) {
            setTimeout(() => {
                resumeIframe.src = '';
            }, 300);
        }
    }
    
    function downloadResume() {
        try {
            // Try to download the actual PDF file
            const link = document.createElement('a');
            link.href = resumePdfPath;
            link.download = 'Vishal_Kumar_CV.pdf';
            link.target = '_blank';
            
            // Fallback: try to open in new tab
            if (!link.download) {
                window.open(resumePdfPath, '_blank');
                return;
            }
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('CV download started!', 'success');
            
        } catch (error) {
            // If PDF file doesn't exist, show message
            showNotification('CV PDF not available. Please contact me directly for a copy.', 'info');
            
            // Alternative: create a text version download
            createTextResume();
        }
    }
    
    function createTextResume() {
        const resumeText = `VISHAL KUMAR
Full Stack Developer | MCA Student

Contact Information:
Email: phogatvishal2003@gmail.com
Phone: +91-6367317348
LinkedIn: linkedin.com/in/vishal-phogat/
GitHub: github.com/vishal-kumar8583

Education:
• Masters of Computer Applications
  Lovely Professional University (2024 - Present) | CGPA: 7.9
  
• Bachelor of Computer Applications
  University of Rajasthan (2021 - 2024) | CGPA: 7.2

Experience:
• AICTE – Microsoft Future Ready Talent Program
  Virtual Internship (June 2025 - July 2025)
  - Built capstone project using MERN stack and Azure tools
  - Gained hands-on experience with Azure services
  - Learned DevOps pipelines and collaboration tools

Technical Skills:
JavaScript, React.js, Node.js, Python, Django, MongoDB, MySQL, Azure, Git/GitHub

Key Projects:
• FitLife – Gym & Health Web Application
  MERN stack application with MongoDB database
  
• MoviesMosaic - Movie Exploration Web App
  Django-based application with user authentication

Certifications:
• C/C++ Programming - Samyak IT Solutions
• SQL Database - HackerRank
• Java Programming - Vtech Integrated Solutions
• Python Programming - Infosys
• Networking Basics - Cisco`;
        
        const blob = new Blob([resumeText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Vishal_Kumar_CV.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        showNotification('CV text version downloaded!', 'success');
    }
    
    function openInNewTab() {
        // Open CV in new tab for better viewing
        window.open(resumePdfPath, '_blank');
        showNotification('CV opened in new tab for better viewing!', 'success');
    }
    
    // Event listeners
    if (viewResumeBtn) {
        viewResumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openResumeModal();
        });
    }
    
    if (navCertificationsBtn) {
        navCertificationsBtn.addEventListener('click', function(e) {
            // Scroll to certifications section
            const target = document.querySelector('#certifications');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    if (closeResumeModal) {
        closeResumeModal.addEventListener('click', closeResumeModalFunc);
    }
    
    if (resumeModalOverlay) {
        resumeModalOverlay.addEventListener('click', closeResumeModalFunc);
    }
    
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', downloadResume);
    }
    
    if (openInNewTabBtn) {
        openInNewTabBtn.addEventListener('click', openInNewTab);
    }
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
            closeResumeModalFunc();
        }
    });
}


// Ensure resume modal is completely hidden
function ensureModalHidden() {
    const resumeModal = document.getElementById('resumeModal');
    if (resumeModal) {
        resumeModal.classList.remove('active');
        resumeModal.style.display = 'none';
        resumeModal.style.pointerEvents = 'none';
        resumeModal.style.opacity = '0';
        resumeModal.style.visibility = 'hidden';
        resumeModal.style.zIndex = '-1';
        console.log('Resume modal completely hidden - clicks should work');
    }
    
    // Ensure body overflow is normal
    document.body.style.overflow = '';
}

// Initialize enhanced 3D effects on load
window.addEventListener('load', () => {
    enhance3DSkillsCSS();
    initialize3DSkillCards();
    initializeResumeModal();
    
    // Force modal to be hidden
    setTimeout(ensureModalHidden, 100);
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Add notification content styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(notificationStyles);

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 50;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when about section is visible
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            aboutObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    aboutObserver.observe(aboutSection);
}

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effects to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add click effects to contact items
document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // Add click animation
        this.style.transform = 'translateX(10px) scale(0.95)';
        
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Add success feedback
        const originalText = this.querySelector('h4').textContent;
        const originalP = this.querySelector('p').textContent;
        
        // Show loading state briefly
        this.querySelector('h4').textContent = 'Opening...';
        this.querySelector('p').textContent = 'Please wait';
        
        setTimeout(() => {
            this.querySelector('h4').textContent = originalText;
            this.querySelector('p').textContent = originalP;
        }, 1000);
    });
    
    // Add hover sound effect simulation (visual feedback)
    link.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
        // Add a subtle glow effect
        this.style.boxShadow = '0 15px 40px rgba(243, 156, 18, 0.3)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

// Add ripple animation styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// Lazy loading for images (if any are added later)
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Lightbox for certificate images
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox ? lightbox.querySelector('img') : null;

function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add('open');
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 200);
}

if (lightbox) {
    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}

// Event delegation for any element with .open-image (works for anchors, cards, added later)
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.open-image');
    if (!trigger) return;
    e.preventDefault();
    const file = trigger.getAttribute('data-image');
    if (file) openLightbox(file);
});

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const trigger = document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('open-image') ? document.activeElement : null;
    if (!trigger) return;
    e.preventDefault();
    const file = trigger.getAttribute('data-image');
    if (file) openLightbox(file);
});

// Add scroll to top functionality with mobile optimization
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
`;

// Make scroll-to-top button more mobile-friendly
if (window.innerWidth <= 768) {
    scrollToTopBtn.style.bottom = '20px';
    scrollToTopBtn.style.right = '20px';
    scrollToTopBtn.style.width = '56px';
    scrollToTopBtn.style.height = '56px';
    scrollToTopBtn.style.fontSize = '1.3rem';
}

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Removed dark mode toggle functionality

// Preloader styles
const preloaderStyles = document.createElement('style');
preloaderStyles.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: '';
        position: fixed;
        top: 50%;
        left: 50%;
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 10000;
        transform: translate(-50%, -50%);
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
`;
document.head.appendChild(preloaderStyles);
