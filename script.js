const apiKey = "AIzaSyAvhwgF2GdFz2mS3i0L7bUpyope-GBuPo4"; 

async function callGemini(prompt, systemInstruction) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    let delay = 1000;
    for (let i = 0; i < 5; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            }
        } catch (e) {
            await new Promise(r => setTimeout(r, delay));
            delay *= 2;
        }
    }
    return "Sorry, I'm having trouble connecting right now.";
}

// --- AI Tools Logic ---
async function generateAdvocacy() {
    const input = document.getElementById('challengeInput').value;
    const resultDiv = document.getElementById('advocacyResult');
    const btn = document.getElementById('genBtn');
    if (!input.trim()) return;

    btn.disabled = true;
    btn.innerHTML = '✨ Drafting...';
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = '<div class="ai-loading">Drafting professional advocacy...</div>';

    const system = "You are an expert Advocacy Assistant. Draft a professional advocacy pitch under 300 words.";
    const response = await callGemini(`Challenge: ${input}`, system);
    resultDiv.innerHTML = response;
    btn.disabled = false;
    btn.innerHTML = 'Generate Advocacy Draft ✨';
}

async function askMentor() {
    const input = document.getElementById('mentorInput');
    const history = document.getElementById('chatHistory');
    const btn = document.getElementById('mentorBtn');
    const text = input.value;
    if (!text.trim()) return;

    const userMsg = document.createElement('div');
    userMsg.className = "bg-gray-100 p-3 rounded-lg text-right ml-8 mb-2";
    userMsg.textContent = text;
    history.appendChild(userMsg);
    input.value = "";

    const system = "You are an AI Mentor. Provide concise advice under 100 words.";
    const response = await callGemini(text, system);

    const aiMsg = document.createElement('div');
    aiMsg.className = "bg-blue-50 p-3 rounded-lg text-blue-800 italic mr-8 mb-2";
    aiMsg.innerHTML = `✨ ${response}`;
    history.appendChild(aiMsg);
    history.scrollTop = history.scrollHeight;
}

// --- Sharing ---
async function sharePortfolio() {
    const shareData = {
        title: 'Purity Nyatondo Portfolio',
        text: 'Check out Purity Mufarowashe Nyatondo\'s advocacy journey.',
        url: window.location.href
    };
    try {
        if (navigator.share) { await navigator.share(shareData); }
        else { window.open(`https://wa.me/?text=${encodeURIComponent(shareData.url)}`, '_blank'); }
    } catch (e) { alert('Link copied!'); }
}

// --- CORE NAVIGATION & UI LOGIC (Fixed) ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Logic
    // We check for both possible IDs to be safe
    const menuBtn = document.getElementById('menu-btn') || document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents immediate closing
            menu.classList.toggle('hidden');
        });

        // Close menu when clicking a link
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => menu.classList.add('hidden'));
        });

        // Close menu if clicking anywhere else on the screen
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
                menu.classList.add('hidden');
            }
        });
    }

    // 2. Social Hub Scroll Logic (Back to Top)
    const scrollContainer = document.getElementById('post-stream');
    const topBtn = document.getElementById('backToTop');

    if (scrollContainer && topBtn) {
        scrollContainer.addEventListener('scroll', () => {
            topBtn.style.display = scrollContainer.scrollTop > 300 ? 'flex' : 'none';
        });

        topBtn.addEventListener('click', () => {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
