// File: api/config.js
// Tugas: Mengambil Env Vercel dan mengirimnya ke Frontend

export default async function handler(req, res) {
  // Pastikan variabel Vercel ada
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "Environment Variables Vercel belum diset!" });
  }

  res.status(200).json({
    supabaseUrl: supabaseUrl,
    supabaseKey: supabaseKey
  });
}
