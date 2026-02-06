// Mobile menu toggle
const initSiteScripts = () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu && !mobileMenuToggle.dataset.menuBound) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        mobileMenuToggle.dataset.menuBound = 'true';
    }

    if (!document.body.dataset.menuDocBound) {
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const currentMenu = document.querySelector('.nav-menu');
            const currentToggle = document.querySelector('.mobile-menu-toggle');

            if (!currentMenu || !currentToggle) {
                return;
            }

            if (!currentMenu.contains(event.target) && !currentToggle.contains(event.target)) {
                currentMenu.classList.remove('active');
            }
        });
        document.body.dataset.menuDocBound = 'true';
    }

    // Form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real application, this would send data to a server
            alert('Thank you for contacting us! We will get back to you soon via your preferred communication method.');
            contactForm.reset();
        });
    }

    const resourcesForm = document.getElementById('resourcesForm');
    if (resourcesForm) {
        resourcesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real application, this would send data to a server
            alert('Thank you for signing up! Check your email for your free resource guide.');
            resourcesForm.reset();
        });
    }

    const testimonialForm = document.getElementById('testimonialForm');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real application, this would send data to a server
            alert('Thank you for your submission! We appreciate your feedback.');
            testimonialForm.reset();
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
};

window.initSiteScripts = initSiteScripts;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteScripts);
} else {
    initSiteScripts();
}
