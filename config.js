// public/config.js (ATAU src/config.js)
// Ini AMAN di-upload ke GitHub karena tidak ada kunci rahasianya di sini.

window.appConfig = {
    supabaseUrl: null,
    supabaseKey: null
};

fetch('/api/config')
    .then(res => res.json())
    .then(data => {
        window.appConfig.supabaseUrl = data.supabaseUrl;
        window.appConfig.supabaseKey = data.supabaseKey;
        console.log("Config loaded");
    })
    .catch(err => console.error("Gagal ambil config:", err));
