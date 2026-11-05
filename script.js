document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Responsive Mobile Navigation Menu & Animated Hamburger Toggle
       ========================================================================== */
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

    /* ==========================================================================
       2. Dynamic Blog Filter Category Selection
       ========================================================================== */
    const filterBadges = document.querySelectorAll('.stack-badge');
    const blogCards = document.querySelectorAll('.blog-card');

    if (filterBadges.length > 0 && blogCards.length > 0) {
        filterBadges.forEach((badge) => {
            badge.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedCategory = badge.textContent.replace(/\[.*?\]/g, '').trim().toUpperCase();

                filterBadges.forEach(b => {
                    const badgeText = b.textContent.replace(/\[.*?\]/g, '').trim().toUpperCase();
                    if (badgeText === selectedCategory) {
                        b.classList.add('active-filter');
                    } else {
                        b.classList.remove('active-filter');
                    }
                });

                blogCards.forEach((card) => {
                    const cardCategory = card.querySelector('.sub-title');
                    if (!cardCategory) return;

                    const categoryText = cardCategory.textContent.replace('//', '').trim().toUpperCase();

                    if (selectedCategory === 'ALL POSTS' || categoryText.includes(selectedCategory) || selectedCategory.includes(categoryText)) {
                        card.style.display = 'flex';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    } else {
                        card.style.display = 'none';
                        card.style.opacity = '0';
                    }
                });
            });
        });
    }

    /* ==========================================================================
       3. Free AJAX Form Submission & reCAPTCHA Validation
       ========================================================================== */
    const consultationForms = document.querySelectorAll('.consultation-form');

    consultationForms.forEach((form) => {
        let statusMessage = form.querySelector('.form-status-msg');
        if (!statusMessage) {
            statusMessage = document.createElement('div');
            statusMessage.className = 'form-status-msg';
            statusMessage.style.cssText = 'display:none; margin-bottom: 1rem; padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.88rem; font-weight: 500; text-align: center;';
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                form.insertBefore(statusMessage, submitBtn);
            } else {
                form.appendChild(statusMessage);
            }
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Hide any existing error or pending state messages
            statusMessage.style.display = 'none';

            // 1. Verify Google reCAPTCHA completion
            let recaptchaResponse = '';
            if (typeof grecaptcha !== 'undefined') {
                recaptchaResponse = grecaptcha.getResponse();
            }

            if (!recaptchaResponse || recaptchaResponse.trim() === '') {
                statusMessage.style.display = 'block';
                statusMessage.style.background = 'rgba(255, 59, 48, 0.15)';
                statusMessage.style.border = '1px solid rgba(255, 59, 48, 0.4)';
                statusMessage.style.color = '#ff453a';
                statusMessage.textContent = '⚠️ Please complete the reCAPTCHA verification before submitting.';
                return;
            }

            // 2. Display active sending state
            statusMessage.style.display = 'block';
            statusMessage.style.background = 'rgba(0, 113, 227, 0.15)';
            statusMessage.style.border = '1px solid rgba(100, 210, 255, 0.3)';
            statusMessage.style.color = '#64d2ff';
            statusMessage.textContent = '⏳ Sending message...';

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            // 3. Post data to Formspree asynchronously via AJAX
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const isSubfolder = window.location.pathname.includes('/about/') || 
                                        window.location.pathname.includes('/my-work/') || 
                                        window.location.pathname.includes('/socials/') || 
                                        window.location.pathname.includes('/contact/');
                    
                    const redirectUrl = isSubfolder ? '../thanks.html' : './thanks.html';
                    window.location.href = redirectUrl;
                } else {
                    const data = await response.json();
                    statusMessage.style.background = 'rgba(255, 59, 48, 0.15)';
                    statusMessage.style.border = '1px solid rgba(255, 59, 48, 0.4)';
                    statusMessage.style.color = '#ff453a';
                    
                    if (Object.hasOwn(data, 'errors')) {
                        statusMessage.textContent = '⚠️ ' + data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        statusMessage.textContent = '⚠️ Oops! There was a problem submitting your form. Please try again.';
                    }
                    if (submitBtn) submitBtn.disabled = false;
                }
            } catch (error) {
                statusMessage.style.background = 'rgba(255, 59, 48, 0.15)';
                statusMessage.style.border = '1px solid rgba(255, 59, 48, 0.4)';
                statusMessage.style.color = '#ff453a';
                statusMessage.textContent = '⚠️ Network error. Please check your internet connection and try again.';
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    });

});