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

// 3. Fungsi Render Tampilan Chat (Lengkap)
export function renderChatUI(history) {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return; // Jika elemen tidak ada, stop.

    // Bersihkan chat lama
    chatBox.innerHTML = '';

    // Loop history dan tampilkan
    history.forEach(chat => {
        // Style Bubble User (Abu-abu)
        const bubbleUser = `
            <div style="background: #e0e0e0; padding: 10px; border-radius: 12px; margin-bottom: 5px; display: inline-block; max-width: 80%; align-self: flex-end; margin-left: auto; border-bottom-left-radius: 2px; border-bottom-right-radius: 12px; border-top-left-radius: 12px; border-top-right-radius: 12px;">
                <div style="font-weight: bold; font-size: 0.8rem; color: #666;">Anda:</div>
                <div style="font-size: 0.95rem;">${chat.question}</div>
            </div>
        `;

        // Style Bubble AI (Hijau)
        const bubbleAI = `
            <div style="background: #E8F5E9; padding: 10px; border-radius: 12px; margin-bottom: 15px; display: inline-block; max-width: 80%; float: right; clear: both; border-bottom-left-radius: 12px; border-bottom-right-radius: 2px; border-top-left-radius: 12px; border-top-right-radius: 12px;">
                <div style="font-weight: bold; font-size: 0.8rem; color: #2E7D32;">AgriAI:</div>
                <div style="font-size: 0.95rem;">${chat.answer}</div>
                <div style="font-size: 0.7rem; color: #999; margin-top: 4px;">${chat.tanya}</div>
            </div>
        `;
        chatBox.innerHTML += bubbleUser + bubbleAI;
    });

    // Scroll ke paling bawah
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 4. Fungsi Utama Chat (FUNGSI NGOBROL)
export function handleChat(question, category) {
    let history = getChatHistory();

    // --- LOGIKA AI (KATA KUNCI) ---
    let aiJawaban = "Mohon maaf, AgriAI sedang belajar tentang ini.";
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('kuning') || lowerQ.includes('layu')) {
        aiJawaban = "Tanaman Anda kemungkinan kekurangan Nitrogen. Disarankan gunakan pupuk Urea atau ZA.";
    } else if (lowerQ.includes('pupuk')) {
        aiJawaban = "Untuk hasil terbaik, gunakan pupuk NPK berimbang.";
    } else if (lowerQ.includes('hama') || lowerQ.includes('ulat')) {
        aiJawaban = "Silakan segera gunakan pestisida nabati atau konsultasikan ke penyuluh.";
    } else if (category === "Harga") {
        aiJawaban = "Saran: Cek fitur 'Info Harga' di menu AgriChain untuk harga pasar terkini.";
    } else {
        aiJawaban = `Saya mencatat keluhan: "${question}".`;
    }

    // --- SIMPAN HISTORY KE LOCALSTORAGE ---
    const newId = Date.now();
    const dateObj = new Date();
    
    // Format tanggal Indonesia
    const tglIndo = new Intl.DateTimeFormat('id-ID').format(dateObj);
    const jamIndo = new Intl.DateTimeFormat('id-ID', { hour: 'numeric', minute: 'numeric' }).format(dateObj);

    const newChat = {
        id: newId,
        question,
        category: category || "Umum",
        answer: aiJawaban,
        tanya: `${tglIndo}, ${jamIndo}`
    };

    // Masukkan chat baru ke Paling Depan (Array Unshift)
    history.unshift(newChat);

    // Batasi history maksimal 10 chat
    if (history.length > 10) {
        history.shift(); // Hapus chat paling lama
    }

    // Simpan ke LocalStorage
    saveChatHistory(history);

    // Render tampilan chat (Update UI Layar)
    renderChatUI(history);
}

// 5. FUNGSI BERSIHKAN HISTORY (HAPUS RIWAYAT) - BARU
export function clearChatHistory() {
    // Hapus data dari LocalStorage
    localStorage.removeItem(STORAGE_KEY);
    
    // Bersihkan Layar Chat (Render Array Kosong)
    renderChatUI([]);
}

// 6. FUNGSI HAPUS UI SAJA (Tidak Hapus dari Storage)
export function clearChatUI() {
    const chatBox = document.getElementById('chatBox');
    if(chatBox) {
        chatBox.innerHTML = '<div style="text-align: center; color: #999; margin-top: 20px;">Mulai percakapan...</div>';
    }
}
