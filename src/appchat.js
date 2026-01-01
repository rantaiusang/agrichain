const STORAGE_KEY = 'agrichain_chat_history';

export function getChatHistory() {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
}

export function saveChatHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function renderChatUI(history) {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return; // Penting: Cek elemen ada
    
    chatBox.innerHTML = ''; // Bersihkan chat sebelum render ulang
    history.forEach(chat => {
        chatBox.innerHTML += `
            <div class="chat-bubble user">${chat.question}</div>
            <div class="chat-bubble ai">${chat.answer}</div>
        `;
    });
}

export function handleChat(question, category) {
    let history = getChatHistory();
    
    // --- LOGIKA AI (SIMULASI) ---
    let aiJawaban = "Mohon maaf, AI AgriChain sedang dipelajari.";
    const lowerQ = question.toLowerCase();

    // Logika Jawaban Sederhana
    if (lowerQ.includes('kuning') || lowerQ.includes('layu')) {
        aiJawaban = "Tanaman Anda kemungkinan kekurangan Nitrogen. Gunakan pupuk Urea atau ZA.";
    } else if (lowerQ.includes('pupuk')) {
        aiJawaban = "Gunakan pupuk NPK berimbang untuk hasil maksimal.";
    } else if (lowerQ.includes('hama') || lowerQ.includes('ulat')) {
        aiJawaban = "Silakan segera gunakan pestisida nabati atau konsultasikan penyuluh.";
    } else if (lowerQ.includes('harga')) {
        aiJawaban = "Saran: Cek fitur 'Info Harga' di menu untuk harga pasar terkini.";
    } else {
        aiJawaban = `Terima kasih. Kami mencatat keluhan "${question}" ke sistem.`;
    }

    // --- SIMPAN HISTORY ---
    history.unshift({
        id: Date.now(),
        question: question,
        answer: aiJawaban,
        category: category || "Umum"
    });

    if (history.length > 10) {
        history.shift(); // Hapus chat paling lama jika lebih dari 10
    }

    saveChatHistory(history);

    // --- RENDER TAMPILAN ---
    renderChatUI(history);
}
