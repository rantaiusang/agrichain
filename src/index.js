// src/index.js — entry point frontend
import { register, login, logout } from './api/auth.js'
import { getMe } from './api/me.js'

/**
 * Handler register user baru
 */
async function handleRegister() {
  const email = document.getElementById('email')?.value
  const password = document.getElementById('password')?.value
  const role = document.getElementById('role')?.value || 'PETANI' // default PETANI

  if (!email || !password) {
    alert('Email dan password wajib diisi!')
    return
  }

  try {
    const { data, error } = await register(email, password, role)
    if (error) throw error

    alert('✅ Register berhasil! Silakan login.')
    console.log('User register data:', data)
  } catch (err) {
    console.error('Register error:', err)
    alert('❌ Gagal register: ' + err.message)
  }
}

/**
 * Handler login user
 */
async function handleLogin() {
  const email = document.getElementById('email')?.value
  const password = document.getElementById('password')?.value

  if (!email || !password) {
    alert('Email dan password wajib diisi!')
    return
  }

  try {
    const { data, error } = await login(email, password)
    if (error) throw error

    alert('✅ Login berhasil!')

    // Ambil data user yang sedang login
    const user = await getMe()
    console.log('User logged in:', user)
  } catch (err) {
    console.error('Login error:', err)
    alert('❌ Gagal login: ' + err.message)
  }
}

/**
 * Handler logout user
 */
async function handleLogout() {
  try {
    await logout()
    alert('✅ Logout berhasil!')
  } catch (err) {
    console.error('Logout error:', err)
    alert('❌ Gagal logout: ' + err.message)
  }
}

/**
 * Hubungkan tombol/form di HTML
 */
document.addEventListener('DOMContentLoaded', () => {
  const registerBtn = document.getElementById('registerBtn')
  const loginBtn = document.getElementById('loginBtn')
  const logoutBtn = document.getElementById('logoutBtn')

  if (registerBtn) registerBtn.addEventListener('click', handleRegister)
  if (loginBtn) loginBtn.addEventListener('click', handleLogin)
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout)
})
