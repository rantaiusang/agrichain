// --- backend/auth.js ---
import { supa } from './supabase.js';

/**
 * 1. Fungsi Registrasi User
 * Endpoint yang biasanya: POST /api/auth/register
 * Body: { email, password, full_name, role }
 */
export async function register(email, password, fullName, role) {
    try {
        // 1. Buat Akun di Supabase Auth
        const { data, error } = await supa.auth.signUp({
            email,
            password,
            options: {
                // ✅ PERBAIKAN: Supabase versi 2.x pakai ini untuk metadata
                data: { 
                    full_name: fullName, 
                    role: role 
                },
                // Redirect user ke halaman setelah klik link email (jika feature aktif)
                emailRedirectTo: process.env.APP_URL + '/login.html'
            }
        });

        if (error) throw error;

        console.log("[Backend] Auth Success:", data.user.id);

        // 2. Masukkan Data Tambahan ke Tabel 'profiles'
        // Ini adalah "Backup" jika Trigger SQL gagal jalan.
        if (data && data.user) {
            const userId = data.user.id;
            const defaultRole = role || 'PETANI'; // Default jika role tidak dikirim

            const { error: profileError } = await supa
                .from('profiles')
                .insert([
                    {
                        id: userId, // Samakan id profile dengan id auth (Best Practice)
                        email: email,
                        full_name: fullName || 'User AgriChain',
                        role: defaultRole,
                        phone: '-', // Default kosong
                        desa: '-', // Default kosong
                        luas_lahan: 0 // Default kosong
                    }
                ]);

            if (profileError) {
                console.error("[Backend] Gagal menyimpan profile manual:", profileError);
                // Jangan throw error di sini agar Auth tetap sukses. 
                // Hanya log error saja.
            } else {
                console.log("[Backend] Profile Manual Insert Sukses.");
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
export async function login(email, password) {
    try {
        const { data, error } = await supa.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        console.log("[Backend] Login Auth Success:", data.user.id);

        // 3. Ambil Data Profile Lengkap (Gabungkan Auth + Database)
        // Ini penting agar Frontend tahu Role User (PETANI/PEMBELI/DLL)
        if (data && data.user) {
            const { data: profileData, error: profileError } = await supa
                .from('profiles')
                .select('role, full_name, phone') // Tambahkan phone jika diperlukan
                .eq('id', data.user.id)
                .single();

            if (profileError) {
                console.error("[Backend] Error Ambil Profile:", profileError);
                // Jika error adalah karena profile tidak ada, kita buat object dummy
                // agar frontend tidak crash
            }

            // Gabungkan ke response
            return {
                success: true,
                user: {
                    ...data.user, // ID, Email, Access Token, Refresh Token
                    ...profileData // Role, Nama Lengkap, dll
                }
            };
        } else {
            throw new Error("Gagal login: Data user tidak ditemukan.");
        }

    } catch (err) {
        console.error("[Backend] Error Login:", err);
        throw err; // Lempar error ke controller agar bisa ditampilkan pesan error di frontend
    }
}

/**
 * 3. Fungsi Mendapatkan User Saat Ini (Session Check)
 * Endpoint yang biasanya: GET /api/auth/me
 * Menggunakan Bearer Token dari Header Authorization
 */
export async function getUser(accessToken) {
    if (!accessToken) {
        throw new Error("Access Token tidak ditemukan.");
    }

    try {
        // ✅ PERBAIKAN: Cara paling aman untuk Serverless Function
        // Kita gunakan function getUser() dengan token langsung, bukan setSession.
        const { data: { user }, error } = await supa.auth.getUser(accessToken);

        if (error) throw error;

        // Ambil data profile lagi jika perlu (untuk nama lengkap, dll)
        const { data: profileData, error: profileError } = await supa
            .from('profiles')
            .select('role, full_name')
            .eq('id', user.id)
            .single();

        return {
            success: true,
            user: {
                ...user,
                ...profileData
            }
        };

    } catch (err) {
        console.error("[Backend] Error Get User:", err);
        throw err;
    }
}
