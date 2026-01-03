// --- frontend/src/app/chat.js ---

// 1. KEY CONFIG
const STORAGE_KEY = 'agrichain_chat_history';
let supabase = null; // Client Supabase

// 2. INIT (Dipanggil dari HTML)
export function initChat(client) {
    supabase = client;
}

// 3. VARIABEL GLOBAL AGAR AI PINTAR (MEMORY)
let currentContext = {
    crop: null,     // Tanaman apa (Contoh: Padi, Jagung)
    area: null      // Luas lahan (untuk hitung pupuk)
};

// Helper: Ambil angka dari kalimat ("1 hektar" -> 1)
function extractNumber(str) {
    const match = str.match(/(\d+)/);
    return match ? parseInt(match[0]) : null;
}

// 4. Fungsi Ambil History (Local Storage)
export function getChatHistory() {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
}

// 5. Fungsi Simpan History (Local Storage)
function saveChatHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

// 6. Fungsi Render Tampilan Chat
export function renderChatUI(history) {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return; 

    chatBox.innerHTML = '';

    if (history.length === 0) {
        chatBox.innerHTML = `
            <div style="text-align: center; color: #999; margin-top: 20px; font-style: italic;">
                Halo Petani! Ada yang bisa saya bantu? 
                <br>Coba tanya "Cari tengkulak Cianjur", "Cuaca hari ini", atau "Cara tanam cabai".
            </div>`;
        return;
    }

    history.forEach(chat => {
        // Bubble User (Kanan, Hijau Muda)
        const bubbleUser = `
            <div style="display: flex; justify-content: flex-end; margin-bottom: 20px; animation: fadeIn 0.3s ease;">
                <div style="background: #E8F5E9; padding: 12px 18px; border-radius: 18px 18px 4px 18px; max-width: 80%; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                    <div style="font-weight: 600; font-size: 0.9rem; color: #1B5E20; margin-bottom: 4px;">Anda:</div>
                    <div style="font-size: 1rem; color: #333; line-height: 1.4;">${chat.question}</div>
                </div>
            </div>
        `;

        // Bubble AI (Kiri, Putih dengan border Hijau)
        const bubbleAI = `
            <div style="display: flex; justify-content: flex-start; margin-bottom: 20px; animation: fadeIn 0.3s ease;">
                <div style="background: #FFFFFF; padding: 12px 18px; border-radius: 18px 18px 4px 18px; max-width: 80%; border: 1px solid #E5E7EB; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <div style="font-weight: 600; font-size: 0.9rem; color: #2E7D32; margin-bottom: 6px; display:flex; align-items:center; gap:6px;">
                        🤖 AgriAI
                        <span style="font-size:0.75rem; background:#E8F5E9; color:#2E7D32; padding:2px 6px; border-radius:8px;">Otomatis</span>
                    </div>
                    <div style="font-size: 1rem; color: #333; line-height: 1.6;">${chat.answer}</div>
                    <div style="font-size: 0.75rem; color: #9CA3AF; margin-top: 8px; border-top: 1px solid #F3F4F6; padding-top: 8px;">
                        Dijawab: ${chat.answeredAt || 'Sekarang'}
                    </div>
                </div>
            </div>
        `;
        
        chatBox.innerHTML += bubbleUser + bubbleAI;
    });
    
    // Auto scroll ke bawah agar pesan baru terlihat
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 7. Logika Utama Chat (ENGINE RAMAH BAHASA INDONESIA)
export async function handleChat(question, category) {
    let history = getChatHistory();
    let aiJawaban = "Maaf, saya belum mengerti. Coba tanya cuaca, cari tengkulak, atau cara tanam.";
    const lowerQ = question.toLowerCase();

    // --- A. FITUR 1: CARI TENGGULAK & RONGSOK (SEARCH MERCHANT) ---
    if (lowerQ.includes('cari') && (lowerQ.includes('tengkulak') || lowerQ.includes('ronggok') || lowerQ.includes('pembeli'))) {
        let kota = "Umum";
        if (lowerQ.includes('cianjur')) kota = "Cianjur";
        else if (lowerQ.includes('tasik')) kota = "Tasikmalaya";
        else if (lowerQ.includes('garut')) kota = "Garut";
        else if (lowerQ.includes('bandung')) kota = "Bandung";

        // Daftar Tengkulak (Simulasi Database Rating Jujur)
        const tengkulakList = [
            { nama: "Bapak H. Murni", area: kota, rating: "5 Bintang", note: "Harga bersahabat, bayar tunai.", phone: "0812-xxxx-xxxx" },
            { nama: "CV. Subur", area: kota, rating: "4.5 Bintang", note: "Menerima padi basah maupun giling.", phone: "0813-xxxx-xxxx" },
            { nama: "Uda. Ahmad", area: kota, rating: "4 Bintang", note: "Mudah dihubungi, stock selalu ada.", phone: "0814-xxxx-xxxx" }
        ];

        aiJawaban = `<strong>🔍 Rekomendasi Tengkulak (${kota}):</strong><br/>`;
        tengkulakList.forEach((t, i) => {
            aiJawaban += `${i+1}. <strong>${t.nama}</strong> (${t.area})<br/>`;
            aiJawaban += `&nbsp;&nbsp;&nbsp;⭐ <strong>${t.rating}</strong><br/>`;
            aiJawaban += `&nbsp;&nbsp;&nbsp;📝 ${t.note}<br/>`;
            aiJawaban += `&nbsp;&nbsp;&nbsp;📞 ${t.phone}<br/><br/>`;
        });
        aiJawaban += `<em>Agar aman, selalu cek timbangan saat di lokasi.</em>`;
    }

    // --- B. FITUR 2: ARTIKEL KONSULTASI TANI (ARTICLE FINDER) ---
    else if (lowerQ.includes('cara') || lowerQ.includes('panduan') || lowerQ.includes('resep') || lowerQ.includes('menanam') || lowerQ.includes('pupuk')) {
        if (lowerQ.includes('cabai merah') || lowerQ.includes('cabe')) {
            aiJawaban = "📰 <strong>Panduan Menanam Cabai:</strong><br/>1. Tanam di lahan yang banyak matahari.<br/>2. Tanam benih jarak 40-50 cm.<br/>3. Beri pupuk dasar (TSP) saat tanam (200 kg/ha).<br/>4. Beri pupuk susulan NPK saat tanaman berumur 40 HST.";
        } else if (lowerQ.includes('padi') || lowerQ.includes('gabah')) {
            aiJawaban = "📰 <strong>Panduan Menanam Padi:</strong><br/>1. Olah tanah cangkul sedalam (20-30 cm).<br/>2. Benih rendam 24 jam.<br/>3. Tanam benih jarak 20-25 cm (2-3 benih per lubang).<br/>4. Jaga air (genangan) sampai HST 35 (pembuahan).";
        } else if (lowerQ.includes('pupuk')) {
            aiJawaban = "📰 <strong>Dasar Pemupukan:</strong><br/>Untuk hasil maksimal, gunakan pola pemupukan NPK (Nitrogen, Fosfor, Kalium).<br/>- Urea: 200 kg/ha (Daun).<br/>- TSP: 100 kg/ha (Batang & Akar).<br/>- KCl: 50 kg/ha (Buah & Kualitas).<br/>Berikan secara bertahap (3x)";
        } else if (lowerQ.includes('panen') || lowerQ.includes('potong')) {
            aiJawaban = "📰 <strong>Tips Panen Padi:</strong><br/>1. Lakukan panen saat 80-90% gabah kuning (masa).<br/>2. Gunakan sabit tajam untuk memotong pangkal gabah (agar bercabut rapi).<br/>3. Jemur gabah di lantai padi (jangan di aspal) selama 3 hari hingga kadar airnya 14%.";
        } else {
            aiJawaban = "📰 Maaf, artikel tersebut belum tersedia di database saya. Coba cari 'cara tanam cabai', 'cara tanam padi', atau 'tips panen'.";
        }
    }

    // --- C. FITUR 3: KONVERSI SATUAN (UNIT CONVERTER) ---
    else if (lowerQ.includes('berapa') && (lowerQ.includes('kg') || lowerQ.includes('ton'))) {
        if (lowerQ.includes('sak') || lowerQ.includes('karung')) {
            aiJawaban = "⚖️ <strong>Konversi Karung Padi:</strong><br/>Untuk varietas padi Cianjur, 1 Sak (Giling) setara dengan kira-kira 50 kg - 60 kg. Pastikan kualitas beras di dalamnya.";
        } else if (lowerQ.includes('padi') && (lowerQ.includes('kuintal'))) {
            aiJawaban = "⚖️ <strong>Konversi Kuintal Padi:</strong><br/>Masa 1 Kuintal (Masa 100 Liter) setara dengan kira-kira 875 kg Beras Giling (Beras Murni).";
        } else {
            aiJawaban = "⚖️ Mohon sebutkan barangnya (Padi, Jagung, Kelapa) dan satuan tujuannya.";
        }
    }

    // --- D. FITUR 4: JADWAL TANAM (CALENDAR BON) ---
    else if (lowerQ.includes('kapan') && (lowerQ.includes('tanam') || lowerQ.includes('panen'))) {
        const dateObj = new Date();
        const tanggal = dateObj.getDate();
        
        // Logika sederhana: Tanam di tanggal Ganjil
        if (tanggal % 2 !== 0) {
            aiJawaban = `📅 <strong>Jadwal Baik Tanam:</strong><br/>Hari ini tanggal ${tanggal} (Ganjil) adalah hari yang baik untuk menanam tanaman padi menurut kalender kebonan tradisional.<br/><br/>Mulai sekitar jam 06:00 pagi sampai 09:00 pagi agar bibit cepat masuk ke tanah.`;
        } else {
            aiJawaban = `📅 <strong>Jadwal Tanam:</strong><br/>Hari ini tanggal ${tanggal} (Genap). Sebaiknya gunakan hari ini untuk perbaikan lahan, persiapan pupuk dasar, atau memotong gulma, bukan menanam bibit baru.`;
        }
    }

    // --- E. LOGIKA PINTAR YANG SUDAH ADA (Context + Calculator) ---
    else {
        // 1. Cek apakah user menyebut tanaman (Konteks)
        if (lowerQ.includes('padi') || lowerQ.includes('jagung') || lowerQ.includes('kopi') || lowerQ.includes('cabai') || lowerQ.includes('singkong')) {
            let detectedCrop = null;
            if(lowerQ.includes('padi')) detectedCrop = 'Padi';
            else if(lowerQ.includes('jagung')) detectedCrop = 'Jagung';
            else if(lowerQ.includes('kopi')) detectedCrop = 'Kopi';
            else if(lowerQ.includes('cabai')) detectedCrop = 'Cabai';
            
            if (detectedCrop) {
                currentContext.crop = detectedCrop;
                aiJawaban = `Baik, saya menyimpan konteks bahwa Anda sedang membahas tentang <strong>${detectedCrop.toUpperCase()}</strong>. Ada yang bisa saya bantu seputar hama, penyakit, atau perawatan ${detectedCrop} ini?`;
                // Masukkan ke history meski belum ada jawaban spesifik (untuk UX)
            }
        } 
        // 2. Cek apakah user menanyakan perhitungan pupuk (butuh 'pupuk' dan ada angka)
        else if (lowerQ.includes('pupuk') && (lowerQ.includes('hektar') || lowerQ.includes('meter'))) {
            const area = extractNumber(question);
            if (area) {
                // Dosis standar NPK (Simulasi)
                const doseUrea = area * 200; // kg
                const doseTSP = area * 100; // kg
                const doseKCL = area * 50; // kg
                
                if (currentContext.crop) {
                    aiJawaban = `📊 <strong>KALKULATOR PUPUK CERDAS (${currentContext.crop.toUpperCase()})</strong><br/>Untuk lahan ${area} Ha, berikut estimasi dosis pupuk:<br/>`;
                    aiJawaban += `- Urea: ${doseUrea} kg<br/>`;
                    aiJawaban += `- TSP: ${doseTSP} kg<br/>`;
                    aiJawaban += `- KCL: ${doseKCL} kg<br/><br/>Bagil menjadi 3 tahap (Tanam, Anakan, Malai).`;
                } else {
                    aiJawaban = `📊 <strong>KALKULATOR PUPUK UMUM</strong><br/>Untuk luas lahan ${area} Ha, kebutuhan pupuk dasar (NPK) adalah:<br/>`;
                    aiJawaban += `- Urea: ${doseUrea} kg<br/>`;
                    aiJawaban += `- TSP: ${doseTSP} kg<br/>`;
                    aiJawaban += `- KCL: ${doseKCL} kg<br/>`;
                }
            } else {
                aiJawaban = "Berapa luas lahan Anda? Contoh: 'Untuk 2 hektar butuh berapa pupuk?'";
            }
        }
        // 3. Fallback (Default Response)
        else {
            if (currentContext.crop) {
                aiJawaban = `Saya mencatat keluhan Anda terkait <strong>${currentContext.crop.toUpperCase()}</strong>: "${question}". <br/>Saya bisa membantu lebih spesifik jika Anda menyebutkan kategori, seperti 'Hama & Penyakit', 'Cara Tanam', atau 'Pupuk'.`;
            } else {
                aiJawaban = `Saya mencatat keluhan Anda: "${question}". <br/>Agar saya bisa memberikan jawaban yang akurat, coba gunakan kata kunci seperti 'Cuaca', 'Cari Tengkulak', atau 'Panduan Tanam [Nama Tanaman]'.`;
            }
        }
    }

    // --- SIMPAN HISTORY & RENDER ---
    const newId = Date.now();
    const dateObj = new Date();
    const tglIndo = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(dateObj);
    const jamIndo = new Intl.DateTimeFormat('id-ID', { timeStyle: 'short' }).format(dateObj);
    
    // Format waktu jawaban
    const answeredAt = `${tglIndo}, ${jamIndo}`;

    const newChat = {
        id: newId,
        question: question,
        category: category || "Umum",
        answer: aiJawaban,
        answeredAt: answeredAt
    };

    // --- SAVE TO LOCAL STORAGE ---
    history.push(newChat);
    
    // Batasi history max 50 agar localStorage tidak penuh
    if (history.length > 50) history.shift();
    
    saveChatHistory(history);
    renderChatUI(history);

    // --- SAVE TO SUPABASE (CLOUD HISTORY) ---
    // Fitur opsional agar chat tersimpan di cloud user tertentu
    if (supabase) {
        (async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.from('chats').insert([{
                        user_id: user.id,
                        question: question,
                        answer: aiJawaban,
                        category: category || "Umum"
                    }]);
                }
            } catch (err) {
                console.error("Gagal simpan chat ke cloud:", err);
            }
        })();
    }

    return newChat;
}

// 8. Fungsi Hapus History
export function clearChatHistory() {
    if(confirm("Hapus semua riwayat chat secara permanen?")) {
        localStorage.removeItem(STORAGE_KEY);
        currentContext = { crop: null, area: null }; // Reset memori AI
        renderChatUI([]); // Render UI kosong (pesan welcome default)
    }
}

// 9. Fungsi Hapus UI Saja (Tanpa hapus data)
export function clearChatUI() {
    const chatBox = document.getElementById('chatBox');
    if(chatBox) {
        chatBox.innerHTML = '<div style="text-align: center; color: #999; margin-top: 20px;">Mulai percakapan baru...</div>';
    }
}
