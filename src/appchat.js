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

// 3. Fungsi Render Tampilan Chat (PERBAIKAN: HILANGKAN WHILE LOOP)
export function renderChatUI(history) {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return; 

    // --- HAPUS KODE WHILE LOOP DI SINI ---
    // Kita TIDAK menggunakan "while (chatBox.firstChild)" di sini
    // karena itu menyebabkan infinite loop / rekursi.
    // Pembersihan visual dilakukan di index.html saat tombol klik (toggleChat).
    
    // Bersihkan HTML (Cukup ini saja untuk render ulang)
    chatBox.innerHTML = '';

    // --- JANGAN RENDER APA-APA JIKA USER INGIN KOSONG ---
    if (history.length === 0) {
        chatBox.innerHTML = '<div style="text-align: center; color: #999; margin-top: 20px;">Mulai percakapan...</div>';
        return; // <--- PENTING: STOP DI SINI AGAR TIDAK MENAMBAH HTML LAIN
    }

    // Loop history dan tampilkan
    history.forEach(chat => {
        // Style Bubble User (Kanan)
        const bubbleUser = `
            <div style="background: #e0e0e0; padding: 10px; border-radius: 12px; margin-bottom: 5px; display: inline-block; max-width: 80%; float: right; clear: both;">
                <div style="font-weight: bold; font-size: 0.8rem; color: #666;">Anda:</div>
                <div style="font-size: 0.95rem;">${chat.question}</div>
            </div>
        `;

        // Style Bubble AI (Kiri)
        const bubbleAI = `
            <div style="background: #E8F5E9; padding: 10px; border-radius: 12px; margin-bottom: 15px; display: inline-block; max-width: 80%; float: right; clear: both;">
                <div style="font-weight: bold; font-size: 0.8rem; color: #2E7D32;">AgriAI:</div>
                <div style="font-size: 0.95rem;">${chat.answer}</div>
                <div style="font-size: 0.7rem; color: #999; margin-top: 4px;">${chat.tanya}</div>
            </div>
        `;
        
        // Append HTML
        chatBox.innerHTML += bubbleUser + bubbleAI;
    });

    // Scroll otomatis ke paling bawah
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 4. Logika Utama Chat (FUNGSI NGOBROL)
export function handleChat(question, category) {
    let history = getChatHistory();

    // --- LOGIKA AI (KATA KUNCI) ---
    let aiJawaban = "Mohon maaf, AgriAI sedang belajar tentang ini.";
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('kuning') || lowerQ.includes('layu')) {
        aiJawaban = "Tanaman Anda kemungkinan kekurangan Nitrogen.";
    } else if (lowerQ.includes('pupuk')) {
        aiJawaban = "Gunakan pupuk NPK berimbang.";
    } else if (lowerQ.includes('hama') || lowerQ.includes('ulat')) {
        aiJawaban = "Silakan gunakan pestisida nabati.";
    } else if (category === "Harga") {
        aiJawaban = "Cek fitur Info Harga Pasar di AgriChain.";
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

    // Masukkan chat baru ke Paling Depan
    history.push(newChat); // Paling Baru

    // Batasi history maksimal 10 chat
    if (history.length > 10) {
        history.shift(); // Hapus chat paling lama
    }

    // Simpan ke LocalStorage
    saveChatHistory(history);

    // Render tampilan chat
    renderChatUI(history);
}

// 5. Fungsi Hapus History (HAPUS RIWAYAT)
export function clearChatHistory() {
    // Hapus data dari LocalStorage
    localStorage.removeItem(STORAGE_KEY);
    
    // Hapus Visual Layar (Render Array Kosong)
    renderChatUI([]); 
}

// 6. Fungsi Hapus UI Saja
export function clearChatUI() {
    const chatBox = document.getElementById('chatBox');
    if(chatBox) {
        chatBox.innerHTML = '<div style="text-align: center; color: #999; margin-top: 20px;">Mulai percakapan...</div>';
    }
}
