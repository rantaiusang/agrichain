const { register } = require('../backend/auth');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email & password wajib' });
    }

    const result = await register(email, password, fullName, role);
    return res.status(200).json(result);

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
