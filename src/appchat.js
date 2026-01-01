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

// 3. Fungsi Render Tampilan Chat
export function renderChatUI(history) {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return; 

    // Bersihkan HTML (Hapus sisa visual)
    chatBox.innerHTML = '';

    // Jika history kosong, tampilkan pesan default
    if (history.length === 0) {
        chatBox.innerHTML = '<div style="text-align: center; color: #999; margin-top: 20px;">Mulai percakapan...</div>';
        return;
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
        chatBox.innerHTML += bubbleUser + bubbleAI;
    });

    // Scroll ke paling bawah
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 4. Logika Utama Chat (SUPER PINTAR)
export function handleChat(question, category) {
    let history = getChatHistory();

    // --- LOGIKA AI (ENGINE KATA KUNCI) ---
    let aiJawaban = "Mohon maaf, AgriAI sedang belajar tentang ini. Coba kata kunci lain.";
    
    // Konversi ke huruf kecil agar mudah dibaca
    const lowerQ = question.toLowerCase();

    // --- A. ANALISA PENGGUNA ---
    if (lowerQ.includes('siapa') && lowerQ.includes('kamu')) {
        aiJawaban = "Saya AgriAI, asisten pintar petani digital. Saya dibuat untuk membantu Anda dalam analisa harga, cuaca, dan hama.";
    } 
    else if (lowerQ.includes('petani') || lowerQ.includes('tani')) {
        aiJawaban = "Sepertinya Anda adalah seorang Petani yang hebat! Silakan tanya saya tentang hama, pupuk, atau harga panen.";
    }
    else if (lowerQ.includes('pembeli')) {
        aiJawaban = "Halo Pembeli! Saya bisa bantu Anda melihat rata-rata harga pasaran saat ini.";
    }
    
    // --- B. ANALISA HARGA ---
    else if (lowerQ.includes('harga') || lowerQ.includes('pasar')) {
        if (lowerQ.includes('padi')) {
            aiJawaban = "📊 Analisa Harga Padi: Saat ini rata-rata harga padi di pasar nasional berada di kisaran Rp 5.500 - Rp 6.500 per kg. Ada tren kenaikan 5% dari minggu lalu. Saran: Jual sekarang.";
        } else if (lowerQ.includes('jagung')) {
            aiJawaban = "📊 Analisa Harga Jagung: Harga jagung stabil di Rp 4.000 per kg. Permintaan sedang naik, waktu yang bagus untuk menjual.";
        } else if (lowerQ.includes('kopi')) {
            aiJawaban = "📊 Analisa Harga Kopi: Harga kopi Arabika mencapai Rp 40.000 - Rp 60.000 per kg (tergantung kualitas). Saat ini lagi musim panen.";
        } else if (lowerQ.includes('cabai')) {
            aiJawaban = "📊 Analisa Harga Cabai Rawit: Harga mengalami penurunan menjadi Rp 18.000 per kg. Disarankan untuk simpan stok sementara.";
        } else {
            aiJawaban = "📊 Analisa Pasar: Untuk harga yang lebih spesifik, sebutkan nama komoditinya (misal: Padi, Jagung, Cabai).";
        }
    }

    // --- C. ANALISA CUACA ---
    else if (lowerQ.includes('cuaca') || lowerQ.includes('hujan') || lowerQ.includes('panas')) {
        const acakCuaca = Math.random() > 0.5 ? "Cerah" : "Berawan";
        if (lowerQ.includes('hujan')) aiJawaban = "🌦️ Analisa Cuaca: Prakiraan menunjukkan potensi hujan ringan hingga sedang di sebagian wilayah. Pastikan drainase lahan lancar.";
        else if (lowerQ.includes('panas')) aiJawaban = "☀️ Analisa Cuaca: Suhu udara cukup tinggi (31-33°C). Pantau kondisi tanaman agar tidak kekeringan.";
        else aiJawaban = `🌦️ Analisa Cuaca: Hari ini diprediksi ${acakCuaca}. Suhu rata-rata 28°C. Kondisi cukup baik untuk pertumbuhan vegetatif.`;
    }

    // --- D. ANALISA HAMA (DEEP LEARNING SEDERHANA) ---
    else if (lowerQ.includes('hama')) {
        if (lowerQ.includes('ulat')) {
            aiJawaban = "🐛️ Analisa Hama: Ini kemungkinan Ulat Grayak (Spodoptera litura). Solusi: Gunakan Pestisida Emas, Bt, atau B. Kuras gulud tanaman yang terserang.";
        } else if (lowerQ.includes('kuning') || lowerQ.includes('layu')) {
            aiJawaban = "🍃 Analisa Tanaman: Gejala daun menguning (Klorosis) menunjukkan **Kekurangan Nitrogen**. Solusi: Berikan pupuk Urea atau ZA (100kg/ha).";
        } else if (lowerQ.includes('coklat') || lowerQ.includes('bercak')) {
            aiJawaban = "🍫 Analisa Hama: Gejala bercak-bercak bisa karena kurap (Pestisida) atau cendawan. Cek bagian bawah daun. Jika ada jamur putih, semprotkan Fungisida.";
        } else if (lowerQ.includes('putus') || lowerQ.includes('gulung')) {
            aiJawaban = "🍂 Analisa Hama: Bisa karena busuk jamur (Anthracnose) atau bakteri. Semprotkan Fungisida berbahan aktif (Mankozeb atau Benomyl).";
        } else {
            aiJawaban = "🐛️ Analisa Hama: Silakan sebutkan gejala (misal: daun kuning, bercak, ulat) atau jenis hama agar saya bisa berikan solusi yang tepat.";
        }
    }

    // --- E. ANALISA PUPUK ---
    else if (lowerQ.includes('pupuk')) {
        if (lowerQ.includes('natrium')) {
            aiJawaban = "⚗️ Analisa Pupuk: Natrium (Urea) sangat baik untuk pertumbuhan vegetatif (daun/tinggi batang). Berikan saat tanaman fase vegetatif.";
        } else if (lowerQ.includes('kali')) {
            aiJawaban = "⚗️ Analisa Pupuk: Kalium (KCL/K2SO4) memperkuat sistem akar dan meningkatkan kualitas buah. Berikan saat masa pembentukan buah.";
        } else if (lowerQ.includes('fosfat')) {
            aiJawaban = "⚗️ Analisa Pupuk: Fosfat (TSP/SP36) mempercepat pembungaan akar dan pertumbuhan awal. Berikan saat tanam/benih.";
        } else if (lowerQ.includes('npk')) {
            aiJawaban = "⚗️ Analisa Pupuk: Pupuk NPK Makmur (16-16-16) adalah solusi terbaik untuk tanah yang kurang subur.";
        } else {
            aiJawaban = "⚗️ Analisa Pupuk: Untuk pemupukan dasar gunakan NPK. Untuk hasil maksimal, tambahkan Pupuk KCL saat pembungaan buah.";
        }
    }

    // --- F. ANALISA LOKASI & LAIN LAIN ---
    else if (lowerQ.includes('lokasi') || lowerQ.includes('dimana')) {
        aiJawaban = "📍 Analisa Lokasi: AgriChain melayani petani di seluruh Indonesia (Jawa, Sumatera, Kalimantan, Sulawesi, Papua). Silakan cek menu Pasar untuk panen terdekat.";
    }
    else if (lowerQ.includes('salam') || lowerQ.includes('halo')) {
        aiJawaban = "Halo! Ada yang bisa saya bantu seputar pertanian Anda hari ini?";
    }
    else {
        // Default: Catat keluhan
        aiJawaban = `Saya mencatat analisa Anda: "${question}".`;
    }

    // --- SIMPAN HISTORY ---
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

    // Masukkan chat baru ke Paling Bawah (Push)
    history.push(newChat);

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
    localStorage.removeItem(STORAGE_KEY);
    renderChatUI([]); 
}

// 6. Fungsi Hapus UI Saja
export function clearChatUI() {
    const chatBox = document.getElementById('chatBox');
    if(chatBox) {
        chatBox.innerHTML = '<div style="text-align: center; color: #999; margin-top: 20px;">Mulai percakapan...</div>';
    }
}
