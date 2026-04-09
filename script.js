/* ============================================================
   REAL RUSSIA — All Interactive JavaScript
   ============================================================ */

// Формы и EmailJS были удалены, так как сайт перешел в режим ожидания до 10 апреля 2026 года

// ——— DOM Elements ———
const navbar = document.getElementById('navbar');
const burgerBtn = document.getElementById('burger-btn');
const navLinks = document.getElementById('nav-links');
const mobileOverlay = document.getElementById('mobile-overlay');
const toast = document.getElementById('toast');

// Modals
const downloadModal = document.getElementById('download-modal');

// ——— NAVBAR: scroll effect ———
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ——— BURGER MENU ———
burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('open');
    navLinks.classList.toggle('open');
    mobileOverlay.classList.toggle('active');
});
mobileOverlay.addEventListener('click', closeMenu);
document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMenu));

function closeMenu() {
    burgerBtn.classList.remove('open');
    navLinks.classList.remove('open');
    mobileOverlay.classList.remove('active');
}

// ——— TOAST NOTIFICATION ———
function showToast(message, type = 'success', duration = 3000) {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => { toast.className = 'toast'; }, duration);
}

// ——— MODALS ———
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Open buttons
document.getElementById('download-btn').addEventListener('click', () => openModal(downloadModal));
document.getElementById('nav-cta-btn').addEventListener('click', () => openModal(downloadModal));

// Close buttons
document.getElementById('close-download').addEventListener('click', () => closeModal(downloadModal));

// Close on backdrop click
[downloadModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
});

// Close on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        [downloadModal, trailerModal, donateModal].forEach(closeModal);
    }
});

// Формы были удалены

// ——— FAQ ACCORDION ———
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        // Toggle clicked
        if (!isOpen) item.classList.add('open');
    });
});

// ——— COUNTER ANIMATION (Hero Stats) ———
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString('ru-RU') + '+';
    }, 16);
}

// ——— PROGRESS BAR ANIMATION ———
function animateProgressBars() {
    document.querySelectorAll('.progress-fill').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = width; }, 200);
    });
}

// ——— SCROLL REVEAL ———
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// ——— COUNTER OBSERVER ———
let countersAnimated = false;
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            document.querySelectorAll('.stat-number[data-target]').forEach(animateCounter);
        }
    });
}, { threshold: 0.5 });

// ——— PROGRESS OBSERVER ———
let progressAnimated = false;
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !progressAnimated) {
            progressAnimated = true;
            animateProgressBars();
        }
    });
}, { threshold: 0.2 });

// ——— HERO PARALLAX (только на десктопе с мышью) ———
(function initParallax() {
    // Проверяем: если тачскрин или мобильный — не запускаем
    const isTouchDevice = window.matchMedia('(hover: none)').matches
        || window.matchMedia('(max-width: 768px)').matches;
    if (isTouchDevice) return;

    const heroSection = document.querySelector('.hero');
    const heroBgImg = document.querySelector('.hero-bg img');
    if (!heroSection || !heroBgImg) return;

    // Максимальное смещение фона в % (чем больше — тем сильнее эффект)
    const strength = 2.5;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
        // Плавное сглаживание (ease factor)
        currentX = lerp(currentX, targetX, 0.06);
        currentY = lerp(currentY, targetY, 0.06);

        heroBgImg.style.transform =
            `scale(1.12) translate(${currentX.toFixed(3)}%, ${currentY.toFixed(3)}%)`;

        rafId = requestAnimationFrame(animate);
    }

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        // Нормализуем позицию курсора от -1 до +1
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        // Инвертируем: фон движется навстречу курсору (как настоящий параллакс)
        targetX = -nx * strength;
        targetY = -ny * strength;

        if (!rafId) rafId = requestAnimationFrame(animate);
    });

    heroSection.addEventListener('mouseleave', () => {
        // При уходе курсора — плавно возвращаем в центр
        targetX = 0;
        targetY = 0;
    });
})();

// ——— PARTICLES ———
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 18;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';

        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = Math.random() * 8 + 10;

        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            bottom: -10px;
            animation-duration: ${duration}s;
            animation-delay: -${delay}s;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        container.appendChild(p);
    }
}

// ——— ACTIVE NAV LINK on scroll ———
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scroll = window.scrollY + 120;
    let found = false;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);

        if (link) {
            if (scroll >= top && scroll < top + height) {
                navLinkEls.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                found = true;
            }
        }
    });

    // If nothing matched (top of page), remove all
    if (!found && window.scrollY < 100) {
        navLinkEls.forEach(l => l.classList.remove('active'));
    }
}

window.addEventListener('scroll', updateActiveNav);

// ——— SMOOTH SCROLL for ALL anchor links ———
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ——— INIT ———
document.addEventListener('DOMContentLoaded', () => {
    // Add reveal class to cards
    document.querySelectorAll(
        '.about-card, .feature-text, .feature-img-block, .progress-card, ' +
        '.donate-card, .social-card, .faq-item, .tl-item'
    ).forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Observe counters
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObserver.observe(heroStats);

    // Observe progress bars
    const progressSection = document.querySelector('.progress-section');
    if (progressSection) progressObserver.observe(progressSection);

    // Create particles
    createParticles();

    // Open first FAQ on load
    const firstFaq = document.querySelector('.faq-item');
    if (firstFaq) firstFaq.classList.add('open');
});
