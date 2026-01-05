// --- backend/auth.js ---

// Format CommonJS (Sesuaikan dengan package.json yang ada 'require')
const { createClient } = require('@supabase/supabase-js');

// Kita inisialisasi client di sini
// Catatan: Dalam arsitektur Express yang benar, sebaiknya app config dilakukan di index.js
// dan instance client dipassing ke sini. Tapi untuk kesederhanaan, kita buat instance di sini
// menggunakan ENV Vars yang sama.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supa = createClient(supabaseUrl, supabaseKey);

/**
 * 1. Fungsi Registrasi User
 * Endpoint yang biasanya: POST /api/auth/register
 * Body: { email, password, full_name, role }
 */
exports.register = async function(email, password, fullName, role) {
    try {
        // 1. Buat Akun di Supabase Auth
        const { data, error } = await supa.auth.signUp({
            email,
            password,
            options: {
                // Metadata untuk disimpan di Auth
                data: { 
                    full_name: fullName, 
                    role: role 
                },
                // Redirect setelah konfirmasi email (jika aktif)
                emailRedirectTo: process.env.NEXT_PUBLIC_SUPABASE_URL + '/login.html'
            }
        });

        if (error) throw error;

        console.log("[Backend] Auth Success:", data.user.id);

        // 2. Masukkan Data Tambahan ke Tabel 'users' (BUKAN 'profiles')
        // Ini adalah "Backup" jika Trigger SQL gagal jalan.
        if (data && data.user) {
            const userId = data.user.id;
            const defaultRole = role || 'PETANI'; // Default jika role tidak dikirim

            const { error: profileError } = await supa
                .from('users') // <--- PERBAIKAN: Nama tabel 'users'
                .insert([
                    {
                        id: userId, 
                        full_name: fullName || 'User AgriChain',
                        role: defaultRole,
                        phone: '-', 
                        desa: '-', 
                        luas_lahan: 0,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (profileError) {
                console.error("[Backend] Gagal menyimpan user manual:", profileError);
                // Jangan throw error di sini agar Auth tetap sukses. 
                // Hanya log error saja.
            } else {
                console.log("[Backend] User Manual Insert Sukses.");
            }
        }

        return { success: true, user: data.user };

    } catch (err) {
        console.error("[Backend] Error Register:", err);
        throw err;
    }
}

/**
 * 2. Fungsi Login User
 * Endpoint yang biasanya: POST /api/auth/login
 * Body: { email, password }
 */
exports.login = async function(email, password) {
    try {
        const { data, error } = await supa.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        console.log("[Backend] Login Auth Success:", data.user.id);

        // 3. Ambil Data Profile Lengkap dari tabel 'users'
        if (data && data.user) {
            const { data: userData, error: userError } = await supa
                .from('users') // <--- PERBAIKAN: Nama tabel 'users'
                .select('role, full_name, phone') 
                .eq('id', data.user.id)
                .single();

            if (userError) {
                console.error("[Backend] Error Ambil User:", userError);
                // Toleransi error: Jika profile belum ada, kita kembalikan data auth saja
                return {
                    success: true,
                    user: {
                        ...data.user,
                        role: 'UNKNOWN', // Role default
                        full_name: email.split('@')[0] // Nama default dari email
                    }
                };
            }

            // Gabungkan data Auth + Data Tabel Users
            return {
                success: true,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    ...userData // role, full_name, phone
                }
            };
        } else {
            throw new Error("Gagal login: Data user tidak ditemukan.");
        }

    } catch (err) {
        console.error("[Backend] Error Login:", err);
        throw err; 
    }
}

/**
 * 3. Fungsi Mendapatkan User Saat Ini (Session Check)
 * Endpoint yang biasanya: GET /api/auth/me
 * Menggunakan Bearer Token dari Header Authorization
 */
exports.getUser = async function(accessToken) {
    if (!accessToken) {
        throw new Error("Access Token tidak ditemukan.");
    }

    try {
        // Mengambil user berdasarkan Access Token
        const { data: { user }, error } = await supa.auth.getUser(accessToken);

        if (error) throw error;

        // Ambil data role/nama dari tabel 'users'
        const { data: userData, error: userError } = await supa
            .from('users') // <--- PERBAIKAN: Nama tabel 'users'
            .select('role, full_name')
            .eq('id', user.id)
            .single();

        return {
            success: true,
            user: {
                ...user,
                ...(userData || {}) // Gabungkan jika ada, jika tidak kosongkan
            }
        };

    } catch (err) {
        console.error("[Backend] Error Get User:", err);
        throw err;
    }
}
