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

// 1. Fungsi Ambil History (Local Storage)
export function getChatHistory() {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
}

// 2. Fungsi Simpan History (Local Storage)
function saveChatHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

// 3. Fungsi Render Tampilan Chat (PERBAIKAN UI)
export function renderChatUI(history) {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return; 

    chatBox.innerHTML = '';

    if (history.length === 0) {
        chatBox.innerHTML = '<div style="text-align: center; color: #999; margin-top: 20px; font-style: italic;">Halo Petani! Ada yang bisa saya bantu? (Coba tanya "Cari tengkulak Cianjur" atau "Cara tanam cabai")</div>';
        return;
    }

    history.forEach(chat => {
        // Bubble User (Kanan, Warna Abu/Abu Gelap)
        const bubbleUser = `
            <div style="display: flex; justify-content: flex-end; margin-bottom: 15px;">
                <div style="background: #dcf8c6; padding: 10px 15px; border-radius: 12px 12px 0 12px; max-width: 80%; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                    <div style="font-weight: bold; font-size: 0.8rem; color: #075e54; margin-bottom: 2px;">Anda:</div>
                    <div style="font-size: 0.95rem; color: #333;">${chat.question}</div>
                </div>
            </div>
        `;

        // Bubble AI (Kiri, Warna Hijau Muda)
        const bubbleAI = `
            <div style="display: flex; justify-content: flex-start; margin-bottom: 15px;">
                <div style="background: #ffffff; padding: 10px 15px; border-radius: 12px 12px 12px 0; max-width: 80%; border: 1px solid #e0e0e0; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                    <div style="font-weight: bold; font-size: 0.8rem; color: #2E7D32; margin-bottom: 4px;">AgriAI:</div>
                    <div style="font-size: 0.95rem; color: #333; line-height: 1.4;">${chat.answer}</div>
                    <div style="font-size: 0.7rem; color: #999; margin-top: 8px; text-align: right;">${chat.tanya}</div>
                </div>
            </div>
        `;
        
        chatBox.innerHTML += bubbleUser + bubbleAI;
    });
    
    // Auto scroll ke bawah
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 4. Logika Utama Chat (ENGINE RAMAH BAHASA INDONESIA)
export async function handleChat(question, category) {
    let history = getChatHistory();
    let aiJawaban = "Maaf, saya belum mengerti. Coba tanya cuaca, cari tengkulak, atau cara panen.";
    const lowerQ = question.toLowerCase();

    // --- A. FITUR 1: CARI TENGGULAK & RONGSOK (SEARCH MERCHANT) ---
    if (lowerQ.includes('cari') && (lowerQ.includes('tengkulak') || lowerQ.includes('ronggok') || lowerQ.includes('pembeli'))) {
        let kota = "Umum";
        if (lowerQ.includes('cianjur')) kota = "Cianjur";
        else if (lowerQ.includes('tasik')) kota = "Tasikmalaya";
        else if (lowerQ.includes('garut')) kota = "Garut";
        else if (lowerQ.includes('bandung')) kota = "Bandung";

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
    else if (lowerQ.includes('cara') || lowerQ.includes('panduan') || lowerQ.includes('resep') || lowerQ.includes('menanam')) {
        if (lowerQ.includes('cabai merah') || lowerQ.includes('cabe')) {
            aiJawaban = "📰 <strong>Panduan Cabai Merah:</strong><br/>1. Tanam di dataran tinggi.<br/>2. Pupuk menggunakan TSP saat tanam.<br/>3. Siram rutin setiap 3 hari.<br/>4. Panen saat buah sudah merah menyala.";
        } else if (lowerQ.includes('lada') || lowerQ.includes('rica') || lowerQ.includes('merica')) {
            aiJawaban = "📰 <strong>Panduan Merica/Lada:</strong><br/>1. Butuh sinar matahari penuh.<br/>2. Jangan banjiri tanaman, jarak tanam minimal 30cm.<br/>3. Berikan pupuk Kandang (Kotor Sapi/Ayam) setiap tanam.";
        } else if (lowerQ.includes('pupuk')) {
            aiJawaban = "📰 <strong>Dasar Pemupukan:</strong><br/>Pupuk Makmur (NPK 16-16-16) bagus untuk semua jenis tanaman. Untuk hasil maksimal, tambahkan pupuk KCL (Kalium) saat berbunga.";
        } else if (lowerQ.includes('padi')) {
            aiJawaban = "📰 <strong>Panduan Padi:</strong><br/>1. Olah tanah dengan baik.<br/>2. Benih rendam 24 jam sebelum tanam.<br/>3. Jaga ketinggian air 2-5 cm saat awal tanam.";
        } else {
            aiJawaban = "📰 Maaf, artikel tersebut belum tersedia. Coba cari 'cara tanam cabai', 'cara tanam padi', atau 'pupuk'.";
        }
    }

    // --- C. FITUR 3: CEK CUACA DAERAH (WEATHER FORECAST) ---
    else if (lowerQ.includes('cuaca') || lowerQ.includes('hujan') || lowerQ.includes('panas')) {
        let area = "Indonesia Umum";
        if (lowerQ.includes('cianjur')) area = "Kab. Cianjur";
        if (lowerQ.includes('garut')) area = "Kab. Garut";

        // Simulasi Data Cuaca (BMKG Logic)
        const acakHujan = Math.random() > 0.5 ? "Hujan Ringan" : "Cerah Berawan";
        const suhu = Math.floor(Math.random() * (34 - 26 + 1)) + 26; 

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
    else if (lowerQ.includes('karung') || lowerQ.includes('kuintal') || lowerQ.includes('sak') || lowerQ.includes('kwintal')) {
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
        
        // Logika sederhana: Tanam di tanggal yang Ganjil
        if (tanggal % 2 !== 0) {
            aiJawaban = `📅 <strong>Jadwal Baik Tanam:</strong><br/>Hari ini tanggal ${tanggal} (Ganjil) adalah hari bagus untuk menanam.<br/>`;
            aiJawaban += `Mulai sekitar jam 06:00 pagi sampai 09:00 untuk hasil maksimal.`;
        } else {
            aiJawaban = `📅 <strong>Jadwal Tanam:</strong><br/>Hari ini tanggal ${tanggal} (Genap) sebaiknya untuk perbaikan lahan, pemupukan, atau menyiram, bukan menanam.`;
        }
    }

    // --- F. LOGIKA PINTAR YANG SUDAH ADA (Context + Calculator) ---
    else {
        // Cek apakah user menyebut tanaman
        if (lowerQ.includes('padi') || lowerQ.includes('jagung') || lowerQ.includes('kopi') || lowerQ.includes('cabai')) {
            currentContext.crop = lowerQ;
            aiJawaban = `Baik, saya catat Anda sedang membahas tentang <strong>${currentContext.crop.toUpperCase()}</strong>. Silakan tanya saya tentang hama, pupuk, atau harga jualan Anda.`;
        } 
        // Cek apakah user menanyakan perhitungan pupuk (sebut 'pupuk' dan ada angka)
        else if (lowerQ.includes('pupuk') && (lowerQ.includes('hektar') || lowerQ.includes('meter'))) {
            const area = extractNumber(question);
            if (area) {
                const doseTotal = area * 100; // Asumsi dasar 100kg per Ha
                if (currentContext.crop) {
                    aiJawaban = `📊 KALKULATOR CERDAS: Untuk lahan ${area} Ha <strong>${currentContext.crop}</strong>, Anda membutuhkan sekitar <strong>${doseTotal} kg Pupuk NPK Makmur</strong>.`;
                } else {
                    aiJawaban = `📊 KALKULATOR CERDAS: Untuk luas lahan ${area} Ha, kebutuhan pupuk dasar adalah ${doseTotal} kg NPK Makmur.`;
                }
            } else {
                aiJawaban = "Berapa luas lahan Anda? Contoh: 'Untuk 2 hektar butuh berapa pupuk?'";
            }
        }
        // Fallback (Default Response)
        else {
            if (currentContext.crop) {
                aiJawaban = `Saya mencatat pertanyaan terkait <strong>${currentContext.crop}</strong>: "${question}". <br/>Bisa spesifikkan lagi? Misal: 'Hama padi', 'Pupuk jagung'.`;
            } else {
                aiJawaban = `Saya mencatat keluhan: "${question}". <br/>Coba kata kunci seperti: 'Cuaca', 'Cari Tengkulak', atau 'Cara tanam [nama tanaman]'.`;
            }
        }
    }

    // --- SIMPAN HISTORY & RENDER ---
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
    // Batasi history agar localStorage tidak penuh (misal max 20 chat)
    if (history.length > 20) history.shift();
    
    saveChatHistory(history);
    renderChatUI(history);

    // --- OPSIONAL: SIMPAN KE SUPABASE (Jika ingin history tersimpan di Cloud) ---
    // Hapus komentar di bawah jika tabel 'chats' sudah ada di Supabase
    /*
    try {
        const { data: { user } } = await supa.auth.getUser();
        if (user) {
            await supa.from('chats').insert([{
                user_id: user.id,
                question: question,
                answer: aiJawaban
            }]);
        }
    } catch (err) {
        console.error("Gagal simpan chat ke cloud:", err);
    }
    */
}

// 5. Fungsi Hapus History
export function clearChatHistory() {
    if(confirm("Hapus semua riwayat chat?")) {
        localStorage.removeItem(STORAGE_KEY);
        renderChatUI([]); 
    }
}

// 6. Fungsi Hapus UI Saja
export function clearChatUI() {
    const chatBox = document.getElementById('chatBox');
    if(chatBox) {
        chatBox.innerHTML = '<div style="text-align: center; color: #999; margin-top: 20px;">Mulai percakapan...</div>';
    }
}
