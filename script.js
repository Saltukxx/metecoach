// Enhanced JavaScript for Mete Coach website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all required elements
    const preloader = document.querySelector('.preloader');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('section[id]');
    const backToTopButton = document.querySelector('.back-to-top');
    const contactForm = document.querySelector('.contact-form');
    
    // Preloader with minimum display time
    const minimumLoadTime = 1000; // 1 second minimum loader display
    const loadStartTime = Date.now();
    
    window.addEventListener('load', () => {
        const timeElapsed = Date.now() - loadStartTime;
        const timeRemaining = Math.max(minimumLoadTime - timeElapsed, 0);
        
        setTimeout(() => {
            preloader.style.opacity = '0';
            document.body.classList.add('loaded');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, timeRemaining);
    });

    // Smooth Scrolling for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;

            // Close mobile menu if open
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                menuToggle.classList.remove('active');
            }

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Mobile Menu Toggle with Animation
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        
        // Animate menu items
        const menuItems = navLinksContainer.children;
        Array.from(menuItems).forEach((item, index) => {
            if (navLinksContainer.classList.contains('active')) {
                item.style.animation = `slideIn 0.3s ease forwards ${index * 0.1}s`;
            } else {
                item.style.animation = '';
            }
        });
    });

    // Navbar Scroll Behavior
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class
        if (scrollTop > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
        
        // Update active nav link
        updateActiveNavLink();
        
        // Show/hide back to top button
        updateBackToTopButton();
    });

    // Update Active Navigation Link
    function updateActiveNavLink() {
        const fromTop = window.scrollY + navbar.offsetHeight + 50;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            const inSection = (fromTop >= sectionTop) && 
                            (fromTop <= sectionTop + sectionHeight);
            
            const link = document.querySelector(`a[href="#${sectionId}"]`);
            if (link) {
                if (inSection) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }

    // Animate Elements on Scroll
    const animateOnScrollObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        animateOnScrollObserver.observe(element);
    });

    // Stats Counter Animation
    const counterObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            });
        },
        { threshold: 1 }
    );

    document.querySelectorAll('.counter').forEach(counter => {
        counterObserver.observe(counter);
    });

    function animateCounter(counter, target) {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const stepValue = target / steps;
        let current = 0;
        
        const updateCounter = () => {
            current += stepValue;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    }

    // Enhanced Form Validation and Submission
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        // Floating label animation
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });

        // Form submission handling
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateForm()) return;

            const submitButton = contactForm.querySelector('.submit-btn');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            submitButton.disabled = true;

            try {
                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                showMessage('Mesajınız başarıyla gönderildi!', 'success');
                contactForm.reset();
                
                // Reset form states
                formInputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
                
            } catch (error) {
                showMessage('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
            } finally {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }

    // Form Validation
    function validateForm() {
        let isValid = true;
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        formInputs.forEach(input => {
            const formGroup = input.parentElement;
            removeError(formGroup);
            
            if (!input.value.trim()) {
                isValid = false;
                showError(formGroup, 'Bu alan zorunludur');
            } else if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    showError(formGroup, 'Geçerli bir e-posta adresi giriniz');
                }
            } else if (input.type === 'tel') {
                const phoneRegex = /^[\d\s\-+()]{10,}$/;
                if (!phoneRegex.test(input.value)) {
                    isValid = false;
                    showError(formGroup, 'Geçerli bir telefon numarası giriniz');
                }
            }
        });
        
        return isValid;
    }

    // Error Handling Functions
    function showError(formGroup, message) {
        formGroup.classList.add('error');
        const error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = message;
        formGroup.appendChild(error);
    }

    function removeError(formGroup) {
        formGroup.classList.remove('error');
        const error = formGroup.querySelector('.error-message');
        if (error) error.remove();
    }

    // Message Display
    function showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        document.querySelector('.contact-form').appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => messageElement.remove(), 300);
        }, 3000);
    }

    // Back to Top Button
    function updateBackToTopButton() {
        if (window.pageYOffset > 500) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    }

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Initialize page
    updateActiveNavLink();
    document.body.classList.add('loaded');
});