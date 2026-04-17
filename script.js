/**
 * Amogh Infotech - Core Application Logic
 * Implements Instant Content Switching and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    handleInitialRoute();
    initScrollEffects();
});

/**
 * Navigation & Content Switching Logic
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta, .footer-links a, .switch-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle internal links starting with #
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                switchSection(targetId);
                
                // Update URL hash without scrolling
                history.pushState(null, null, href);
            }
        });
    });
}

/**
 * Switches the visible section based on a target ID
 * @param {string} targetId 
 */
function switchSection(targetId) {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let targetSection = document.getElementById(targetId);
    
    // Default to hero if target doesn't exist
    if (!targetSection) targetId = 'hero';
    targetSection = document.getElementById(targetId);

    // Hide all sections and show target
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    targetSection.classList.add('active');

    // Update active state in navbar
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${targetId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Scroll to top instantly on switch
    window.scrollTo(0, 0);
}

/**
 * Handles initial page load based on URL hash
 */
function handleInitialRoute() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        switchSection(hash);
    } else {
        switchSection('hero');
    }
}

/**
 * UI Scroll Effects (similar to refer folder setup)
 */
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile Navigation Toggle
 */
function toggleMobileNav() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('d-none');
    navLinks.classList.toggle('mobile-active');
    
    // Add some mobile-only styling dynamically if needed or rely on CSS
}

// Ensure functions are globally accessible
window.toggleMobileNav = toggleMobileNav;

/**
 * Handle Contact Form AJAX Submission
 */
document.addEventListener('submit', async function (e) {
    if (e.target && e.target.id === 'contact-form') {
        e.preventDefault();
        
        const form = e.target;
        const btn = form.querySelector('#submit-btn');
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        const statusArea = document.getElementById('form-status');
        
        // Reset status
        statusArea.style.display = 'none';
        statusArea.className = ''; 
        
        // Show loading state
        btn.disabled = true;
        btnText.classList.add('d-none');
        btnLoader.classList.remove('d-none');
        
        const data = new FormData(form);
        
        try {
            const response = await fetch("https://formsubmit.co/ajax/amoginfotech@gmail.com", {
                method: "POST",
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            btn.disabled = false;
            btnText.classList.remove('d-none');
            btnLoader.classList.add('d-none');

            if (response.ok) {
                // SUCCESS: Green font, keep form, reset it
                form.reset();
                statusArea.innerHTML = `<span class="status-success"><i class="fa-solid fa-circle-check"></i> Thanks! Your message has been sent.</span>`;
                statusArea.style.display = 'block';
            } else {
                // FAILURE: Red font, keep form
                const result = await response.json();
                if (result.errors) {
                    statusArea.innerHTML = `<span class="status-error"><i class="fa-solid fa-triangle-exclamation"></i> ${result.errors.map(e => e.message).join(", ")}</span>`;
                } else {
                    statusArea.innerHTML = `<span class="status-error"><i class="fa-solid fa-triangle-exclamation"></i> Oops! Something went wrong.</span>`;
                }
                statusArea.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            btn.disabled = false;
            btnText.classList.remove('d-none');
            btnLoader.classList.add('d-none');
            
            // ERROR: Red font, keep form
            statusArea.innerHTML = `<span class="status-error"><i class="fa-solid fa-wifi"></i> Network error. Please try again.</span>`;
            statusArea.style.display = 'block';
        }
    }
});

/**
 * AI Readiness Quiz Logic
 */
let quizData = {};

function quizNext(choice) {
    quizData.focus = choice;
    const currentStep = document.querySelector('.quiz-step[data-step="1"]');
    const nextStep = document.querySelector('.quiz-step[data-step="2"]');
    
    currentStep.classList.remove('active');
    nextStep.classList.add('active');
}

function quizResult(choice) {
    quizData.dataState = choice;
    const currentStep = document.querySelector('.quiz-step[data-step="2"]');
    const resultScreen = document.getElementById('quiz-results-screen');
    const recommendationArea = document.getElementById('quiz-recommendation');
    
    currentStep.classList.remove('active');
    resultScreen.classList.add('active');
    
    let rec = "";
    if (quizData.dataState === 'Siloed') {
        rec = `<strong>Recommendation:</strong> You need <strong>Data Management & AI Readiness</strong>. Your data silos are currently blocking AI ROI. We suggest starting with a Data Audit.`;
    } else if (quizData.focus === 'Real Estate') {
        rec = `<strong>Recommendation:</strong> You are ready for the <strong>Claybrix App</strong>. Your focus on PropTech and established data makes you a prime candidate for our Real Estate automation suite.`;
    } else {
        rec = `<strong>Recommendation:</strong> You should explore <strong>AI Application Development</strong>. Custom autonomous agents can help you scale your ${quizData.focus} operations instantly.`;
    }
    
    recommendationArea.innerHTML = `<p class="lead">${rec}</p>`;
}

// Ensure functions are globally accessible
window.quizNext = quizNext;
window.quizResult = quizResult;
