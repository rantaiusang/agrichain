const { createClient } = require('@supabase/supabase-js');

/**
 * ==============================
 * VALIDASI ENV (ANTI ERROR DIAM)
 * ==============================
 */
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error("❌ ENV SUPABASE BELUM LENGKAP");
    console.error("SUPABASE_URL:", process.env.SUPABASE_URL);
    console.error("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY);
    throw new Error("Supabase ENV missing");
}

/**
 * ==============================
 * CLIENT SUPABASE (BACKEND)
 * ==============================
 */
const supa = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    }
);

/**
 * ==============================
 * REGISTER USER
 * ==============================
 */
async function register(email, password, fullName = 'User AgriChain', role = 'PETANI') {
    try {
        const { data, error } = await supa.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role
                }
            }
        });

        if (error) throw error;
        if (!data?.user) throw new Error("User tidak terbentuk");

        // Simpan ke tabel users (jika RLS mengizinkan)
        const { error: insertError } = await supa
            .from('users')
            .insert({
                id: data.user.id,
                full_name: fullName,
                role: role
            });

        if (insertError) {
            console.warn("⚠️ Insert users gagal (cek RLS):", insertError.message);
        }

        return {
            success: true,
            user: {
                id: data.user.id,
                email: data.user.email,
                full_name: fullName,
                role: role
            }
        };

    } catch (err) {
        console.error("[REGISTER ERROR]", err.message);
        throw err;
    }
}

/**
 * ==============================
 * LOGIN USER
 * ==============================
 */
async function login(email, password) {
    try {
        const { data, error } = await supa.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        if (!data?.user) throw new Error("Login gagal");

        // Ambil profil tambahan
        const { data: profile } = await supa
            .from('users')
            .select('full_name, role')
            .eq('id', data.user.id)
            .single();

        return {
            success: true,
            session: data.session,
            user: {
                id: data.user.id,
                email: data.user.email,
                full_name: profile?.full_name || email.split('@')[0],
                role: profile?.role || 'UNKNOWN'
            }
        };

    } catch (err) {
        console.error("[LOGIN ERROR]", err.message);
        throw err;
    }
}

/**
 * ==============================
 * GET USER DARI TOKEN
 * ==============================
 */
async function getUser(accessToken) {
    if (!accessToken) throw new Error("Access token kosong");

    try {
        const { data, error } = await supa.auth.getUser(accessToken);
        if (error) throw error;
        if (!data?.user) throw new Error("User tidak valid");

        const { data: profile } = await supa
            .from('users')
            .select('full_name, role')
            .eq('id', data.user.id)
            .single();

        return {
            success: true,
            user: {
                id: data.user.id,
                email: data.user.email,
                full_name: profile?.full_name,
                role: profile?.role
            }
        };

    } catch (err) {
        console.error("[GET USER ERROR]", err.message);
        throw err;
    }
}

/**
 * ==============================
 * EXPORT
 * ==============================
 */
module.exports = {
    register,
    login,
    getUser
};
