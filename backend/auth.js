// --- backend/auth.js ---
import { supa } from './supabase.js';

/**
 * 1. Fungsi Registrasi User
 * Endpoint yang biasa: POST /api/auth/register
 * Body: { email, password, full_name, role }
 */
export async function register(email, password, fullName, role) {
    try {
        // 1. Buat Akun di Supabase Auth
        const { data, error } = await supa.auth.signUp({
            email,
            password,
        });

        if (error) throw error;

        // 2. Jika register Auth sukses, masukkan data tambahan (profile) ke tabel 'profiles'
        // Kita gunakan 'user' dari hasil signUp untuk referensi, atau ambil ulang via email
        if (data && data.user) {
            const userId = data.user.id;
            const defaultRole = role || 'PEMBELI'; // Default jika role tidak dikirim

            // Masukkan data ke tabel 'profiles'
            const { error: profileError } = await supa
                .from('profiles')
                .insert([
                    {
                        id: userId, // Samakan id profile dengan id auth (Best Practice)
                        email: email,
                        full_name: fullName || 'User AgriChain',
                        role: defaultRole,
                        created_at: new Date()
                    }
                ]);

            if (profileError) {
                console.error("Gagal menyimpan profile:", profileError);
                throw new Error("Pendaftaran berhasil, namun gagal menyimpan profil.");
            }
        }

        return { success: true, user: data.user };

    } catch (err) {
        console.error("Error Register:", err);
        throw err;
    }
}

/**
 * 2. Fungsi Login User
 * Endpoint yang biasa: POST /api/auth/login
 * Body: { email, password }
 */
export async function login(email, password) {
    try {
        const { data, error } = await supa.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // 3. Ambil Data Profile Lengkap (Untuk Frontend - Role Check)
        // Kita gabungkan data user (auth) dengan data profile (database)
        if (data && data.user) {
            const { data: profileData, error: profileError } = await supa
                .from('profiles')
                .select('role, full_name, phone_number') // Pilih kolom yang dibutuhkan
                .eq('id', data.user.id)
                .single();

            if (profileError || !profileData) {
                console.warn("User baru atau profile belum dibuat. Menggunakan default.");
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
        console.error("Error Login:", err);
        throw err; // Lempar error ke controller agar bisa ditampilkan pesan error di frontend
    }
}

/**
 * 3. Fungsi Mendapatkan User Saat Ini (Session Check)
 * Endpoint yang biasa: GET /api/auth/me
 * Menggunakan Bearer Token dari Header
 */
export async function getUser(accessToken) {
    if (!accessToken) {
        throw new Error("Access Token tidak ditemukan.");
    }

    try {
        // Kita gunakan instance client lokal, lalu set session access token
        // Cara ini lebih aman untuk fungsi helper yang tidak memakai global state middleware
        const { supabase: supaWithAuth } = await supa.auth.setSession({
            access_token: accessToken,
        });

        const { data: { user }, error } = await supaWithAuth.auth.getUser();

        if (error) throw error;

        // Ambil data profile lagi jika perlu (misal untuk nama lengkap)
        const { data: profileData, error: profileError } = await supaWithAuth
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
        console.error("Error Get User:", err);
        throw err;
    }
}
