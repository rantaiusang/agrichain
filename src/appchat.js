// --- frontend/src/appchat.js ---
const STORAGE_KEY = 'agrichain_chat_history';

// 1. Fungsi Ambil History
export function getChatHistory() {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
}

// 2. Fungsi Simpan History
export function saveChatHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

// 3. Fungsi Render Tampilan Chat (PERBAIKAN)
export function renderChatUI(history) {
    // Cari elemen chatBox
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return;

    // Bersihkan layar
    chatBox.innerHTML = '';

    // Loop history (Urutan 0 adalah terbaru, 9 adalah terlama)
    history.forEach(chat => {
        // --- STYLE BUBBLE USER (KANAN) ---
        const bubbleUser = `
            <div style="background: #e0e0e0; padding: 10px; border-radius: 12px 12px 2px 12px; display: inline-block; max-width: 80%; float: right; clear: both; margin-bottom: 5px; border: 1px solid #ccc;">
                <div style="font-weight: bold; font-size: 0.8rem; color: #666;">Anda:</div>
                <div style="font-size: 0.95rem;">${chat.question}</div>
                <div style="font-size: 0.7rem; color: #999; margin-top: 4px; text-align: right;">${chat.tanya}</div>
            </div>
        `;

        // --- STYLE BUBBLE AI (KIRI, BALASAN DI BAWAH) ---
        const bubbleAI = `
            <div style="background: #E8F5E9; padding: 10px; border-radius: 12px 2px 12px 12px 12px; display: inline-block; max-width: 80%; float: right; clear: both; margin-bottom: 15px; border: 1px solid #C8E6C9;">
                <div style="font-weight: bold; font-size: 0.8rem; color: #2E7D32;">AgriAI:</div>
                <div style="font-size: 0.95rem;">${chat.answer}</div>
            </div>
        `;

        // Gabungkan (User + AI)
        chatBox.innerHTML += bubbleUser + bubbleAI;
    });

    // Scroll otomatis ke paling bawah (Chat Terbaru)
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 4. Logika Utama Chat (FUNGSI HANDLER)
export function handleChat(question, category) {
    let history = getChatHistory();

    // --- LOGIKA AI (KATA KUNCI) ---
    let aiJawaban = "Mohon maaf, AgriAI sedang belajar tentang ini.";
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes("kuning") || lowerQ.includes("layu")) {
        aiJawaban = "Tanaman Anda kemungkinan kekurangan Nitrogen.";
    } else if (lowerQ.includes("pupuk")) {
        aiJawaban = "Gunakan pupuk NPK berimbang.";
    } else if (lowerQ.includes("hama") || lowerQ.includes("ulat")) {
        aiJawaban = "Gunakan pestisida nabati.";
    } else if (lowerQ.includes("harga")) {
        aiJawaban = "Cek fitur Info Harga Pasar di AgriChain.";
    } else {
        aiJawaban = `Saya mencatat keluhan: "${question}".`;
    }

    // --- SIMPAN HISTORY ---
    const newId = Date.now();
    const dateObj = new Date();
    
    // Format tanggal Indonesia
    const tglIndo = new Intl.DateTimeFormat('id-ID').format(dateObj);
    const jamIndo = new Intl.DateTimeFormat('id-ID', { hour: 'numeric', minute: 'numeric' }).format(dateObj);

    const newChat = {
        id: newId,
        question: question,
        category: category || "Umum",
        answer: aiJawaban,
        tanya: `${tglIndo}, ${jamIndo}`
    };

    // MASUKKAN CHAT BARU KE PUNGGIR (Array PUSH) BUKAN UNSHIFT
    // PUSH = Menambah ke Paling Bawah (Seperti WhatsApp)
    // Jika data di database 0 (terbaru), 1 (lama), dst.
    history.push(newChat);

    // Batasi history maksimal 10 chat
    if (history.length > 10) {
        // Hapus chat PALING LAMA (Index 0)
        history.shift(); 
    }

    // Simpan ke LocalStorage
    saveChatHistory(history);

    // Render tampilan chat
    renderChatUI(history);
}
