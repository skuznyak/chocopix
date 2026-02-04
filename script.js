// --- Data Constants ---
const PRODUCTS = [
    {
        id: '1',
        category: 'КЛАСИКА',
        title: 'Класичний Молочний Шоколад',
        description: 'Ніжний молочний шоколад з маршмеллоу всередині. Ідеально розчиняється в гарячому молоці.',
        price: 145,
        oldPrice: 180,
        image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=400',
        isBestseller: true,
        isSuperPrice: true
    },
    {
        id: '2',
        category: 'КЛАСИКА',
        title: 'Темний Бельгійський з Какао',
        description: '70% какао для справжніх поціновувачів насиченого смаку темного шоколаду.',
        price: 160,
        image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=400',
        isBestseller: true
    },
    {
        id: '3',
        category: 'ГОРІХОВІ',
        title: 'Солона Карамель та Фундук',
        description: 'Вибух смаку з подрібненим фундуком та домашньою солоною карамеллю.',
        price: 185,
        oldPrice: 210,
        image: 'https://images.unsplash.com/photo-1623156346149-d5bc8bd2723a?auto=format&fit=crop&q=80&w=400',
        isBestseller: true,
        isSuperPrice: true
    },
    {
        id: '4',
        category: 'ФРУКТОВІ',
        title: 'Полуничний Мус',
        description: 'Білий шоколад з натуральним екстрактом полуниці та солодким сюрпризом.',
        price: 155,
        image: 'https://images.unsplash.com/photo-1549007994-cb92cfd38457?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: '5',
        category: 'КЛАСИКА',
        title: 'Молочний з Кокосом',
        description: 'Екзотичний смак кокосової стружки у поєднанні з бельгійським молочним шоколадом.',
        price: 165,
        image: 'https://images.unsplash.com/photo-1582176604447-aa5144675a69?auto=format&fit=crop&q=80&w=400'
    }
];

const CATEGORIES = [
    { id: 'all', label: 'ВСІ ТОВАРИ', icon: '🍫' },
    { id: 'classic', label: 'КЛАСИКА', icon: '🥛' },
    { id: 'fruit', label: 'ФРУКТОВІ', icon: '🍓' },
    { id: 'nut', label: 'ГОРІХОВІ', icon: '🥜' },
    { id: 'sets', label: 'НАБОРИ', icon: '🎁' },
];



// --- State ---
let cart = [];

let activeCategory = 'all';

// --- DOM Elements ---
const views = {
    home: document.getElementById('home-view'),
    checkout: document.getElementById('checkout-view'),
    details: document.getElementById('details-view')
};

const cartComponents = {
    sidebar: document.getElementById('cart-sidebar'),
    overlay: document.getElementById('cart-overlay'),
    count: document.getElementById('cart-count'),
    itemsSidebar: document.getElementById('cart-items'),
    totalSidebar: document.getElementById('cart-total-price'),
    itemsCheckout: document.getElementById('checkout-cart-items'),
    totalCheckout: document.getElementById('checkout-total'),
    dropdown: document.querySelector('.cart-dropdown-content')
};

const modals = {
    call: document.getElementById('call-modal'),
    auth: document.getElementById('auth-modal'),
    success: document.getElementById('success-modal'),
    overlay: document.getElementById('modal-overlay')
}

// --- Initialization ---
function init() {

    // renderFilters();
    renderProducts();
    updateCartUI();

    // Filter Listeners (removed)
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = link.getAttribute('data-filter');
            navigateTo('home');
            setCategory(filter);
        });
    });

    // Mobile Menu Filters
    document.querySelector('#mobile-menu').addEventListener('click', (e) => {
        if (e.target.tagName === 'A') toggleMobileMenu();
    });
}

window.scrollToProducts = function () {
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// --- Navigation & View Switching ---
window.navigateTo = function (viewName) {
    Object.values(views).forEach(el => el.classList.add('hidden'));
    if (views[viewName]) {
        views[viewName].classList.remove('hidden');
        if (viewName === 'details') {
            views[viewName].classList.add('products-section'); // reuse container style
        }
    }
    window.scrollTo(0, 0);
    if (viewName === 'checkout') updateCartUI();
}

// --- Slider Logic ---


// --- Products & Filters ---
// function renderFilters() { ... } removed


window.setCategory = function (id) {
    activeCategory = id;
    // renderFilters(); // removed
    renderProducts();

    document.querySelectorAll('.nav-item').forEach(el => {
        if (el.getAttribute('data-filter') === id) el.classList.add('active');
        else el.classList.remove('active');
    });
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    const categoryLabels = {
        'classic': 'КЛАСИКА',
        'fruit': 'ФРУКТОВІ',
        'nut': 'ГОРІХОВІ',
        'sets': 'НАБОРИ'
    };

    let filtered = PRODUCTS;
    if (activeCategory !== 'all') {
        const label = categoryLabels[activeCategory];
        filtered = PRODUCTS.filter(p => p.category === label);
    }

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">Товари відсутні</p>';
        return;
    }

    grid.innerHTML = filtered.map(product => `
          <div onclick="openProductDetails('${product.id}')" class="product-card">
              <div class="card-image-wrapper">
                  <img src="${product.image}" alt="${product.title}" class="card-image">
                  <div class="card-badges">
                      ${product.isBestseller ? '<span class="badge hit">ХІТ ПРОДАЖУ</span>' : ''}
                      ${product.isSuperPrice ? '<span class="badge super">СУПЕРЦІНА</span>' : ''}
                  </div>
              </div>
              <div class="card-category">${product.category}</div>
              <h3 class="card-title">${product.title}</h3>
              <div class="card-bottom">
                  <div class="price-box">
                      ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ₴</span>` : ''}
                      <span class="price">${product.price} ₴</span>
                  </div>
                  <button onclick="addToCart(event, '${product.id}')" class="add-btn">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                      Додати в кошик
                  </button>
              </div>
          </div>
      `).join('');
}

// --- Product Details View ---
window.openProductDetails = function (id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    // FOR DJANGO / STATIC HTML STRUCTURE:
    // We do NOT inject HTML here anymore. We assume the HTML structure is already present in #details-view.
    // In a real Django app, you would navigate to a new URL /product/<id>.
    // Here, we just switch the view. The content of #details-view is static for demonstration purposes.

    navigateTo('details');
}

window.updateDetailQty = function (delta) {
    const input = document.getElementById('detail-qty-input');
    const totalEl = document.getElementById('detail-total-price');
    if (!input || !totalEl) return;

    let val = parseInt(input.value) || 1;
    val += delta;
    if (val < 1) val = 1;

    input.value = val;
    // Hardcoded price 160 for demo
    totalEl.textContent = (val * 160) + ' ₴';
}

window.switchTab = function (event, tabId) {
    // Remove active state from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    // Add active state to clicked button
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    // Hide all tab content items
    document.querySelectorAll('.tab-content-item').forEach(item => item.classList.add('hidden'));
    // Show the target tab content
    const target = document.getElementById(tabId);
    if (target) {
        target.classList.remove('hidden');
    }
}

// --- Cart System ---
window.addToCart = function (e, id, qty = 1) {
    if (e) e.stopPropagation();
    const product = PRODUCTS.find(p => p.id === id);
    const existing = cart.find(i => i.id === id);

    if (existing) existing.quantity += qty;
    else cart.push({ ...product, quantity: qty });

    updateCartUI();

    // Button animation
    if (e && e.target) {
        const btn = e.target.closest('button');
        if (btn) {
            const originalText = btn.innerHTML;
            const originalWidth = btn.offsetWidth; // Keep width to prevent jump
            btn.style.width = `${originalWidth}px`;
            btn.classList.add('added');
            btn.innerHTML = `
                <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                         <!-- Face (White) -->
                         <circle cx="50" cy="50" r="50" fill="white"/>
                         <!-- Eyes (Transparent/Dark - technically using the button background color would require mask or matching color. Let's use the button's text color which is usually white on dark, wait. 
                         The button is green-ish or dark. If I make the face white, I need eyes to be dark. 
                         Let's use the secondary brown or just transparent if possible? 
                         Simple way: Face White, Eyes/Mouth colored same as button background (which changes).
                         Actually, let's just make Face White, and Eyes/Mouth #337a33 (the green color) or just dark. 
                         Better: Face White, Eyes/Mouth fill with 'currentColor' (which is white) -> NO, that would disappear. 
                         Let's just use the dark brown for eyes/mouth to be consistent with the brand, or transparent using a mask?
                         Mask is complex. Let's use the brand dark brown for eyes/mouth, it will pop against the white face. -->
                         <circle cx="32" cy="35" r="7" fill="#2d1a10"/>
                         <circle cx="68" cy="35" r="7" fill="#2d1a10"/>
                         <path d="M18 52 H82 C82 75 62 78 54 88 V100 H46 V88 C38 78 18 75 18 52 Z" fill="#2d1a10"/>
                    </svg>
                </div>
                Додано
            `;

            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = originalText;
                btn.style.width = '';
            }, 1500);
        }
    }
    // Sidebar auto-open removed as per user request
}

window.removeFromCart = function (id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

window.updateQty = function (id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) removeFromCart(id);
        else updateCartUI();
    }
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    cartComponents.count.textContent = totalCount;
    if (totalCount > 0) cartComponents.count.style.display = 'flex';
    else cartComponents.count.style.display = 'none';

    // Sidebar content
    if (totalCount === 0) {
        cartComponents.itemsSidebar.innerHTML = `
            <div class="empty-cart-state">
                <div style="position: relative; width: 100px; height: 100px; margin: 0 auto 1.5rem;">
                     <!-- Logo "Inside" Cart (Background Layer) -->
                    <div style="position: absolute; top: 15%; left: 50%; transform: translateX(-40%) rotate(-15deg); width: 45px; height: 45px; z-index: 1;">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%;">
                            <!-- Face Background -->
                            <circle cx="50" cy="50" r="50" fill="#fce7cf"/>
                            <!-- Eyes -->
                            <circle cx="32" cy="35" r="7" fill="rgb(93, 64, 55)"/>
                            <circle cx="68" cy="35" r="7" fill="rgb(93, 64, 55)"/>
                            <!-- Glass/Smile -->
                            <path d="M18 52 H82 C82 75 62 78 54 88 V100 H46 V88 C38 78 18 75 18 52 Z" fill="rgb(93, 64, 55)"/>
                        </svg>
                    </div>

                    <!-- Cart Icon (Foreground Layer) -->
                    <svg viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width: 100%; height: 100%; position: relative; z-index: 2;">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </div>
                <p>Ваш кошик порожній</p>
                <button onclick="toggleCart(); navigateTo('home')" class="return-btn">
                    Повернутись до покупок
                </button>
            </div>
          `;
        cartComponents.totalSidebar.parentElement.parentElement.style.display = 'none'; // Hide footer
    } else {
        cartComponents.itemsSidebar.innerHTML = cart.map(item => `
              <div class="cart-item">
                  <img src="${item.image}" alt="${item.title}">
                  <div class="cart-item-info">
                      <div class="cart-item-title">${item.title}</div>
                       <div class="cart-controls">
                            <div style="display:flex; align-items:center; gap:0.5rem;">
                                <button class="qty-btn sidebar-qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
                                <span>${item.quantity}</span>
                                <button class="qty-btn sidebar-qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
                            </div>
                            <div style="font-weight:bold;">${item.price * item.quantity} ₴</div>
                       </div>
                  </div>
                  <button class="remove-btn" onclick="removeFromCart('${item.id}')">✕</button>
              </div>
          `).join('');
        cartComponents.totalSidebar.parentElement.parentElement.style.display = 'block'; // Show footer
        cartComponents.totalSidebar.textContent = totalPrice + ' ₴';
    }

    // Checkout
    // Checkout
    if (!views.checkout.classList.contains('hidden')) {
        cartComponents.itemsCheckout.innerHTML = cart.map(item => `
               <div class="summary-item">
                   <img src="${item.image}" alt="${item.title}" class="summary-img">
                   <div class="summary-details">
                       <div class="summary-title">${item.title}</div>
                       <div class="summary-meta">
                           <div class="checkout-qty-controls">
                               <button class="checkout-qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
                               <span class="checkout-qty-val">${item.quantity}</span>
                               <button class="checkout-qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
                           </div>
                           <span class="summary-price">${item.price * item.quantity} ₴</span>
                       </div>
                   </div>
               </div>
           `).join('');

        // --- Free Delivery Logic ---
        const FREE_DELIVERY_GOAL = 2000;
        const progressWidget = document.getElementById('free-delivery-widget');

        if (progressWidget) {
            progressWidget.classList.remove('hidden');
            const percent = Math.min((totalPrice / FREE_DELIVERY_GOAL) * 100, 100);

            document.getElementById('fd-progress').style.width = `${percent}%`;
            document.getElementById('fd-current').textContent = totalPrice;

            const msgEl = document.getElementById('fd-message');
            if (totalPrice >= FREE_DELIVERY_GOAL) {
                msgEl.innerHTML = '<span class="fd-bold" style="color:var(--primary)">У вас безкоштовна доставка!</span>';
                const freeText = document.querySelector('.free-text');
                if (freeText) {
                    freeText.textContent = "Безкоштовно";
                    freeText.style.color = "#337a33";
                    freeText.style.fontWeight = "bold";
                }
            } else {
                const diff = FREE_DELIVERY_GOAL - totalPrice;
                msgEl.innerHTML = `Додайте ще <span id="fd-remaining" class="fd-bold">${diff} ₴</span> для безкоштовної доставки`;
                const freeText = document.querySelector('.free-text');
                if (freeText) {
                    freeText.textContent = "За тарифами перевізника";
                    freeText.style.color = "inherit";
                    freeText.style.fontWeight = "normal";
                }
            }
        }

        const subtotalEl = document.getElementById('checkout-subtotal');
        if (subtotalEl) subtotalEl.textContent = totalPrice + ' ₴';

        cartComponents.totalCheckout.textContent = totalPrice + ' ₴';
    }

    // Dropdown Render
    if (cartComponents.dropdown) {
        if (cart.length === 0) {
            cartComponents.dropdown.innerHTML = '<p class="empty-msg">Кошик порожній</p>';
        } else {
            const dropdownItems = cart.map(item => `
                <div class="preview-item">
                    <img src="${item.image}" class="preview-img">
                    <div class="preview-info">
                        <div class="preview-title">${item.title}</div>
                        <div class="preview-details" style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                            <div class="sidebar-qty-controls" style="display: flex; align-items: center; gap: 0.5rem;">
                                <button class="sidebar-qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
                                <span style="font-weight: 600; min-width: 1rem; text-align: center;">${item.quantity}</span>
                                <button class="sidebar-qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
                            </div>
                            <span class="preview-price" style="font-weight: bold;">${item.quantity * item.price} ₴</span>
                        </div>
                    </div>
                </div>
            `).join('');

            cartComponents.dropdown.innerHTML = `
                <div class="cart-dropdown-header">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    Ваше замовлення
                </div>
                ${dropdownItems}
                <div class="preview-total-row">
                    <span class="preview-total-label">Разом:</span>
                    <span class="preview-total-amount">${totalPrice} ₴</span>
                </div>
                <button onclick="navigateTo('checkout'); toggleCart()" class="preview-btn">Оформити замовлення</button>
            `;
        }
    }
}

// --- UI Interactivity ---
window.toggleCart = function () {
    cartComponents.sidebar.classList.toggle('hidden');
    cartComponents.overlay.classList.toggle('hidden');
    document.body.style.overflow = cartComponents.sidebar.classList.contains('hidden') ? '' : 'hidden';
}

window.toggleMobileMenu = function () {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

window.openCallModal = function () {
    modals.call.classList.remove('hidden');
    modals.overlay.classList.remove('hidden');
}
window.openAuthModal = function () {
    modals.auth.classList.remove('hidden');
    modals.overlay.classList.remove('hidden');
}
// ... existing init ... (modals already declared at top)

window.closeModals = function () {
    modals.call.classList.add('hidden');
    modals.auth.classList.add('hidden');
    modals.success.classList.add('hidden');
    modals.overlay.classList.add('hidden');
}

window.handleCallSubmit = function (e) {
    e.preventDefault();
    // Close form modal but keep overlay if we want smoothness, 
    // or just swap them.
    modals.call.classList.add('hidden');

    // Show success modal
    modals.success.classList.remove('hidden');
    modals.overlay.classList.remove('hidden');
}

window.switchAuthTab = function (tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'login') {
        tabs[0].classList.add('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        tabs[1].classList.add('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
}

window.handleAuthSubmit = function (e, type) {
    e.preventDefault();
    closeModals();
    const msg = type === 'register' ? 'Акаунт успішно створено!' : 'Вхід виконано успішно!';
    showNotification(msg);
}

document.addEventListener('DOMContentLoaded', init);

/* --- Checkout Redesign Logic --- */
window.toggleDeliveryInputs = function (method) {
    // Hide all groups
    document.querySelectorAll('.delivery-inputs-group').forEach(el => el.classList.add('hidden'));

    // Show selected
    const target = document.getElementById('delivery-' + method);
    if (target) target.classList.remove('hidden');

    // Update active state visual
    document.querySelectorAll('input[name="delivery"]').forEach(input => {
        const card = input.closest('.method-card');
        if (input.checked) card.classList.add('active');
        else card.classList.remove('active');
    });
}

// Payment method active state listener
document.addEventListener('change', (e) => {
    if (e.target.name === 'payment') {
        document.querySelectorAll('input[name="payment"]').forEach(input => {
            const row = input.closest('.payment-method-row');
            if (input.checked) {
                row.style.borderColor = 'var(--primary)';
                row.style.background = '#fffcf9';
            } else {
                row.style.borderColor = '#e5e7eb';
                row.style.background = 'white';
            }
        });
    }
});
