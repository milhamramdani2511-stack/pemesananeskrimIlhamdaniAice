const products = window.products;

let cart = [];
let currentMode = 'satuan'; // 'satuan' or 'karton'

const productList = document.getElementById('mitra-product-list');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

function init() {
    renderProducts();
    updateCartUI();
}

window.setMode = (mode) => {
    currentMode = mode;

    // Update UI buttons
    const btnSatuan = document.getElementById('mode-satuan');
    const btnKarton = document.getElementById('mode-karton');

    if (mode === 'satuan') {
        btnSatuan.className = "px-6 py-2 rounded-xl text-sm font-bold transition-all bg-white text-emerald-900 shadow-sm";
        btnKarton.className = "px-6 py-2 rounded-xl text-sm font-bold transition-all text-emerald-100 hover:text-white";
    } else {
        btnKarton.className = "px-6 py-2 rounded-xl text-sm font-bold transition-all bg-white text-emerald-900 shadow-sm";
        btnSatuan.className = "px-6 py-2 rounded-xl text-sm font-bold transition-all text-emerald-100 hover:text-white";
    }

    renderProducts();
};

function renderProducts() {
    productList.innerHTML = products.map(product => {
        const cartItem = cart.find(i => i.id === product.id && i.mode === currentMode);
        const qty = cartItem ? cartItem.qty : 0;

        return `
            <tr class="hover:bg-emerald-50/50 transition-colors">
                <td class="px-8 py-5">
                    <div class="flex items-center gap-4">
                        <img src="${product.image}" class="w-14 h-14 rounded-xl object-cover shadow-sm">
                        <div>
                            <div class="font-bold text-emerald-900">${product.name}</div>
                            <div class="text-xs text-gray-400 capitalize">${product.category}</div>
                        </div>
                    </div>
                </td>
                <td class="px-8 py-5 text-sm text-gray-500">
                    <span class="bg-gray-100 px-3 py-1 rounded-full font-medium">📦 1 Dus = ${product.itemsPerCarton} Pcs</span>
                </td>
                <td class="px-8 py-5">
                    <div class="text-xs text-gray-400">Grosir</div>
                    <div class="font-bold text-emerald-700">Rp ${product.priceWholesale.toLocaleString('id-ID')}</div>
                </td>
                <td class="px-8 py-5">
                    <div class="text-xs text-gray-400">Per Dus</div>
                    <div class="font-bold text-emerald-900">Rp ${product.priceCarton.toLocaleString('id-ID')}</div>
                </td>
                <td class="px-8 py-5">
                    <div class="flex items-center justify-center bg-gray-100 rounded-xl p-1 w-fit mx-auto border border-gray-200">
                        <button onclick="updateQty(${product.id}, -1)" class="w-10 h-10 flex items-center justify-center font-bold text-emerald-600 hover:bg-white rounded-lg transition-colors">-</button>
                        <div class="w-16 text-center">
                            <span class="block font-bold text-emerald-900">${qty}</span>
                            <span class="text-[10px] text-gray-400 uppercase leading-none">${currentMode}</span>
                        </div>
                        <button onclick="updateQty(${product.id}, 1)" class="w-10 h-10 flex items-center justify-center font-bold text-emerald-600 hover:bg-white rounded-lg transition-colors">+</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

window.updateQty = (id, delta) => {
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(i => i.id === id && i.mode === currentMode);

    if (cartItem) {
        cartItem.qty += delta;
        if (cartItem.qty <= 0) {
            cart = cart.filter(i => !(i.id === id && i.mode === currentMode));
        }
    } else if (delta > 0) {
        cart.push({
            id: product.id,
            name: product.name,
            price: currentMode === 'satuan' ? product.priceWholesale : product.priceCarton,
            mode: currentMode,
            image: product.image,
            qty: 1
        });
    }

    renderProducts();
    updateCartUI();
};

function updateCartUI() {
    // Update badge count
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.innerText = totalItems;

    // Render cart items
    cartItemsContainer.innerHTML = cart.length === 0
        ? '<div class="text-center text-gray-400 py-10 italic">Keranjang mitra kosong</div>'
        : cart.map(item => `
            <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-emerald-900">${item.name}</h4>
                    <span class="bg-emerald-200 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase">${item.mode}</span>
                </div>
                <div class="flex justify-between items-center">
                    <div class="text-sm text-emerald-700">
                        ${item.qty} x Rp ${item.price.toLocaleString('id-ID')}
                    </div>
                    <div class="font-bold text-emerald-900 text-lg">
                        Rp ${(item.qty * item.price).toLocaleString('id-ID')}
                    </div>
                </div>
            </div>
        `).join('');

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
    cartTotal.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

window.handleOrder = (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById('m-name').value,
        shop: document.getElementById('m-shop').value,
        wa: document.getElementById('m-wa').value,
        address: document.getElementById('m-address').value
    };

    let message = `*ORDER MITRA - ICE CREAM DELIGHT*\n`;
    message += `Mohon diproses order grosir kami:\n\n`;
    message += `*Daftar Pesanan:*\n`;

    let total = 0;
    cart.forEach((item, index) => {
        const subtotal = item.qty * item.price;
        message += `${index + 1}. ${item.name} [${item.qty} ${item.mode}] - Rp ${subtotal.toLocaleString('id-ID')}\n`;
        total += subtotal;
    });

    message += `\n*TOTAL PEMBAYARAN: Rp ${total.toLocaleString('id-ID')}*\n\n`;
    message += `*Data Partner:*\n`;
    message += `🏢 Toko: ${data.shop}\n`;
    message += `👤 Admin: ${data.name}\n`;
    message += `📞 WA: ${data.wa}\n`;
    message += `📍 Alamat: ${data.address}\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6287850214715?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
};

init();
