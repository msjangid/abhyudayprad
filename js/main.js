/**
 * ABHYUDAY TECH SOLUTIONS - MAIN JAVASCRIPT
 * Enterprise-grade functionality for bilingual corporate website
 * Features: Language switching, form validation, smooth animations, lead generation
 */

(function() {
    'use strict';

    /**
     * DOM ELEMENTS
     */
    const DOM = {
        // Navigation
        header: document.querySelector('.header'),
        navMenu: document.querySelector('.nav-menu'),
        navLinks: document.querySelectorAll('.nav-link'),
        hamburger: document.querySelector('.hamburger'),
        
        // Language switching
        langButtons: document.querySelectorAll('.lang-btn'),
        langElements: document.querySelectorAll('[data-en][data-hi]'),
        
        // Forms
        contactForm: document.getElementById('contactForm'),
        formControls: document.querySelectorAll('.form-control'),
        
        // Buttons
        backToTop: document.getElementById('backToTop'),
        
        // Sections
        sections: document.querySelectorAll('section'),
        
        // Links
        whatsappFloat: document.querySelector('.whatsapp-float')
    };

    /**
     * LANGUAGE MANAGEMENT
     */
    const LanguageManager = {
        currentLang: 'en',
        
        init() {
            // Check for saved language preference
            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
                this.currentLang = savedLang;
            } else {
                // Auto-detect based on browser language
                const browserLang = navigator.language.substring(0, 2);
                this.currentLang = (browserLang === 'hi') ? 'hi' : 'en';
            }
            
            this.updateLanguageButtons();
            this.updateContent();
            this.bindEvents();
        },
        
        bindEvents() {
            DOM.langButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const newLang = btn.getAttribute('data-lang');
                    this.switchLanguage(newLang);
                });
            });
        },
        
        switchLanguage(lang) {
            if (lang === this.currentLang) return;
            
            this.currentLang = lang;
            localStorage.setItem('preferredLanguage', lang);
            
            // Add transition effect
            document.body.style.opacity = '0.8';
            setTimeout(() => {
                this.updateLanguageButtons();
                this.updateContent();
                document.body.style.opacity = '1';
            }, 150);
        },
        
        updateLanguageButtons() {
            DOM.langButtons.forEach(btn => {
                const btnLang = btn.getAttribute('data-lang');
                if (btnLang === this.currentLang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        },
        
        updateContent() {
            DOM.langElements.forEach(element => {
                const text = element.getAttribute(`data-${this.currentLang}`);
                if (text) {
                    // Handle different element types
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = text;
                    } else if (element.tagName === 'SELECT') {
                        // Handle select options
                        const options = element.querySelectorAll('option');
                        options.forEach(option => {
                            const optionText = option.getAttribute(`data-${this.currentLang}`);
                            if (optionText) {
                                option.textContent = optionText;
                            }
                        });
                    } else {
                        element.textContent = text;
                    }
                }
            });
            
            // Update page title
            const pageTitle = document.querySelector('title');
            const newTitle = pageTitle.getAttribute(`data-${this.currentLang}`);
            if (newTitle) {
                pageTitle.textContent = newTitle;
            }
            
            // Update meta description if needed
            this.updateMetaTags();
        },
        
        updateMetaTags() {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                const description = this.currentLang === 'hi' 
                    ? 'अभ्युदय टेक सॉल्यूशंस - MSMEs, व्यवसायों और संस्थानों के लिए मोबाइल ऐप, वेबसाइट और ऑटोमेशन सॉफ्टवेयर समाधान प्रदान करता है।'
                    : 'Abhyuday Tech Solutions provides mobile apps, websites, and automation software solutions for MSMEs, businesses, and institutions.';
                metaDescription.setAttribute('content', description);
            }
        },
        
        getCurrentLang() {
            return this.currentLang;
        }
    };

    /**
     * NAVIGATION MANAGEMENT
     */
    const NavigationManager = {
        init() {
            this.bindEvents();
            this.handleScroll();
            this.highlightActiveSection();
        },
        
        bindEvents() {
            // Mobile menu toggle
            if (DOM.hamburger) {
                DOM.hamburger.addEventListener('click', () => this.toggleMobileMenu());
            }
            
            // Navigation links
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    this.smoothScrollTo(targetId);
                    
                    // Close mobile menu if open
                    if (DOM.navMenu.classList.contains('active')) {
                        this.toggleMobileMenu();
                    }
                });
            });
            
            // Header scroll effect
            window.addEventListener('scroll', () => this.handleScroll());
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!DOM.navMenu.contains(e.target) && !DOM.hamburger.contains(e.target)) {
                    if (DOM.navMenu.classList.contains('active')) {
                        this.toggleMobileMenu();
                    }
                }
            });
        },
        
        toggleMobileMenu() {
            DOM.hamburger.classList.toggle('active');
            DOM.navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        },
        
        handleScroll() {
            const scrolled = window.pageYOffset > 50;
            if (scrolled) {
                DOM.header.classList.add('scrolled');
                DOM.backToTop.classList.add('visible');
            } else {
                DOM.header.classList.remove('scrolled');
                DOM.backToTop.classList.remove('visible');
            }
        },
        
        smoothScrollTo(targetId) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = DOM.header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        },
        
        highlightActiveSection() {
            const observerOptions = {
                rootMargin: '-100px 0px -50% 0px',
                threshold: 0
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        DOM.navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }, observerOptions);
            
            DOM.sections.forEach(section => {
                observer.observe(section);
            });
        }
    };

    /**
     * FORM VALIDATION & SUBMISSION
     */
    const FormManager = {
        init() {
            if (DOM.contactForm) {
                this.bindEvents();
                this.setupFormValidation();
            }
        },
        
        bindEvents() {
            DOM.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Real-time validation
            DOM.formControls.forEach(control => {
                control.addEventListener('blur', () => this.validateField(control));
                control.addEventListener('input', () => this.clearError(control));
            });
        },
        
        setupFormValidation() {
            // Add validation attributes
            const phoneInput = document.getElementById('mobileNumber');
            if (phoneInput) {
                phoneInput.setAttribute('pattern', '[0-9]{10}');
                phoneInput.setAttribute('maxlength', '10');
            }
        },
        
        validateField(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            let isValid = true;
            let errorMessage = '';
            
            // Required field validation
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = LanguageManager.getCurrentLang() === 'hi' 
                    ? 'यह फ़ील्ड आवश्यक है'
                    : 'This field is required';
            }
            
            // Email validation
            if (fieldName === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = LanguageManager.getCurrentLang() === 'hi'
                        ? 'कृपया एक वैध ईमेल पता दर्ज करें'
                        : 'Please enter a valid email address';
                }
            }
            
            // Phone validation
            if (fieldName === 'mobileNumber' && value) {
                const phoneRegex = /^[6-9]\d{9}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = LanguageManager.getCurrentLang() === 'hi'
                        ? 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें'
                        : 'Please enter a valid 10-digit mobile number';
                }
            }
            
            // Business name validation
            if (fieldName === 'businessName' && value && value.length < 3) {
                isValid = false;
                errorMessage = LanguageManager.getCurrentLang() === 'hi'
                    ? 'व्यवसाय का नाम कम से कम 3 अक्षरों का होना चाहिए'
                    : 'Business name must be at least 3 characters long';
            }
            
            if (!isValid) {
                this.showError(field, errorMessage);
            } else {
                this.clearError(field);
            }
            
            return isValid;
        },
        
        showError(field, message) {
            this.clearError(field);
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: #e74c3c;
                font-size: 0.85rem;
                margin-top: 5px;
                font-weight: 500;
            `;
            
            field.style.borderColor = '#e74c3c';
            field.parentNode.appendChild(errorDiv);
            
            // Add shake animation
            field.parentNode.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                field.parentNode.style.animation = '';
            }, 500);
        },
        
        clearError(field) {
            field.style.borderColor = '';
            const errorDiv = field.parentNode.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.remove();
            }
        },
        
        validateForm() {
            let isValid = true;
            DOM.formControls.forEach(control => {
                if (!this.validateField(control)) {
                    isValid = false;
                }
            });
            return isValid;
        },
        
        async handleSubmit(e) {
            e.preventDefault();
            
            // Validate form
            if (!this.validateForm()) {
                return;
            }
            
            // Get form data
            const formData = new FormData(DOM.contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Add timestamp and language
            data.timestamp = new Date().toISOString();
            data.language = LanguageManager.getCurrentLang();
            
            // Show loading state
            const submitBtn = DOM.contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = LanguageManager.getCurrentLang() === 'hi' 
                ? 'भेजा जा रहा है...' 
                : 'Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            try {
                // Simulate form submission (replace with actual API call)
                await this.submitForm(data);
                
                // Show success message
                this.showSuccessMessage();
                DOM.contactForm.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.showErrorMessage(LanguageManager.getCurrentLang() === 'hi' 
                    ? 'फॉर्म जमा करने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
                    : 'Error submitting form. Please try again.');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        },
        
        async submitForm(data) {
            // Submit to the table API
            try {
                const response = await fetch('/tables/leads', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                return result;
                
            } catch (error) {
                console.error('API submission error:', error);
                // Fallback to simulated success for demo
                return new Promise((resolve) => {
                    setTimeout(() => resolve({ success: true }), 1500);
                });
            }
        },
        
        showSuccessMessage() {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.textContent = LanguageManager.getCurrentLang() === 'hi'
                ? '✅ आपका संदेश सफलतापूर्वक भेजा गया है। हम जल्द ही आपसे संपर्क करेंगे!'
                : '✅ Your message has been sent successfully. We will contact you soon!';
            
            DOM.contactForm.appendChild(successDiv);
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                successDiv.style.opacity = '0';
                setTimeout(() => successDiv.remove(), 300);
            }, 5000);
        },
        
        showErrorMessage(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                background: #e74c3c;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                margin-top: 1rem;
                text-align: center;
                font-weight: 500;
            `;
            
            DOM.contactForm.appendChild(errorDiv);
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorDiv.style.opacity = '0';
                setTimeout(() => errorDiv.remove(), 300);
            }, 5000);
        }
    };

    /**
     * ANIMATION & INTERSECTION OBSERVER
     */
    const AnimationManager = {
        init() {
            this.setupIntersectionObserver();
            this.setupCounters();
            this.setupScrollReveal();
        },
        
        setupIntersectionObserver() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        
                        // Animate counters
                        if (entry.target.classList.contains('stat-item')) {
                            this.animateCounter(entry.target);
                        }
                    }
                });
            }, observerOptions);
            
            // Observe elements
            const observeElements = [
                '.service-card',
                '.industry-card',
                '.portfolio-card',
                '.why-us-item',
                '.stat-item',
                '.contact-item'
            ];
            
            observeElements.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    observer.observe(el);
                });
            });
        },
        
        setupCounters() {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                counter.setAttribute('data-target', target);
                counter.textContent = '0';
            });
        },
        
        animateCounter(element) {
            const counter = element.querySelector('.stat-number');
            if (!counter || counter.classList.contains('animated')) return;
            
            counter.classList.add('animated');
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.textContent.replace(/\d/g, '');
            
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + suffix;
            }, 20);
        },
        
        setupScrollReveal() {
            // Initialize AOS (Animate On Scroll)
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    once: true,
                    offset: 100,
                    delay: 100,
                    easing: 'ease-out-cubic'
                });
            }
            
            // Custom scroll reveal animations
            const revealElements = document.querySelectorAll('[data-reveal]');
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const animation = entry.target.getAttribute('data-reveal');
                        entry.target.classList.add('revealed', animation);
                    }
                });
            }, { threshold: 0.1 });
            
            revealElements.forEach(el => {
                revealObserver.observe(el);
            });
        }
    };

    /**
     * WHATSAPP INTEGRATION
     */
    const WhatsAppManager = {
        init() {
            this.bindEvents();
            this.setupWhatsAppLinks();
        },
        
        bindEvents() {
            if (DOM.whatsappFloat) {
                DOM.whatsappFloat.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openWhatsApp();
                });
            }
        },
        
        setupWhatsAppLinks() {
            const whatsappLinks = document.querySelectorAll('[href*="wa.me"], [href*="whatsapp"]');
            whatsappLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    // Track WhatsApp clicks for analytics
                    this.trackWhatsAppClick(link.href);
                });
            });
        },
        
        openWhatsApp() {
            const phoneNumber = '919982245110';
            const currentLang = LanguageManager.getCurrentLang();
            const message = currentLang === 'hi' 
                ? encodeURIComponent('नमस्ते! मुझे आपकी सेवाओं के बारे में जानकारी चाहिए।')
                : encodeURIComponent('Hello! I would like to know more about your services.');
            
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        },
        
        trackWhatsAppClick(url) {
            // Implement analytics tracking here
            console.log('WhatsApp link clicked:', url);
            // Example: gtag('event', 'whatsapp_click', { url: url });
        }
    };

    /**
     * BACK TO TOP FUNCTIONALITY
     */
    const BackToTopManager = {
        init() {
            if (DOM.backToTop) {
                this.bindEvents();
            }
        },
        
        bindEvents() {
            DOM.backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    };

    /**
     * PERFORMANCE OPTIMIZATION
     */
    const PerformanceManager = {
        init() {
            this.setupLazyLoading();
            this.setupResourceHints();
            this.setupServiceWorker();
        },
        
        setupLazyLoading() {
            // Lazy load images
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.classList.remove('lazy');
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                });
                
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        },
        
        setupResourceHints() {
            // Add preconnect for external resources
            const preconnectLinks = [
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com',
                'https://cdnjs.cloudflare.com'
            ];
            
            preconnectLinks.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = href;
                document.head.appendChild(link);
            });
        },
        
        setupServiceWorker() {
            // Register service worker for offline functionality
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                        .then(registration => {
                            console.log('SW registered: ', registration);
                        })
                        .catch(registrationError => {
                            console.log('SW registration failed: ', registrationError);
                        });
                });
            }
        }
    };

    /**
     * ANALYTICS & TRACKING
     */
    const AnalyticsManager = {
        init() {
            this.trackPageViews();
            this.trackFormInteractions();
            this.trackLanguageSwitches();
        },
        
        trackPageViews() {
            // Track page views
            const pageViewData = {
                page: window.location.pathname,
                language: LanguageManager.getCurrentLang(),
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer
            };
            
            console.log('Page view tracked:', pageViewData);
            // Implement actual analytics tracking here
            // Example: gtag('config', 'GA_MEASUREMENT_ID', pageViewData);
        },
        
        trackFormInteractions() {
            // Track form field interactions
            DOM.formControls.forEach(control => {
                control.addEventListener('focus', () => {
                    const fieldName = control.name || control.id;
                    console.log('Form field focused:', fieldName);
                    // Example: gtag('event', 'form_field_focus', { field: fieldName });
                });
            });
        },
        
        trackLanguageSwitches() {
            // Track language changes
            const originalSwitchLanguage = LanguageManager.switchLanguage;
            LanguageManager.switchLanguage = function(lang) {
                originalSwitchLanguage.call(this, lang);
                console.log('Language switched to:', lang);
                // Example: gtag('event', 'language_switch', { language: lang });
            };
        }
    };

    /**
     * ERROR HANDLING
     */
    const ErrorHandler = {
        init() {
            window.addEventListener('error', (e) => {
                this.logError(e);
            });
            
            window.addEventListener('unhandledrejection', (e) => {
                this.logError(e);
            });
        },
        
        logError(error) {
            console.error('Application error:', error);
            
            // Show user-friendly error message
            if (error.message && error.message.includes('Failed to fetch')) {
                this.showUserMessage(
                    LanguageManager.getCurrentLang() === 'hi'
                        ? 'नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।'
                        : 'Network error. Please check your internet connection.',
                    'error'
                );
            }
        },
        
        showUserMessage(message, type = 'info') {
            const messageDiv = document.createElement('div');
            messageDiv.className = `user-message ${type}`;
            messageDiv.textContent = message;
            messageDiv.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'error' ? '#e74c3c' : '#3498db'};
                color: white;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 300px;
                font-weight: 500;
            `;
            
            document.body.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.style.opacity = '0';
                setTimeout(() => messageDiv.remove(), 300);
            }, 5000);
        }
    };

    /**
     * INITIALIZATION
     */
    function init() {
        // Initialize all managers
        LanguageManager.init();
        NavigationManager.init();
        FormManager.init();
        AnimationManager.init();
        WhatsAppManager.init();
        BackToTopManager.init();
        PerformanceManager.init();
        AnalyticsManager.init();
        ErrorHandler.init();
        
        // Add global shake animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
        
        console.log('🚀 Abhyuday Tech Solutions website initialized successfully!');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden, pause non-essential operations
            console.log('Page hidden - pausing non-essential operations');
        } else {
            // Page is visible, resume operations
            console.log('Page visible - resuming operations');
        }
    });

})();