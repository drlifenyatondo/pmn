/* ==========================================================================
   Global Application Logic & AJAX Form Handling
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

    /* ----------------------------------------------------------------------
       2. AJAX Formspree Handler with reCAPTCHA v2 Validation & Free Redirect
       ---------------------------------------------------------------------- */
    const forms = document.querySelectorAll('.consultation-form');

    forms.forEach(form => {
        // Create an inline error alert element inside each form
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-msg';
        errorDiv.style.cssText = 'color: #ff6b6b; font-size: 0.9rem; margin-bottom: 1rem; display: none; font-weight: 500;';
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            form.insertBefore(errorDiv, submitBtn);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';

            // 1. Verify reCAPTCHA Completion
            if (typeof grecaptcha !== 'undefined') {
                const captchaResponse = grecaptcha.getResponse();
                if (!captchaResponse || captchaResponse.length === 0) {
                    errorDiv.textContent = '⚠️ Please complete the reCAPTCHA verification before submitting.';
                    errorDiv.style.display = 'block';
                    return;
                }
            }

            // 2. Prepare Form Data
            const formData = new FormData(form);
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Sending...';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';
            }

            // 3. Send AJAX Request to Formspree
            try {
                const response = await fetch(form.action, {
                    method: form.method || 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Determine redirect path relative to current page location
                    const redirectUrl = window.location.pathname.includes('/contact/') ? '../thanks.html' : './thanks.html';
                    window.location.href = redirectUrl;
                } else {
                    const data = await response.json();
                    if (data.hasOwnProperty('errors')) {
                        errorDiv.textContent = data["errors"].map(err => err["message"]).join(", ");
                    } else {
                        errorDiv.textContent = '⚠️ An error occurred while sending your message. Please try again.';
                    }
                    errorDiv.style.display = 'block';
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                }
            } catch (err) {
                errorDiv.textContent = '⚠️ Network error. Please check your connection and try again.';
                errorDiv.style.display = 'block';
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    });
});