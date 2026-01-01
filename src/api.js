// Simulasi Database Tabel 'harga_pasar' & 'products'
const dataHargaPasar = [
    { id: 1, nama: "Padi Cianjur", harga: 6500, rata: 6000, volume: 50 },
    { id: 2, nama: "Jagung Manis", harga: 3200, rata: 3500, volume: 120 }
];

async function getProducts() {
    // Return mockup products dulu
    return [
        { id: 1, name: "Padi IR64", price: 6500, img: "https://picsum.photos/seed/padi/400/200" },
        { id: 2, name: "Jagung Manis", price: 4000, img: "https://picsum.photos/seed/jagung/400/200" }
    ];
}

export { getProducts };
