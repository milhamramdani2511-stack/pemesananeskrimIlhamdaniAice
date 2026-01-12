const products = window.products;

let cart = [];

const productGrid = document.getElementById('product-grid');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

function init() {
    renderProducts();
    updateCartUI();
}

function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 product-card border border-sky-100 flex flex-col">
            <div class="relative overflow-hidden h-40">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-500 product-img">
                <div class="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold text-sky-600 shadow-sm">
                    ${product.category}
                </div>
            </div>
            <div class="p-3 flex-grow flex flex-col">
                <h3 class="text-sm font-bold text-sky-900 mb-1 line-clamp-1">${product.name}</h3>
                <div class="text-lg font-bold text-sky-600 mb-3">
                    Rp ${product.priceRetail.toLocaleString('id-ID')}
                </div>
                
                <div class="mt-auto flex items-center justify-between gap-2">
                    <div class="flex items-center bg-sky-50 rounded-lg overflow-hidden border border-sky-200 w-full justify-between px-1">
                        <button onclick="updateQty(${product.id}, -1)" class="w-8 h-8 flex items-center justify-center font-bold text-sky-600 hover:bg-sky-200">-</button>
                        <span id="qty-${product.id}" class="text-sm font-bold text-sky-900">${getQty(product.id)}</span>
                        <button onclick="updateQty(${product.id}, 1)" class="w-8 h-8 flex items-center justify-center font-bold text-sky-600 hover:bg-sky-200">+</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

window.getQty = (id) => {
    const item = cart.find(i => i.id === id);
    return item ? item.qty : 0;
};

window.updateQty = (id, delta) => {
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(i => i.id === id);

    if (cartItem) {
        cartItem.qty += delta;
        if (cartItem.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    } else if (delta > 0) {
        cart.push({ ...product, qty: 1 });
    }

    // Update UI for the specific product card
    const qtySpan = document.getElementById(`qty-${id}`);
    if (qtySpan) qtySpan.innerText = getQty(id);

    updateCartUI();
};

function updateCartUI() {
    // Update badge count
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.innerText = totalItems;

    // Render cart items
    cartItemsContainer.innerHTML = cart.length === 0
        ? '<div class="text-center text-gray-400 py-10 italic">Belum ada pesanan</div>'
        : cart.map(item => `
            <div class="flex items-center gap-4 bg-sky-50 p-3 rounded-2xl border border-sky-100">
                <img src="${item.image}" class="w-16 h-16 rounded-xl object-cover">
                <div class="flex-grow">
                    <h4 class="font-bold text-sky-900 text-sm">${item.name}</h4>
                    <div class="text-sky-600 text-sm font-bold">
                        ${item.qty} x Rp ${item.priceRetail.toLocaleString('id-ID')}
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-sky-900">
                        Rp ${(item.qty * item.priceRetail).toLocaleString('id-ID')}
                    </div>
                </div>
            </div>
        `).join('');

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.qty * item.priceRetail), 0);
    cartTotal.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

window.handleOrder = (e) => {
    e.preventDefault();

    const name = document.getElementById('cust-name').value;
    const wa = document.getElementById('cust-wa').value;
    const address = document.getElementById('cust-address').value;
    const notes = document.getElementById('cust-notes').value;

    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    let message = `*HALO ICE CREAM DELIGHT!*\n`;
    message += `Saya ingin memesan es krim:\n\n`;
    message += `*Detail Pesanan:*\n`;

    let total = 0;
    cart.forEach((item, index) => {
        const subtotal = item.qty * item.priceRetail;
        message += `${index + 1}. ${item.name} (${item.qty} pcs) - Rp ${subtotal.toLocaleString('id-ID')}\n`;
        total += subtotal;
    });

    message += `\n*Total Tagihan: Rp ${total.toLocaleString('id-ID')}*\n\n`;
    message += `*Data Pengiriman:*\n`;
    message += `👤 Nama: ${name}\n`;
    message += `📞 WA: ${wa}\n`;
    message += `📍 Alamat: ${address}\n`;
    if (notes) message += `📝 Catatan: ${notes}\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6287850214715?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
};

init();
