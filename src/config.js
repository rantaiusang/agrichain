// File: api/config.js
// Tugas: Membaca data dari Vercel Env dan mengirimkannya ke Frontend

export default async function handler(req, res) {
  // Cek apakah Environment Variable sudah terisi di Vercel
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Jika kosong, beri pesan error jelas
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ 
      error: "Environment Variables di Vercel belum diisi!" 
    });
  }

  // Kirim data kembali ke Frontend sebagai JSON
  res.status(200).json({
    supabaseUrl: supabaseUrl,
    supabaseKey: supabaseKey
  });
}
