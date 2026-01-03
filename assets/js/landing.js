/**
 * Landing Page Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Landing Page Loaded');

    // Add scroll effect to navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
