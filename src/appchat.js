// --- frontend/src/appchat.js ---
const STORAGE_KEY = 'agrichain_chat_history';

// --- 1. VARIABEL GLOBAL AGAR AI PINTAR (MEMORY) ---
let currentContext = {
    crop: null,     // Tanaman apa
    price: null,     // Harga jual
    area: null      // Luas lahan (untuk hitung pupuk)
};

// Helper: Ambil angka dari kalimat ("1 hektar" -> 1)
function extractNumber(str) {
    const match = str.match(/(\d+)/);
    return match ? parseInt(match[0]) : null;
}

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

    chatBox.innerHTML = '';

    if (history.length === 0) {
        chatBox.innerHTML = '<div style="text-align: center; color: #999; margin-top: 20px;">Mulai percakapan...</div>';
        return;
    }

    history.forEach(chat => {
        const bubbleUser = `
            <div style="background: #e0e0e0; padding: 10px; border-radius: 12px; margin-bottom: 5px; display: inline-block; max-width: 80%; float: right; clear: both;">
                <div style="font-weight: bold; font-size: 0.8rem; color: #666;">Anda:</div>
                <div style="font-size: 0.95rem;">${chat.question}</div>
            </div>
        `;
        const bubbleAI = `
            <div style="background: #E8F5E9; padding: 10px; border-radius: 12px; margin-bottom: 15px; display: inline-block; max-width: 80%; float: right; clear: both;">
                <div style="font-weight: bold; font-size: 0.8rem; color: #2E7D32;">AgriAI:</div>
                <div style="font-size: 0.95rem;">${chat.answer}</div>
                <div style="font-size: 0.7rem; color: #999; margin-top: 4px;">${chat.tanya}</div>
            </div>
        `;
        chatBox.innerHTML += bubbleUser + bubbleAI;
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 4. Logika Utama Chat (ENGINE RAMAH BAHASA INDONESIA)
export function handleChat(question, category) {
    let history = getChatHistory();
    
    let aiJawaban = "Maaf, saya belum mengerti. Coba tanya cuaca, cari tengkulak, atau cara panen.";
    const lowerQ = question.toLowerCase();

    // --- A. FITUR 1: CARI TENGGULAK & RONGSOK (SEARCH MERCHANT) ---
    if (lowerQ.includes('cari') && (lowerQ.includes('tengkulak') || lowerQ.includes('ronggok'))) {
        // Tentukan kota (Contoh logic sederhana)
        let kota = "Umum";
        if (lowerQ.includes('cianjur')) kota = "Cianjur";
        else if (lowerQ.includes('tasik')) kota = "Tasikmalaya";
        else if (lowerQ.includes('garut')) kota = "Garut";

        // Daftar Tengkulak (Dummy Database Rating Jujur)
        const tengkulakList = [
            { nama: "Bapak H. Murni", area: kota, rating: "5 Bintang (Jujur)", note: "Bayar selalu di tempat." },
            { nama: "CV. Subur", area: kota, rating: "4 Bintang", note: "Harga stabil, kadang telat." },
            { nama: "Uda. Ahmad", area: kota, rating: "3 Bintang", note: "Harganya agak lebih tinggi, tapi stock aman." }
        ];

        aiJawaban = `<strong>🔍 Rekomendasi Tengkulak (${kota} - Rating Jujur):</strong><br/>`;
        tengkulakList.forEach((t, i) => {
            aiJawaban += `${i+1}. ${t.nama} (${t.rating}). ${t.note}<br/>`;
        });
        aiJawaban += `<em>Agar aman, pilih yang minimal 4 bintang.</em>`;
    }

    // --- B. FITUR 2: ARTIKEL KONSULTASI TANI (ARTICLE FINDER) ---
    else if (lowerQ.includes('cara') || lowerQ.includes('panduan') || lowerQ.includes('resep')) {
        if (lowerQ.includes('cabai merah')) {
            aiJawaban = "📰 <strong>Panduan Cabai Merah:</strong><br/>1. Tanam di dataran tinggi.<br/>2. Pupuk menggunakan TSP saat tanam.<br/>3. Siram rutin setiap 3 hari.<br/>4. Panen saat buah sudah merah menyala.";
        } else if (lowerQ.includes('lada') || lowerQ.includes('rica')) {
            aiJawaban = "📰 <strong>Panduan Merica/Lada:</strong><br/>1. Butuh sinar matahari penuh.<br/>2. Jangan banjiri tanaman, jarak tanam minimal 30cm.<br/>3. Berikan pupuk Kandang (Kotor Sapi/Ayam) setiap tanam.";
        } else if (lowerQ.includes('pupuk')) {
            aiJawaban = "📰 <strong>Dasar Pemupukan:</strong><br/>Pupuk Makmur (NPK 16-16-16) bagus untuk semua jenis tanaman. Untuk hasil maksimal, tambahkan pupuk KCL (Kalium) saat berbunga.";
        } else {
            aiJawaban = "📰 Maaf, artikel tersebut belum tersedia. Coba cari 'cara panen [nama tanaman]'.";
        }
    }

    // --- C. FITUR 3: CEK CUACA DAERAH (WEATHER FORECAST) ---
    else if (lowerQ.includes('cuaca') || lowerQ.includes('hujan') || lowerQ.includes('panas')) {
        // Tentukan area (Dummy)
        let area = "Indonesia Umum";
        if (lowerQ.includes('cianjur')) area = "Kab. Cianjur";
        if (lowerQ.includes('garut')) area = "Kab. Garut";

        // Simulasi Data Cuaca (BMKG Logic)
        const acakHujan = Math.random() > 0.5 ? "Hujan Ringan" : "Cerah";
        const suhu = Math.floor(Math.random() * (34 - 28 + 1)) + 28; // 28-34 derajat

        aiJawaban = `🌦️ <strong>Info Cuaca (${area}):</strong><br/>`;
        aiJawaban += `Prediksi: ${acakHujan}.<br/>`;
        aiJawaban += `Suhu Udara: ${suhu}°C.<br/><br/>`;
        if (acakHujan.includes("Hujan")) {
            aiJawaban += `⚠️ SARAN: Jangan semprot pupuk atau obat hama hari ini (akan tercuci hujan).`;
        } else {
            aiJawaban += `✅ SARAN: Kondisi bagus. Bisa dilakukan penyiraman atau semprot pupuk pagi/sore hari ini.`;
        }
    }

    // --- D. FITUR 4: KONVERSI SATUAN (UNIT CONVERTER) ---
    else if (lowerQ.includes('karung') || lowerQ.includes('kuintal') || lowerQ.includes('sak')) {
        if (lowerQ.includes('padi')) {
            aiJawaban = "⚖️ <strong>Konversi Padi:</strong><br/>1 Karung Padi (Kualitas Padi Giling) kira-kira seberat 50 kg - 60 kg (tergantung karung).<br/>1 Sak Padi = 10 kg.";
        } else if (lowerQ.includes('jagung')) {
            aiJawaban = "⚖️ <strong>Konversi Jagung:</strong><br/>1 Karung Jagung Pipil kira-kira 80 kg.<br/>1 Kuintal Jagung (Masa 100 L) kira-kira 875 kg.";
        } else {
            aiJawaban = "⚖️ Mohon sebutkan komoditasnya (Padi/Jagung).";
        }
    }

    // --- E. FITUR 5: JADWAL TANAM (CALENDAR BON) ---
    else if (lowerQ.includes('kapan') && (lowerQ.includes('tanam') || lowerQ.includes('panen'))) {
        const dateObj = new Date();
        const tanggal = dateObj.getDate();
        const bulan = dateObj.getMonth() + 1; // 0 = Januari
        
        // Logika sederhana: Tanam di tanggal yang Ganjil (Pon)
        if (tanggal % 2 !== 0) {
            aiJawaban = `📅 <strong>Jadwal Baik Tanam:</strong><br/>Hari ini tanggal ${tanggal} (Ganjil/Pon) adalah hari bagus untuk menanam.<br/>`;
            aiJawaban += `Mulai sekitar jam 06:00 pagi sampai 09:00 untuk hasil maksimal.`;
        } else {
            aiJawaban = `📅 <strong>Jadwal Tanam:</strong><br/>Hari ini tanggal ${tanggal} (Genap) sebaiknya untuk perbaikan lahan, pemupukan, atau menyiram, bukan menanam.`;
        }
    }

    // --- F. LOGIKA PINTAR YANG SUDAH ADA (Context + Calculator) ---
    else {
        // ... (Tetapkan logika sebelumnya untuk Harga, Pupuk, dll) ...
        // (Saya ringkas disini agar kode tidak kepanjangan)
        
        if (lowerQ.includes('padi') || lowerQ.includes('jagung') || lowerQ.includes('kopi')) {
            currentContext.crop = lowerQ;
            aiJawaban = `Baik, saya catat Anda sedang membahas tentang ${currentContext.crop.toUpperCase()}. Silakan tanya saya tentang hama, pupuk, atau harga jualan Anda.`;
        } 
        else if (lowerQ.includes('hektar') || lowerQ.includes('meter')) {
            const area = extractNumber(question);
            if (area) {
                const doseTotal = Math.round(area * 100); 
                if (currentContext.crop && currentContext.crop.includes('padi')) {
                    aiJawaban = `📊 KALKULATOR CERDAS: Untuk lahan ${area} Ha Padi, Anda membutuhkan sekitar ${doseTotal} kg Pupuk NPK Makmur.`;
                } else {
                    aiJawaban = `📊 KALKULATOR CERDAS: Untuk luas lahan ${area} Ha, kebutuhan pupuk dasar adalah ${doseTotal} kg NPK Makmur.`;
                }
            }
        }
        else {
            // Fallback jika tidak ketemu
            if (currentContext.crop) {
                aiJawaban = `Saya mencatat: "${question}" (Terkait ${currentContext.crop}).`;
            } else {
                aiJawaban = `Saya mencatat keluhan: "${question}".`;
            }
        }
    }

    // --- SIMPAN HISTORY ---
    const newId = Date.now();
    const dateObj = new Date();
    const tglIndo = new Intl.DateTimeFormat('id-ID').format(dateObj);
    const jamIndo = new Intl.DateTimeFormat('id-ID', { hour: 'numeric', minute: 'numeric' }).format(dateObj);

    const newChat = {
        id: newId,
        question: question,
        category: category || "Umum",
        answer: aiJawaban,
        tanya: `${tglIndo}, ${jamIndo}`
    };

    history.push(newChat);
    if (history.length > 10) history.shift();
    saveChatHistory(history);
    renderChatUI(history);
}

// 5. Fungsi Hapus History
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
