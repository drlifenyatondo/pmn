const apiKey = "AIzaSyAvhwgF2GdFz2mS3i0L7bUpyope-GBuPo4"; 

// --- AI Service ---
async function callGemini(prompt, systemInstruction) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Connection error. Please try again.";
    } catch (e) {
        return "I'm having trouble connecting. Check your internet.";
    }
}

// --- Advocacy Tools ---
async function generateAdvocacy() {
    const input = document.getElementById('challengeInput').value;
    const resultDiv = document.getElementById('advocacyResult');
    const btn = document.getElementById('genBtn');
    if (!input.trim()) return;

    btn.disabled = true;
    btn.innerHTML = '✨ Drafting your pitch...';
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = '<div class="ai-loading">Generating professional advocacy draft...</div>';

    const system = "You are an expert Advocacy Assistant. Draft a professional, persuasive pitch under 300 words using bullet points.";
    const response = await callGemini(`Challenge: ${input}`, system);
    
    resultDiv.innerHTML = response;
    btn.disabled = false;
    btn.innerHTML = 'Generate Advocacy Draft ✨';
}

// --- Global Share Function ---
async function sharePortfolio() {
    const shareData = {
        title: 'Purity Nyatondo Portfolio',
        text: 'Check out the global youth advocacy journey of Purity Nyatondo.',
        url: window.location.href
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(shareData.url)}`, '_blank');
        }
    } catch (err) {
        navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
    }
}

// --- Navigation & UI Logic ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Logic (Fixed to check both potential button IDs)
    const menuBtn = document.getElementById('menu-btn') || document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('hidden');
        });

        // Close when a link is clicked
        const mobileLinks = menu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => menu.classList.add('hidden'));
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
                menu.classList.add('hidden');
            }
        });
    }

    // 2. Scroll Logic (Back to Top)
    const scrollContainer = document.getElementById('post-stream');
    const topBtn = document.getElementById('backToTop');

    if (scrollContainer && topBtn) {
        scrollContainer.addEventListener('scroll', () => {
            if (scrollContainer.scrollTop > 300) {
                topBtn.style.display = "flex";
            } else {
                topBtn.style.display = "none";
            }
        });

        topBtn.addEventListener('click', () => {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
