const { getUser } = require('../backend/auth');

export default async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token' });
    }

    const token = authHeader.replace('Bearer ', '');
    const result = await getUser(token);

    return res.status(200).json(result);

  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}
