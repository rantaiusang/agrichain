const STORAGE_KEY = 'agrichain_chat_history';

function getChatHistory() {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
}

function saveChatHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function getAIResponse(question, kategori) {
    // Logic AI Sederhana
    let aiJawaban = "Mohon maaf, sistem AI kami sedang dipelajari.";
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes("kuning")) aiJawaban = "Tanaman Anda kemungkinan kekurangan Nitrogen.";
    if (lowerQ.includes("pupuk")) aiJawaban = "Gunakan pupuk NPK berimbang.";
    
    return aiJawaban;
}

function handleChat(question, kategori) {
    let history = getChatHistory();
    
    // Jawab AI
    const answer = getAIResponse(question, kategori);
    
    // Simpan
    const newId = Date.now();
    const dateObj = new Date();
    const tglIndo = dateObj.toLocaleDateString('id-ID');
    const jamIndo = dateObj.toLocaleTimeString('id-ID');
    
    history.unshift({
        id: newId,
        question,
        kategori,
        answer,
        tanya: `${tglIndo}, ${jamIndo}`
    });
    
    if (history.length > 10) history.shift(); // Batas 10
    
    saveChatHistory(history);
    renderChatUI(history);
}

function renderChatUI(history) {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return; // Jika elemen tidak ada, berhenti
    
    chatBox.innerHTML = '';
    history.forEach(chat => {
        const bubbleQ = `
            <div style="background: #e0e0e0; padding: 10px; border-radius: 10px 10px 0 0; display: inline-block; max-width: 80%; margin-bottom: 5px;">
                <strong>Anda:</strong> ${chat.question}
            </div>
        `;
        const bubbleA = `
            <div style="background: #E8F5E9; padding: 10px; border-radius: 10px 0 10px 10px; display: inline-block; max-width: 80%; float: right; clear: both;">
                <strong>AgriAI:</strong> ${chat.answer}
            </div>
            <div style="clear: both;"></div>
        `;
        chatBox.innerHTML += bubbleQ + bubbleA;
    });
}

export { handleChat, getChatHistory };
