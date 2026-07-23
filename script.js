/**
 * Keerthika M Portfolio Javascript Interactions
 * Dynamic navigation highlight, typewriter effect, scroll animations, mobile menu toggle, contact form mock-service.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State & Header Scroll Behavior
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger immediately to check page reload state

    // 2. Mobile Responsive Hamburger Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        mobileToggle.classList.toggle('active');
        navbar.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking on nav link (for mobile layout)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.classList.remove('active');
                navbar.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // 3. Dynamic Typewriter Effect for Hero Headline
    const typewriterElement = document.getElementById('typewriter');
    const roles = [
        "an AI & Data Science Student",
        "a Full-Stack Developer",
        "a Machine Learning Enthusiast",
        "a Data Analyst"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Deleting characters
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Delete faster
        } else {
            // Typing characters
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Normal typing speed
        }

        // State changes
        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at the end of word
            isDeleting = true;
            typingSpeed = 2000; // Delay before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length; // Move to next word
            typingSpeed = 500; // Pause before starting next word
        }

        setTimeout(typeEffect, typingSpeed);
    };

    if (typewriterElement) {
        setTimeout(typeEffect, 1000);
    }

    // 4. Smooth Scrolling Nav Active Section Observer
    const sections = document.querySelectorAll('section');
    
    // Intersection Observer to highlight active link
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the focus area of the screen
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 5. Scroll Reveal Animations (Intersection Observer for Card Effects)
    const revealElements = document.querySelectorAll('.card-reveal, .timeline-item');
    
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px', // Fire slightly before element enters viewport completely
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Stop tracking once animated
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 6. Interactive Contact Form Submission Handler (Integrated with FormSubmit.co)
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const formSubmitBtn = document.getElementById('form-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Extract user values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showFeedback("Please fill out all fields.", "error");
                return;
            }

            // Disable submit button and show loading spinner
            formSubmitBtn.disabled = true;
            const originalBtnContent = formSubmitBtn.innerHTML;
            formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            // Send real email using Web3Forms API
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: "c39aed7d-542d-4839-a213-04200293485e",
                    name: name,
                    email: email,
                    message: message,
                    subject: `New Portfolio Contact from ${name}`
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showFeedback(`Thank you, ${name}! Your message has been sent successfully.`, "success");
                    contactForm.reset();
                } else {
                    throw new Error(data.message || "Submission failed.");
                }
            })
            .catch(error => {
                console.error("Error sending message:", error);
                showFeedback("Oops! There was a problem sending your message. Please try again.", "error");
            })
            .finally(() => {
                // Re-enable submit button
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = originalBtnContent;

                // Clear notification after 6 seconds
                setTimeout(() => {
                    formFeedback.textContent = '';
                    formFeedback.className = 'form-feedback';
                }, 6000);
            });
        });
    }

    const showFeedback = (msg, status) => {
        formFeedback.textContent = msg;
        formFeedback.className = `form-feedback ${status}`;
    };

    // 7. Back-To-Top Button Visibility Scroll Listener
    const backToTopBtn = document.getElementById('back-to-top');

    const handleBackToTopVisibility = () => {
        if (window.scrollY > 800) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
            backToTopBtn.style.pointerEvents = 'auto';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
            backToTopBtn.style.pointerEvents = 'none';
        }
    };

    window.addEventListener('scroll', handleBackToTopVisibility);
    
    // Smooth transition control styling (set directly to avoid initial load flashes)
    if (backToTopBtn) {
        backToTopBtn.style.transition = 'all 0.3s ease';
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});
