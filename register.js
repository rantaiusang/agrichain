import { register } from '../backend/auth.js';

export default async function handler(req, res) {
    const { email, password, fullName, role } = req.body;
    const result = await register(email, password, fullName, role);
    return res.status(200).json(result);
}
