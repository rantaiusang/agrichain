--- src/api.js ---
import { createClient } from 'https://unpkg.com/@supabase/supabase-js@2'

// ---------------------------------------------------------
// 1. KONFIGURASI CLIENT
// ---------------------------------------------------------
// PASTIKAN di file .env Anda bernama VITE_SUPABASE_ANON_KEY
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Error: Variabel lingkungan VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY tidak ditemukan.")
}

export const supa = createClient(SUPABASE_URL, SUPABASE_KEY)

// ---------------------------------------------------------
// 2. FUNGSI PRODUK (Sudah Ada, Sedikit Dirapikan)
// ---------------------------------------------------------
export async function getProducts() {
    try {
        const { data, error } = await supa
            .from('agrichain_panen')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) throw error

        return data.map(p => ({
            id: p.id, // Penting untuk ditambahkan ID jika nanti ingin edit/hapus
            name: p.nama_produk,
            price: p.harga, // Asumsi nama kolom harga, sesuaikan jika beda
            stock: p.jumlah_kg, 
            img: p.img || 'https://via.placeholder.com/200'
        }))
    } catch(e) {
        console.error("Gagal ambil produk:", e)
        return []
    }
}

// ---------------------------------------------------------
// 3. FUNGSI REGISTRASI (PERBAIKAN)
// ---------------------------------------------------------
export async function registerUser(email, password, fullName, role = 'pembeli') {
    try {
        // Step 1: Buat user di Auth Supabase
        // Kita kirim 'role' dan 'full_name' di dalam 'data' (metadata)
        // Ini akan dibaca oleh Trigger SQL di Supabase untuk mengisi tabel 'profiles'
        const { data, error } = await supa.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role
                }
            }
        })

        if (error) throw error

        return { 
            success: true, 
            message: "Registrasi berhasil! Silakan cek email Anda atau login.", 
            user: data.user 
        }

    } catch (error) {
        console.error("Error Register:", error.message)
        return { 
            success: false, 
            message: error.message || "Terjadi kesalahan saat registrasi." 
        }
    }
}

// ---------------------------------------------------------
// 4. FUNGSI LOGIN (PERBAIKAN)
// ---------------------------------------------------------
export async function loginUser(email, password) {
    try {
        // Step 1: Login ke Auth
        const { data, error } = await supa.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error

        // Step 2: Ambil data Role dari tabel 'profiles'
        // Kita perlu role ini untuk menentukan redirect (admin vs pembeli vs petani)
        let userRole = 'pembeli' // Default fallback
        let userName = ''

        if (data.user) {
            const { data: profileData, error: profileError } = await supa
                .from('profiles')
                .select('role, full_name')
                .eq('id', data.user.id)
                .single()

            if (profileError) {
                console.warn("Gagal ambil profil (mungkin tabel belum siap), pakai default role.")
            } else {
                userRole = profileData.role
                userName = profileData.full_name
            }
        }

        // Return data lengkap untuk digunakan di UI
        return {
            success: true,
            message: "Login berhasil!",
            user: {
                id: data.user.id,
                email: data.user.email,
                role: userRole,
                full_name: userName
            }
        }

    } catch (error) {
        console.error("Error Login:", error.message)
        // Menangani error spesifik seperti "Email not confirmed" atau "Invalid credentials"
        let errorMsg = "Login gagal."
        if (error.message.includes("Invalid login credentials")) {
            errorMsg = "Email atau password salah."
        }
        return { 
            success: false, 
            message: errorMsg 
        }
    }
}
