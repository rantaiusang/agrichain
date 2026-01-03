// --- src/connectWallet.js ---

/**
 * Mengelola koneksi Dompet Blockchain (Browser Wallet)
 * Menggunakan EIP-1193 atau window.ethereum standar
 */

// State Status Koneksi
export let isWalletConnected = false;
export let currentWalletAddress = null;

// --- 1. CEK AVAILABILITAS WALLET ---
function checkWalletAvailability() {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
        return true; // MetaMask / Browser Wallet terdeteksi
    }
    if (typeof window.ethereum !== 'undefined') {
        return true; // Wallet lain (TrustWallet, Coinbase, dll)
    }
    return false; // Tidak ada wallet browser
}

// --- 2. FUNGSI CONNECT (MEMINTA AKSES) ---
export async function connectWallet() {
    if (!checkWalletAvailability()) {
        alert("Aplikasi ini membutuhkan Dompet Crypto (Wallet) seperti MetaMask atau TrustWallet.\n\nSilakan instal wallet browser terlebih dahulu.");
        window.open('https://metamask.io/download/', '_blank');
        return { success: false, address: null };
    }

    try {
        // Request akses ke akun wallet
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (accounts.length > 0) {
            handleAccountsChanged(accounts);
            return { success: true, address: accounts[0] };
        } else {
            alert("Gagal mengambil alamat wallet. Pastikan Anda login di wallet browser Anda.");
            return { success: false, address: null };
        }

    } catch (error) {
        console.error("Wallet connection error:", error);
        // Handle error user menolak (User Rejected Request)
        if (error.code === 4001) {
            alert("Anda membatalkan koneksi wallet.");
        } else {
            alert("Terjadi kesalahan saat menghubungkan wallet: " + error.message);
        }
        return { success: false, address: null };
    }
}

// --- 3. FUNGSI MEMUTUS KONEKSI (LOGOUT WALLET) ---
export async function disconnectWallet() {
    // Catatan: Anda tidak bisa "memaksa" wallet logout secara programatik 
    // melalui JS karena alasan keamanan browser. Yang bisa kita lakukan 
    // adalah menghapus status aplikasi UI saja.
    
    if (window.confirm("Batalkan koneksi Dompet (Log Out Wallet)?")) {
        isWalletConnected = false;
        currentWalletAddress = null;
        
        // Trigger event jika ada file lain yang mendengarkan perubahan wallet
        window.dispatchEvent(new CustomEvent('walletDisconnected'));
        
        alert("Status wallet aplikasi diputus.");
    }
}

// --- 4. LISTENER OTOMATIS (KETI USER GANTI AKUN DI WALLET) ---
// Fungsi ini dipanggil saat inisialisasi aplikasi
export function listenForAccountChanges() {
    if (checkWalletAvailability()) {
        window.ethereum.on('accountsChanged', (accounts) => {
            handleAccountsChanged(accounts);
        });
    }
}

// --- 5. HELPER: UPDATE STATE GLOBAL ---
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User logout dari wallet mereka
        isWalletConnected = false;
        currentWalletAddress = null;
        console.log("User logout dari Wallet Browser.");
        
        // Opsional: Redirect ke login atau update UI
        // window.location.href = 'login.html'; 
    } else {
        // User ganti akun atau baru connect
        isWalletConnected = true;
        currentWalletAddress = accounts[0];
        console.log("Wallet Connected:", currentWalletAddress);
    }
    
    // Dispatch Event agar UI bisa update otomatis
    const event = new CustomEvent('walletStatusChanged', { 
        detail: { connected: isWalletConnected, address: currentWalletAddress } 
    });
    window.dispatchEvent(event);
}
