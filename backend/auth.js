const { createClient } = require('@supabase/supabase-js');

// Membuat client local untuk fungsi logic ini
// (Alternatif: Bisa pakai client yang di-inject dari index.js jika diubah jadi middleware global)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supa = createClient(supabaseUrl, supabaseKey);

/**
 * Fungsi Register
 */
exports.register = async function(email, password, fullName, role) {
    try {
        const { data, error } = await supa.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName, role: role },
                emailRedirectTo: process.env.NEXT_PUBLIC_SUPABASE_URL + '/login.html'
            }
        });

        if (error) throw error;

        if (data && data.user) {
            const { error: insertError } = await supa
                .from('users')
                .insert([{
                    id: data.user.id,
                    full_name: fullName || 'User AgriChain',
                    role: role || 'PETANI',
                    created_at: new Date().toISOString()
                }]);

            if (insertError) console.error("[AuthJS] Gagal Insert Manual:", insertError);
        }

        return { success: true, user: data.user };
    } catch (err) {
        console.error("[AuthJS] Error Register:", err);
        throw err;
    }
}

/**
 * Fungsi Login
 */
exports.login = async function(email, password) {
    try {
        const { data, error } = await supa.auth.signInWithPassword({
            email, password
        });

        if (error) throw error;

        if (data && data.user) {
            const { data: userData, error: userError } = await supa
                .from('users')
                .select('role, full_name')
                .eq('id', data.user.id)
                .single();

            // Jika user tidak ditemukan di tabel users, beri default
            const finalUser = {
                id: data.user.id,
                email: data.user.email,
                ... (userData || { role: 'UNKNOWN', full_name: email.split('@')[0] })
            };

            return { success: true, user: finalUser };
        }
        throw new Error("Login Gagal.");
    } catch (err) {
        console.error("[AuthJS] Error Login:", err);
        throw err; 
    }
}

/**
 * Fungsi Get User
 */
exports.getUser = async function(accessToken) {
    if (!accessToken) throw new Error("No Token");

    try {
        const { data: { user }, error } = await supa.auth.getUser(accessToken);
        if (error) throw error;

        const { data: userData, error: userError } = await supa
            .from('users')
            .select('role, full_name')
            .eq('id', user.id)
            .single();

        return {
            success: true,
            user: { ...user, ...(userData || {}) }
        };
    } catch (err) {
        console.error("[AuthJS] Error Get User:", err);
        throw err;
    }
}
