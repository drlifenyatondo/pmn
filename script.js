/* ==========================================================================
   Global Interactive Logic - Portfolio JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. Responsive Mobile Navigation Menu & Hamburger Toggle
       ---------------------------------------------------------------------- */
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('open');
            }
        });

        window.addEventListener('scroll', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('open');
            }
        }, { passive: true });
    }
});

/**
 * Filter function to toggle visibility of portfolio cards dynamically.
 * @param {string} category - 'all', 'tech', or 'advocacy'
 */
function filterWork(category) {
    const cards = document.querySelectorAll('.card-work');
    const btnAll = document.getElementById('tab-all');
    const btnTech = document.getElementById('tab-tech');
    const btnAdvocacy = document.getElementById('tab-advocacy');

    if (btnAll && btnTech && btnAdvocacy) {
        [btnAll, btnTech, btnAdvocacy].forEach(btn => {
            btn.className = 'btn btn-secondary';
        });

        const activeBtn = document.getElementById(`tab-${category}`);
        if (activeBtn) {
            activeBtn.className = 'btn btn-primary';
        }
    }

    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'flex';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });
}