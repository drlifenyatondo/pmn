const apiKey = "AIzaSyAvhwgF2GdFz2mS3i0L7bUpyope-GBuPo4"; // Handled by environment

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
    return "Sorry, I'm having trouble connecting right now. Please try again later.";
}

// --- Advocacy & Mentor Functions ---
async function generateAdvocacy() {
    const input = document.getElementById('challengeInput').value;
    const resultDiv = document.getElementById('advocacyResult');
    const btn = document.getElementById('genBtn');
    
    if (!input.trim()) return;

    btn.disabled = true;
    btn.innerHTML = '✨ Drafting your pitch...';
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = '<div class="ai-loading">Generating professional advocacy draft...</div>';

    const system = `You are an expert Advocacy Assistant on Purity Mufarowashe Nyatondo's portfolio. Draft a professional, persuasive advocacy pitch or letter addressed to local leaders. Focus on HIV and Mental Health integration. Keep it under 300 words.`;

    const response = await callGemini(`The user is facing this challenge: "${input}". Draft an advocacy pitch.`, system);
    
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
    userMsg.className = "bg-gray-100 p-3 rounded-lg text-right ml-8";
    userMsg.textContent = text;
    history.appendChild(userMsg);
    input.value = "";
    btn.disabled = true;

    const system = `You are Purity Mufarowashe Nyatondo's AI Mentor. Provide concise, actionable advice in a mentorship style. Keep responses under 100 words.`;
    const response = await callGemini(`The user asks: "${text}". Provide mentorship advice.`, system);

    const aiMsg = document.createElement('div');
    aiMsg.className = "bg-blue-50 p-3 rounded-lg text-blue-800 italic mr-8";
    aiMsg.innerHTML = `✨ ${response}`;
    history.appendChild(aiMsg);
    
    history.scrollTop = history.scrollHeight;
    btn.disabled = false;
}

// --- Sharing Function ---
async function sharePortfolio() {
    const shareData = {
        title: 'Purity Mufarowashe Nyatondo | Global Youth Leader',
        text: 'Check out the portfolio of Purity Mufarowashe Nyatondo, advocating for youth health and leadership.',
        url: window.location.href
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`;
            window.open(whatsappUrl, '_blank');
        }
    } catch (err) {
        navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
    }
}

// --- THE FIXES: WAIT FOR DOM TO LOAD ---
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Mobile Menu Logic (Fixed)
    const menuBtn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', function() {
            menu.classList.toggle('hidden');
        });

        const mobileLinks = menu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });
    }

    // 2. Back to Top Logic (Fixed - only runs if element exists)
    const scrollContainer = document.getElementById('post-stream');
    const topBtn = document.getElementById('backToTop');

    if (scrollContainer && topBtn) {
        scrollContainer.onscroll = function() {
            if (scrollContainer.scrollTop > 300) {
                topBtn.style.display = "flex";
            } else {
                topBtn.style.display = "none";
            }
        };

        topBtn.onclick = function() {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }
});
