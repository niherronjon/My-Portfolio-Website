// Main JavaScript for Portfolio

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeAnimations();
    initializeSkillsFilter();
    initializeProjectsFilter();
    initializeContactForm();
    initializeViewCounter();
    initializeScrollEffects();
});

// Theme Management
function initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Navigation
function initializeNavigation() {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu if open
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Active link highlighting based on scroll position
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY + 100;

        navLinks.forEach(link => {
            const section = document.querySelector(link.getAttribute('href'));
            if (section) {
                if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });

        // Nav background opacity based on scroll
        if (window.scrollY > 50) {
            nav.style.background = 'var(--glass-bg)';
        } else {
            nav.style.background = 'var(--glass-bg)';
        }
    });
}

// Animation Observers
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // Special handling for skill bars
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillBars(entry.target);
                }

                // Special handling for stats counter
                if (entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.skill-item, .project-card, .timeline-item, .hero-stats');
    elementsToAnimate.forEach(el => observer.observe(el));

    // Stagger animation for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

function animateSkillBars(skillItem) {
    const progressBar = skillItem.querySelector('.skill-progress');
    if (progressBar) {
        setTimeout(() => {
            const level = progressBar.getAttribute('data-level');
            progressBar.style.width = level + '%';
        }, 200);
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        if (counter.id === 'view-counter') return; // Skip view counter

        const target = parseInt(counter.textContent);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
        }, 16);
    });
}

// Skills Filter
function initializeSkillsFilter() {
    const filterBtns = document.querySelectorAll('.skills-section .filter-btn');
    const skillItems = document.querySelectorAll('.skill-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter skills
            skillItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    // Re-trigger animation
                    setTimeout(() => item.classList.add('animate'), 100);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('animate');
                }
            });
        });
    });
}

// Projects Filter
function initializeProjectsFilter() {
    const filterBtns = document.querySelectorAll('.projects-filter .filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter projects with animation
            projectCards.forEach((card, index) => {
                const categories = card.getAttribute('data-category') || '';

                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    card.style.animationDelay = `${index * 0.1}s`;
                    setTimeout(() => card.classList.add('fade-in'), 50);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
                }
            });
        });
    });
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const formObject = Object.fromEntries(formData);

        // Disable submit button
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual form handler)
        setTimeout(() => {
            // Here you would typically send to a service like Formspree
            // For demo purposes, we'll just show success
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');

            // Reset form
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);

        // Example for real form submission:
        /*
        fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showNotification('Message sent successfully!', 'success');
                this.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            showNotification('Error sending message. Please try again.', 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
        */
    });
}

// View Counter
function initializeViewCounter() {
    const viewCounter = document.getElementById('view-counter');

    // Check if we've already counted this session
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (!hasVisited) {
        // Increment and get count
        incrementViewCount()
            .then(count => {
                viewCounter.textContent = formatNumber(count);
                sessionStorage.setItem('hasVisited', 'true');
            })
            .catch(error => {
                console.error('Error updating view count:', error);
                viewCounter.textContent = '1,234'; // Fallback number
            });
    } else {
        // Just get the current count
        getViewCount()
            .then(count => {
                viewCounter.textContent = formatNumber(count);
            })
            .catch(error => {
                console.error('Error getting view count:', error);
                viewCounter.textContent = '1,234'; // Fallback number
            });
    }
}

// View Counter API Functions (using a simple counter API)
async function incrementViewCount() {
    try {
        // Using a simple counter API - replace with your preferred service
        const response = await fetch('https://api.countapi.xyz/hit/alexchen.dev/visits');
        const data = await response.json();
        return data.value;
    } catch (error) {
        throw error;
    }
}

async function getViewCount() {
    try {
        const response = await fetch('https://api.countapi.xyz/get/alexchen.dev/visits');
        const data = await response.json();
        return data.value;
    } catch (error) {
        throw error;
    }
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
}

// Scroll Effects
function initializeScrollEffects() {
    // Parallax effect for hero background orbs
    const orbs = document.querySelectorAll('.gradient-orb');

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.3;
            orb.style.transform = `translateY(${rate * speed}px)`;
        });
    });

    // Add scroll indicator
    createScrollIndicator();
}

function createScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.innerHTML = `
        <div class="scroll-progress"></div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .scroll-indicator {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: var(--bg-secondary);
            z-index: 9999;
        }
        
        .scroll-progress {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
            width: 0%;
            transition: width 0.1s ease;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(indicator);

    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        document.querySelector('.scroll-progress').style.width = scrolled + '%';
    });
}

// Project Modal Functions
function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // Project data
    const projects = {
        'ai-generator': {
            title: 'AI Content Generator',
            content: `
                <div class="modal-project-content">
                    <div class="project-hero">
                        <div class="project-placeholder">
                            <svg width="100" height="100" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                    </div>
                    
                    <h3>Challenge</h3>
                    <p>Small businesses needed an affordable way to create high-quality marketing content without hiring expensive copywriters or spending hours writing.</p>
                    
                    <h3>Solution</h3>
                    <ul>
                        <li>Built a full-stack application using React and Node.js</li>
                        <li>Integrated OpenAI's GPT API for content generation</li>
                        <li>Created templates for different content types (emails, social posts, ads)</li>
                        <li>Implemented user authentication and content history</li>
                    </ul>
                    
                    <h3>Results</h3>
                    <ul>
                        <li>500+ active users in the first 3 months</li>
                        <li>Generated over 10,000 pieces of content</li>
                        <li>Average time savings of 80% reported by users</li>
                        <li>4.8/5 star rating on Product Hunt</li>
                    </ul>
                    
                    <h3>Technical Implementation</h3>
                    <pre><code>// Example API integration
const generateContent = async (prompt, type) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: \`Generate \${type}: \${prompt}\`,
    max_tokens: 200,
    temperature: 0.7
  });
  
  return response.data.choices[0].text.trim();
};</code></pre>
                    
                    <div class="project-links">
                        <a href="#" class="btn btn-primary">View Live Demo</a>
                        <a href="#" class="btn btn-secondary">GitHub Repository</a>
                    </div>
                </div>
            `
        },
        'dashboard': {
            title: 'E-commerce Dashboard',
            content: `
                <div class="modal-project-content">
                    <div class="project-hero">
                        <div class="project-placeholder">
                            <svg width="100" height="100" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"/>
                            </svg>
                        </div>
                    </div>
                    
                    <h3>Challenge</h3>
                    <p>E-commerce businesses needed a comprehensive dashboard to manage inventory, orders, and analytics in real-time without switching between multiple tools.</p>
                    
                    <h3>Approach</h3>
                    <ul>
                        <li>Designed a responsive Vue.js application with modular components</li>
                        <li>Integrated with Firebase for real-time data synchronization</li>
                        <li>Used Chart.js for interactive data visualizations</li>
                        <li>Implemented role-based access control</li>
                    </ul>
                    
                    <h3>Impact</h3>
                    <ul>
                        <li>Reduced order processing time by 60%</li>
                        <li>Improved inventory accuracy to 99.2%</li>
                        <li>Increased team productivity by 40%</li>
                        <li>Currently used by 50+ e-commerce businesses</li>
                    </ul>
                    
                    <div class="project-links">
                        <a href="#" class="btn btn-primary">View Live Demo</a>
                        <a href="#" class="btn btn-secondary">GitHub Repository</a>
                    </div>
                </div>
            `
        },
        'fitness-app': {
            title: 'Fitness Tracking App',
            content: `
                <div class="modal-project-content">
                    <div class="project-hero">
                        <div class="project-placeholder">
                            <svg width="100" height="100" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 4h10v13H7V4z"/>
                            </svg>
                        </div>
                    </div>
                    
                    <h3>Challenge</h3>
                    <p>Fitness enthusiasts wanted a mobile app that could track workouts, provide social motivation, and offer personalized training plans all in one place.</p>
                    
                    <h3>Solution</h3>
                    <ul>
                        <li>Built cross-platform app using React Native</li>
                        <li>Implemented offline-first architecture with SQLite</li>
                        <li>Created social features for sharing progress</li>
                        <li>Integrated with wearable devices via HealthKit/Google Fit</li>
                    </ul>
                    
                    <h3>Results</h3>
                    <ul>
                        <li>25,000+ downloads in the first year</li>
                        <li>4.7/5 star rating on App Store</li>
                        <li>85% user retention rate after 30 days</li>
                        <li>Featured in "Best Health Apps" by major tech publications</li>
                    </ul>
                    
                    <div class="project-links">
                        <a href="#" class="btn btn-primary">Download from App Store</a>
                        <a href="#" class="btn btn-secondary">View on GitHub</a>
                    </div>
                </div>
            `
        },
        'task-manager': {
            title: 'Task Management Platform',
            content: `
                <div class="modal-project-content">
                    <div class="project-hero">
                        <div class="project-placeholder">
                            <svg width="100" height="100" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                    </div>
                    
                    <h3>Challenge</h3>
                    <p>Remote teams needed a collaborative project management tool with real-time updates, integrated chat, and advanced reporting capabilities.</p>
                    
                    <h3>Approach</h3>
                    <ul>
                        <li>Developed with Next.js for optimal performance and SEO</li>
                        <li>Used Socket.io for real-time collaboration features</li>
                        <li>Implemented PostgreSQL with complex query optimization</li>
                        <li>Created custom reporting dashboard with data visualization</li>
                    </ul>
                    
                    <h3>Impact</h3>
                    <ul>
                        <li>Improved team productivity by 55%</li>
                        <li>Reduced project delivery time by 30%</li>
                        <li>Used by 200+ teams across 15 countries</li>
                        <li>Processed over 1 million tasks and messages</li>
                    </ul>
                    
                    <div class="project-links">
                        <a href="#" class="btn btn-primary">View Live Demo</a>
                        <a href="#" class="btn btn-secondary">GitHub Repository</a>
                    </div>
                </div>
            `
        }
    };

    const project = projects[projectId];
    if (project) {
        modalTitle.textContent = project.title;
        modalBody.innerHTML = project.content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus management for accessibility
        modal.focus();

        // Add modal styles if not already added
        if (!document.querySelector('#modal-styles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'modal-styles';
            modalStyles.textContent = `
                .modal-project-content h3 {
                    font-family: var(--font-heading);
                    color: var(--accent-primary);
                    margin: var(--space-xl) 0 var(--space-md) 0;
                }
                
                .modal-project-content h3:first-child {
                    margin-top: 0;
                }
                
                .modal-project-content ul {
                    margin-bottom: var(--space-lg);
                    padding-left: var(--space-lg);
                }
                
                .modal-project-content li {
                    margin-bottom: var(--space-sm);
                    color: var(--text-secondary);
                }
                
                .modal-project-content pre {
                    background: var(--bg-secondary);
                    border-radius: var(--border-radius);
                    padding: var(--space-lg);
                    overflow-x: auto;
                    margin: var(--space-lg) 0;
                }
                
                .modal-project-content code {
                    font-family: var(--font-mono);
                    font-size: 0.9rem;
                }
                
                .project-hero {
                    text-align: center;
                    padding: var(--space-xl) 0;
                    background: var(--bg-secondary);
                    border-radius: var(--border-radius);
                    margin-bottom: var(--space-xl);
                }
                
                .project-hero .project-placeholder {
                    color: var(--accent-primary);
                }
            `;
            document.head.appendChild(modalStyles);
        }
    }
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: var(--space-md) var(--space-lg);
                border-radius: var(--border-radius);
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 4.7s;
                max-width: 400px;
                word-wrap: break-word;
            }
            
            .notification-success {
                background: linear-gradient(135deg, #10b981, #059669);
            }
            
            .notification-error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
            }
            
            .notification-info {
                background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(notificationStyles);
    }

    document.body.appendChild(notification);

    // Remove notification after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
const optimizedScrollHandler = debounce(function() {
    // Any expensive scroll operations can go here
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling
window.addEventListener('error', function(e) {
    console.error('Portfolio error:', e.error);
    // You could send this to an error tracking service
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}