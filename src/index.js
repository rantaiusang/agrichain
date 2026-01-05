// index.js — entry point frontend
import { register, login, logout } from './api/auth.js'
import { getMe } from './api/me.js'

// Contoh: register user baru
async function handleRegister() {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const role = document.getElementById('role').value  // PETANI / PEMBELI / LEMBAGA

  try {
    const { data, error } = await register(email, password, role)
    if (error) throw error

    alert('Register berhasil! Silakan login.')
  } catch (err) {
    alert('Gagal register: ' + err.message)
  }
}

// Contoh: login user
async function handleLogin() {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  try {
    const { data, error } = await login(email, password)
    if (error) throw error

    alert('Login berhasil!')

    // Ambil data user
    const user = await getMe()
    console.log('User:', user)
  } catch (err) {
    alert('Gagal login: ' + err.message)
  }
}

// Contoh: logout
async function handleLogout() {
  await logout()
  alert('Logout berhasil!')
}

// Hubungkan ke form / tombol di HTML
document.addEventListener('DOMContentLoaded', () => {
  const registerBtn = document.getElementById('registerBtn')
  const loginBtn = document.getElementById('loginBtn')
  const logoutBtn = document.getElementById('logoutBtn')

  if (registerBtn) registerBtn.addEventListener('click', handleRegister)
  if (loginBtn) loginBtn.addEventListener('click', handleLogin)
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout)
})
