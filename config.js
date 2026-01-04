// File: api/config.js
export default async function handler(req, res) {
  // Mengambil data dari Vercel Environment Variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  res.status(200).json({
    supabaseUrl: supabaseUrl,
    supabaseKey: supabaseKey
  });
}
