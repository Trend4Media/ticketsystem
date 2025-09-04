// Theme helpers (fallback in case inline script is blocked)
function getStoredTheme(){ try{ var v=localStorage.getItem('theme'); if(v==='dark'||v==='light') return v; }catch(_){} return null; }
function getSystemTheme(){ try{ return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; } catch(_) { return 'light'; } }
function getCurrentTheme(){ var a=document.documentElement.getAttribute('data-theme'); if(a==='dark'||a==='light') return a; return getStoredTheme() || getSystemTheme(); }
function applyTheme(theme){ var h=document.documentElement; h.setAttribute('data-theme', theme); if(theme==='dark'){ h.classList.add('dark'); } else { h.classList.remove('dark'); } try{ localStorage.setItem('theme', theme); }catch(_){} }
function toggleTheme(){ applyTheme(getCurrentTheme()==='dark' ? 'light' : 'dark'); }

// Smooth scrolling for navigation links and UI effects
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll effect to navigation
    const nav = document.querySelector('.nav');
    let lastScrollTop = 0;

    function isDark(){ return (document.documentElement.getAttribute('data-theme')||'') === 'dark'; }
    function navBg(scrolled){
        if (scrolled) return isDark() ? 'rgba(15, 22, 33, 0.98)' : 'rgba(255, 255, 255, 0.98)';
        return isDark() ? 'rgba(15, 22, 33, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    }

    // initialize nav background once
    nav.style.background = navBg(false);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            nav.style.background = navBg(true);
            nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = navBg(false);
            nav.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Theme toggle button (top right)
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function(){
            toggleTheme();
            // update nav background immediately when toggled
            const scrolled = (window.pageYOffset || document.documentElement.scrollTop) > 100;
            nav.style.background = navBg(scrolled);
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all feature cards, demo cards, and pricing cards
    const animatedElements = document.querySelectorAll('.feature-card, .demo-card, .pricing-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // Add stagger animation delay
    animatedElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        
        let i = 0;
        const typeWriter = function() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 500);
    }

    // Add floating animation to device mockup
    const deviceMockup = document.querySelector('.device-mockup');
    if (deviceMockup) {
        let start = Date.now();
        
        function animate() {
            const elapsed = Date.now() - start;
            const y = Math.sin(elapsed * 0.001) * 10;
            deviceMockup.style.transform = `perspective(1000px) rotateY(-5deg) rotateX(5deg) translateY(${y}px)`;
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // Add counter animation for stats
    const stats = document.querySelectorAll('.stat-number');
    const animateCounter = function(element, target, suffix = '') {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (suffix === '%') {
                element.textContent = Math.floor(current) + suffix;
            } else if (suffix === 's') {
                element.textContent = '< ' + Math.floor(current) + suffix;
            } else {
                element.textContent = current.toFixed(1) + suffix;
            }
        }, 20);
    };

    // Trigger counter animation when stats come into view
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const text = statNumber.textContent;
                
                if (text.includes('99.9%')) {
                    animateCounter(statNumber, 99.9, '%');
                } else if (text.includes('< 2s')) {
                    animateCounter(statNumber, 2, 's');
                } else if (text.includes('24/7')) {
                    statNumber.textContent = '24/7';
                }
                
                statsObserver.unobserve(statNumber);
            }
        });
    });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Demo functionality
function openDemo(type) {
    const modal = document.getElementById('demo-modal');
    const modalTitle = document.getElementById('modal-title');
    const demoFrame = document.getElementById('demo-frame');
    
    if (type === 'customer') {
        modalTitle.textContent = 'Kunden-Portal Demo';
        demoFrame.src = 'https://trend4media.github.io/ticketsystem-demo/customer';
    } else if (type === 'support') {
        modalTitle.textContent = 'Support-Dashboard Demo';
        demoFrame.src = 'https://trend4media.github.io/ticketsystem-demo/support';
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add animation
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.transition = 'opacity 0.3s ease';
    }, 10);
}

function closeDemo() {
    const modal = document.getElementById('demo-modal');
    const demoFrame = document.getElementById('demo-frame');
    
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        demoFrame.src = '';
    }, 300);
}

// Close modal when clicking outside
document.getElementById('demo-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeDemo();
    }
});

// Close modal with escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDemo();
    }
});

// Add smooth reveal animation for pricing cards
const pricingCards = document.querySelectorAll('.pricing-card');
pricingCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`;
});

const pricingObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

pricingCards.forEach(card => {
    pricingObserver.observe(card);
});

// Add interactive hover effects
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.feature-card, .demo-card, .pricing-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        }
    });
});

// Add click animation
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary, .btn-secondary, .demo-btn, .pricing-btn')) {
        const ripple = document.createElement('span');
        const rect = e.target.getBoundingClientRect();
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
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        e.target.style.position = 'relative';
        e.target.style.overflow = 'hidden';
        e.target.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);