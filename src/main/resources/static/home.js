/* ========================================================
   UniTrade – Home Page JavaScript
   Wires the UI to the Spring Boot backend (/api/auth/*)
   ======================================================== */

// ─── STATE ───────────────────────────────────────────────
const state = {
    currentUser: null,          // {id, firstName, lastName, universityEmail}
    currentView: 'products',    // 'products' | 'sell' | 'orders' | 'detail'
    currentCategory: 'All',
    currentSearchTerm: '',
    currentPage: 1,
    itemsPerPage: 5,
    selectedProduct: null,
    wishlist: [],
    // Local product data (frontend-only until items API exists)
    productsData: [
        { id: 1,  name: "Autos Wireless",   price: 540.90, originalPrice: 600.00,  category: "Home",       isUserListed: false, description: "Wireless audio system in excellent condition. Barely used, comes with original packaging." },
        { id: 2,  name: "Smart Watch PVR",  price: 600.00, originalPrice: 1250.00, category: "Electronics",isUserListed: false, description: "Smart watch with heart rate monitor, GPS, and 7-day battery life. Minor scuff on the band." },
        { id: 3,  name: "Controller Elite", price: 544.99, originalPrice: 850.00,  category: "Electronics",isUserListed: false, description: "Elite gaming controller, excellent build quality. All buttons fully functional." },
        { id: 4,  name: "AirPods Pro",      price: 844.99, originalPrice: 850.00,  category: "Electronics",isUserListed: false, description: "Active noise-cancelling earbuds. 90% battery capacity retained." },
        { id: 5,  name: "AirPods Max",      price: 843.99, originalPrice: 850.00,  category: "Electronics",isUserListed: false, description: "Over-ear headphones with spatial audio. Comes with case." },
        { id: 6,  name: "Classic Tee",      price: 29.99,  originalPrice: 49.99,   category: "Shirts",     isUserListed: false, description: "100% cotton classic-fit t-shirt, washed twice. Size M." },
        { id: 7,  name: "Denim Jacket",     price: 79.99,  originalPrice: 129.99,  category: "Mens Wear",  isUserListed: false, description: "Slim-fit denim jacket, dark wash. Light wear, no damage. Size L." },
        { id: 8,  name: "Floral Dress",     price: 59.99,  originalPrice: 99.99,   category: "Women Wear", isUserListed: false, description: "Light summer floral dress. Worn once. Size S." },
        { id: 9,  name: "Running Shoes",    price: 89.99,  originalPrice: 149.99,  category: "Shoes",      isUserListed: false, description: "Nike running shoes, used for 3 months. Size 9." },
        { id: 10, name: "Leather Sofa",     price: 499.99, originalPrice: 799.99,  category: "Furniture",  isUserListed: false, description: "3-seater leather sofa in good condition. Self-pickup only." },
        { id: 11, name: "Smart Lamp",       price: 39.99,  originalPrice: 69.99,   category: "Home",       isUserListed: false, description: "Wi-Fi smart lamp with adjustable colour temperature." },
        { id: 12, name: "Casual Shorts",    price: 34.99,  originalPrice: 59.99,   category: "Clothes",    isUserListed: false, description: "Lightweight casual shorts, barely worn. Size M." }
    ],
    nextId: 13
};

const categoriesList = ["All", "Home", "Furniture", "Shirts", "Mens Wear", "Women Wear", "Shoes", "Clothes", "Electronics", "Accessories", "Books", "Stationery"];

// ─── DOM HELPERS ─────────────────────────────────────────
const $ = id => document.getElementById(id);
const show = el => el && el.classList.remove('hidden');
const hide = el => el && el.classList.add('hidden');

function escapeHtml(str = '') {
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ─── TOAST ───────────────────────────────────────────────
function showToast(message, type = 'default') {
    const container = $('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${escapeHtml(message)}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3100);
}

// ─── VIEW SWITCHING ──────────────────────────────────────
function switchView(viewName) {
    const views = ['products', 'sell', 'orders', 'detail'];
    views.forEach(v => {
        const el = $(`view${capitalize(v)}`);
        if (el) {
            el.classList.toggle('active-view', v === viewName);
            el.classList.toggle('hidden-view', v !== viewName);
        }
    });

    // Update nav links (don't mark "detail" as active)
    document.querySelectorAll('.nav-link').forEach(link => {
        const lv = link.dataset.view;
        link.classList.toggle('active', lv === viewName);
    });

    state.currentView = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

// ─── NAV LINKS ───────────────────────────────────────────
function initNavLinks() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            switchView(link.dataset.view);
        });
    });

    $('brandLink').addEventListener('click', e => { e.preventDefault(); switchView('products'); });
    $('browseProductsBtn').addEventListener('click', () => switchView('products'));
    $('backToProducts').addEventListener('click', e => { e.preventDefault(); switchView('products'); });
}

// ─── AUTH MODAL ──────────────────────────────────────────
function openModal(panel = 'login') {
    show($('authModal'));
    showAuthPanel(panel);
}

function closeModal() { hide($('authModal')); }

function showAuthPanel(name) {
    ['loginPanel', 'registerPanel', 'forgotPanel'].forEach(p => hide($(p)));
    show($(name + 'Panel'));
    // Clear errors
    ['loginError', 'regError', 'forgotSuccess'].forEach(e => { const el = $(e); if (el) { hide(el); el.textContent = ''; } });
}

function initAuthModal() {
    $('signInBtn').addEventListener('click', () => openModal('login'));
    $('registerBtn').addEventListener('click', () => openModal('register'));
    $('modalClose').addEventListener('click', closeModal);
    $('authModal').addEventListener('click', e => { if (e.target === $('authModal')) closeModal(); });

    // Panel switches
    $('toForgot').addEventListener('click', e => { e.preventDefault(); showAuthPanel('forgot'); });
    $('toRegister').addEventListener('click', e => { e.preventDefault(); showAuthPanel('register'); });
    $('toLogin').addEventListener('click', e => { e.preventDefault(); showAuthPanel('login'); });
    $('backToLogin').addEventListener('click', e => { e.preventDefault(); showAuthPanel('login'); });

    // Password toggles
    document.querySelectorAll('.pw-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = $(btn.dataset.target);
            if (!input) return;
            const isText = input.type === 'text';
            input.type = isText ? 'password' : 'text';
            btn.innerHTML = isText ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    });

    // Login submit
    $('loginSubmit').addEventListener('click', handleLogin);

    // Register submit
    $('regSubmit').addEventListener('click', handleRegister);

    // Forgot submit
    $('forgotSubmit').addEventListener('click', handleForgot);
}

async function handleLogin() {
    const email = $('loginEmail').value.trim();
    const password = $('loginPassword').value.trim();
    const errEl = $('loginError');

    hide(errEl);

    if (!email || !password) {
        show(errEl); errEl.textContent = 'Please fill in all fields.'; return;
    }

    setLoading('loginSubmit', true);

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ universityEmail: email, password })
        });

        if (res.ok) {
            const user = await res.json();
            state.currentUser = user;
            closeModal();
            updateNavForUser(user);
            showToast(`Welcome back, ${user.firstName}!`, 'success');
            $('loginEmail').value = '';
            $('loginPassword').value = '';
        } else {
            const msg = await res.text();
            show(errEl);
            errEl.textContent = msg || 'Invalid credentials. Please try again.';
        }
    } catch (err) {
        show(errEl);
        errEl.textContent = 'Unable to connect. Is the server running?';
    } finally {
        setLoading('loginSubmit', false);
    }
}

async function handleRegister() {
    const firstName = $('regFirstName').value.trim();
    const lastName  = $('regLastName').value.trim();
    const email     = $('regEmail').value.trim();
    const password  = $('regPassword').value.trim();
    const confirm   = $('regConfirmPassword').value.trim();
    const errEl     = $('regError');

    hide(errEl);

    if (!firstName || !lastName || !email || !password || !confirm) {
        show(errEl); errEl.textContent = 'Please fill in all fields.'; return;
    }
    if (password !== confirm) {
        show(errEl); errEl.textContent = 'Passwords do not match.'; return;
    }
    if (password.length < 6) {
        show(errEl); errEl.textContent = 'Password must be at least 6 characters.'; return;
    }

    setLoading('regSubmit', true);

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, universityEmail: email, password })
        });

        if (res.ok) {
            showToast('Account created! Please sign in.', 'success');
            // Clear form then switch to login
            ['regFirstName','regLastName','regEmail','regPassword','regConfirmPassword'].forEach(id => $(id).value = '');
            showAuthPanel('login');
        } else {
            const msg = await res.text();
            show(errEl);
            errEl.textContent = msg || 'Registration failed. Please try again.';
        }
    } catch (err) {
        show(errEl);
        errEl.textContent = 'Unable to connect. Is the server running?';
    } finally {
        setLoading('regSubmit', false);
    }
}

function handleForgot() {
    const email   = $('forgotEmail').value.trim();
    const successEl = $('forgotSuccess');

    hide(successEl);

    if (!email) {
        show(successEl); successEl.className = 'auth-error'; successEl.textContent = 'Please enter your email address.'; return;
    }

    // Simulate email send (no backend endpoint yet)
    successEl.className = 'auth-success';
    successEl.textContent = 'If this email is registered, a reset link has been sent.';
    show(successEl);
    $('forgotEmail').value = '';
}

// ─── NAV USER STATE ──────────────────────────────────────
function updateNavForUser(user) {
    const actions = $('navActions');
    actions.innerHTML = `
        <div class="nav-user-area">
            <div class="user-avatar" title="${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}">
                ${escapeHtml(user.firstName.charAt(0).toUpperCase())}${escapeHtml(user.lastName.charAt(0).toUpperCase())}
            </div>
            <span class="nav-username">${escapeHtml(user.firstName)}</span>
            <button class="btn-logout" id="logoutBtn">Logout</button>
        </div>
    `;
    $('logoutBtn').addEventListener('click', handleLogout);
}

function handleLogout() {
    state.currentUser = null;
    const actions = $('navActions');
    actions.innerHTML = `
        <button class="btn-outline" id="signInBtn">Sign In</button>
        <button class="btn-filled" id="registerBtn">Register</button>
    `;
    $('signInBtn').addEventListener('click', () => openModal('login'));
    $('registerBtn').addEventListener('click', () => openModal('register'));
    showToast('You have been logged out.', 'default');
}

// ─── LOADING STATE ───────────────────────────────────────
function setLoading(btnId, loading) {
    const btn  = $(btnId);
    if (!btn) return;
    const text = btn.querySelector('.btn-text');
    const spin = btn.querySelector('.btn-spinner');
    btn.disabled = loading;
    if (text) text.style.opacity = loading ? '0.5' : '1';
    if (spin) spin.classList.toggle('hidden', !loading);
}

// ─── CATEGORY FILTERS ────────────────────────────────────
function initCategoryFilters() {
    const catContainer = $('categoryList');
    if (!catContainer) return;

    catContainer.innerHTML = '';
    categoriesList.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `cat-btn${state.currentCategory === cat ? ' active' : ''}`;
        const icon = getCategoryIcon(cat);
        btn.innerHTML = `<i class="${icon}"></i> ${escapeHtml(cat)}`;
        btn.addEventListener('click', () => {
            state.currentCategory = cat;
            state.currentPage = 1;
            renderProducts();
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
        catContainer.appendChild(btn);
    });
}

function getCategoryIcon(cat) {
    const map = {
        'All': 'fas fa-border-all', 'Home': 'fas fa-home', 'Furniture': 'fas fa-couch',
        'Shirts': 'fas fa-shirt', 'Mens Wear': 'fas fa-male', 'Women Wear': 'fas fa-female',
        'Shoes': 'fas fa-shoe-prints', 'Clothes': 'fas fa-hanger', 'Electronics': 'fas fa-microchip',
        'Accessories': 'fas fa-gem', 'Books': 'fas fa-book', 'Stationery': 'fas fa-pen'
    };
    return map[cat] || 'fas fa-tag';
}

// ─── PRODUCTS ────────────────────────────────────────────
function getFilteredProducts() {
    let list = [...state.productsData];
    if (state.currentCategory !== 'All') {
        list = list.filter(p => p.category === state.currentCategory);
    }
    if (state.currentSearchTerm.trim()) {
        const term = state.currentSearchTerm.trim().toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(term));
    }
    return list;
}

function renderProducts() {
    const filtered = getFilteredProducts();
    const total = filtered.length;
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const paged = filtered.slice(start, start + state.itemsPerPage);
    const container = $('productsGridContainer');
    if (!container) return;

    if (paged.length === 0) {
        container.innerHTML = `<div class="no-results"><i class="fas fa-box-open"></i>No products found<br><small>Try another category or search term</small></div>`;
    } else {
        container.innerHTML = paged.map(p => renderProductCard(p)).join('');
        // Attach click handlers
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const pid = parseInt(card.dataset.id);
                const product = state.productsData.find(p => p.id === pid);
                if (product) openProductDetail(product);
            });
        });
    }
    updatePagination(total);
}

function renderProductCard(p) {
    const discount = ((p.originalPrice - p.price) / p.originalPrice * 100).toFixed(0);
    const hasDiscount = p.originalPrice > p.price;
    return `
    <div class="product-card" data-id="${p.id}">
        ${p.isUserListed ? '<div class="listing-badge"><i class="fas fa-user-plus"></i> Listed by You</div>' : ''}
        <div class="card-img">
            ${p.imageUrl ? `<img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.name)}" loading="lazy">` : `
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7L12 12L4 7M20 7V17L12 22L4 17V7M20 7L12 2L4 7" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`}
        </div>
        <div class="card-info">
            <div class="product-title">${escapeHtml(p.name)}</div>
            <div class="price-row">
                <span class="current-price">R${p.price.toFixed(2)}</span>
                ${hasDiscount ? `<span class="old-price">R${p.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            ${hasDiscount ? `<div class="discount-badge">-${discount}% OFF</div>` : '<div style="height:22px"></div>'}
        </div>
    </div>`;
}

function updatePagination(total) {
    const totalPages = Math.ceil(total / state.itemsPerPage);
    const startIdx = total === 0 ? 0 : (state.currentPage - 1) * state.itemsPerPage + 1;
    const endIdx = Math.min(state.currentPage * state.itemsPerPage, total);

    const info = $('showingRangeInfo');
    const prev = $('prevPageBtn');
    const next = $('nextPageBtn');

    if (info) info.textContent = total === 0 ? 'No results' : `Showing ${startIdx} to ${endIdx} of ${total} results`;
    if (prev) prev.disabled = state.currentPage === 1;
    if (next) next.disabled = state.currentPage >= totalPages || totalPages === 0;

    if (state.currentPage > totalPages && totalPages > 0) {
        state.currentPage = totalPages;
        renderProducts();
    }
}

function initPagination() {
    $('prevPageBtn').addEventListener('click', () => {
        if (state.currentPage > 1) { state.currentPage--; renderProducts(); }
    });
    $('nextPageBtn').addEventListener('click', () => {
        const total = getFilteredProducts().length;
        const totalPages = Math.ceil(total / state.itemsPerPage);
        if (state.currentPage < totalPages) { state.currentPage++; renderProducts(); }
    });
}

function initSearch() {
    const input = $('searchInput');
    if (!input) return;
    input.addEventListener('input', e => {
        state.currentSearchTerm = e.target.value;
        state.currentPage = 1;
        renderProducts();
    });
}

// ─── PRODUCT DETAIL ──────────────────────────────────────
function openProductDetail(product) {
    state.selectedProduct = product;

    // Breadcrumb
    $('detailBreadcrumbName').textContent = product.name;

    // Category & title
    $('detailCategory').textContent = product.category.toUpperCase();
    $('detailTitle').textContent = product.name;

    // Price
    const discount = ((product.originalPrice - product.price) / product.originalPrice * 100).toFixed(0);
    const hasDiscount = product.originalPrice > product.price;
    $('detailPrice').textContent = `R${product.price.toFixed(2)}`;
    $('detailOriginalPrice').textContent = `R${product.originalPrice.toFixed(2)}`;
    $('detailOriginalPrice').style.display = hasDiscount ? 'inline' : 'none';
    $('detailDiscountBadge').textContent = `-${discount}% OFF`;
    $('detailDiscountBadge').style.display = hasDiscount ? 'inline' : 'none';

    // Description
    $('detailDescription').textContent = product.description || 'No description provided by the seller.';

    // Seller & date
    const sellerName = product.isUserListed && state.currentUser
        ? `${state.currentUser.firstName} ${state.currentUser.lastName}`
        : 'Community Member';
    $('detailSeller').textContent = sellerName;
    $('detailListed').textContent = product.listedAt ? formatDate(product.listedAt) : 'recently';

    // Gallery
    const galleryMain = $('galleryMain');
    if (product.imageUrl) {
        galleryMain.innerHTML = `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}">`;
    } else {
        galleryMain.innerHTML = `<div class="gallery-placeholder"><i class="fas fa-image"></i></div>`;
    }

    // Related products
    renderRelatedProducts(product);

    switchView('detail');
}

function renderRelatedProducts(current) {
    const related = state.productsData
        .filter(p => p.category === current.category && p.id !== current.id)
        .slice(0, 3);
    const grid = $('relatedGrid');
    if (!grid) return;

    if (related.length === 0) {
        grid.innerHTML = '<p style="color:var(--muted);font-size:0.875rem;">No related products found.</p>';
        return;
    }

    grid.innerHTML = related.map(p => `
    <div class="product-card" data-id="${p.id}" style="cursor:pointer">
        <div class="card-img" style="height:120px">
            ${p.imageUrl ? `<img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.name)}">` : `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M20 7L12 12L4 7M20 7V17L12 22L4 17V7M20 7L12 2L4 7" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
        </div>
        <div class="card-info">
            <div class="product-title" style="font-size:0.9rem">${escapeHtml(p.name)}</div>
            <div class="price-row"><span class="current-price" style="font-size:1rem">R${p.price.toFixed(2)}</span></div>
        </div>
    </div>`).join('');

    grid.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const pid = parseInt(card.dataset.id);
            const product = state.productsData.find(p => p.id === pid);
            if (product) openProductDetail(product);
        });
    });
}

function formatDate(dateStr) {
    try {
        const d = new Date(dateStr);
        const diff = (Date.now() - d.getTime()) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    } catch { return 'recently'; }
}

// ─── SELL FORM ───────────────────────────────────────────
function initSellForm() {
    const form = $('sellForm');
    if (!form) return;

    // Image upload zone
    const zone = $('imageUploadZone');
    const fileInput = $('productImage');
    const placeholder = $('uploadPlaceholder');
    const preview = $('imagePreview');

    zone.addEventListener('click', () => fileInput.click());
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', e => {
        e.preventDefault(); zone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) showImagePreview(file);
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) showImagePreview(file);
    });

    function showImagePreview(file) {
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            hide(placeholder);
            show(preview);
        };
        reader.readAsDataURL(file);
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        handleSellSubmit();
    });
}

function handleSellSubmit() {
    const name          = $('productName').value.trim();
    const category      = $('productCategory').value;
    const price         = parseFloat($('productPrice').value);
    const originalPrice = parseFloat($('productOriginalPrice').value);
    const description   = $('productDescription').value.trim();
    const preview       = $('imagePreview');
    const msgEl         = $('sellFormMsg');

    hide(msgEl);

    if (!name || !category || isNaN(price) || isNaN(originalPrice)) {
        show(msgEl); msgEl.textContent = 'Please fill in all required fields correctly.'; return;
    }
    if (price <= 0 || originalPrice <= 0) {
        show(msgEl); msgEl.textContent = 'Prices must be greater than zero.'; return;
    }
    if (price > originalPrice) {
        show(msgEl); msgEl.textContent = 'Selling price cannot be higher than the original price.'; return;
    }

    setLoading('sellSubmitBtn', true);

    // Simulate a short async operation (replace with real API call when items endpoint exists)
    setTimeout(() => {
        const imageUrl = preview.classList.contains('hidden') ? null : preview.src;
        const newProduct = {
            id: state.nextId++,
            name,
            category,
            price,
            originalPrice,
            description,
            imageUrl,
            isUserListed: true,
            listedAt: new Date().toISOString()
        };

        state.productsData.unshift(newProduct);
        $('sellForm').reset();

        // Reset image preview
        hide(preview);
        show($('uploadPlaceholder'));
        preview.src = '';

        setLoading('sellSubmitBtn', false);
        showToast(`"${name}" listed for R${price.toFixed(2)}!`, 'success');

        // Switch back to products and reset filter
        state.currentCategory = 'All';
        state.currentSearchTerm = '';
        state.currentPage = 1;
        $('searchInput').value = '';
        initCategoryFilters();
        renderProducts();
        switchView('products');
    }, 700);
}

// ─── DETAIL BUTTONS ──────────────────────────────────────
function initDetailButtons() {
    $('detailBuyBtn').addEventListener('click', () => {
        if (!state.currentUser) {
            showToast('Please sign in to purchase items.', 'error');
            openModal('login');
            return;
        }
        if (state.selectedProduct) {
            showToast(`Purchase of "${state.selectedProduct.name}" initiated! (Orders feature coming soon)`, 'success');
        }
    });

    $('detailWishlistBtn').addEventListener('click', () => {
        if (!state.currentUser) {
            showToast('Please sign in to add items to your wishlist.', 'error');
            openModal('login');
            return;
        }
        if (!state.selectedProduct) return;
        const id = state.selectedProduct.id;
        if (state.wishlist.includes(id)) {
            showToast(`"${state.selectedProduct.name}" is already in your wishlist.`, 'default');
        } else {
            state.wishlist.push(id);
            showToast(`"${state.selectedProduct.name}" added to wishlist!`, 'success');
            $('detailWishlistBtn').innerHTML = '<i class="fas fa-heart" style="color:#ef4444"></i> In Wishlist';
        }
    });
}

// ─── KEYBOARD / ESC ──────────────────────────────────────
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !$('authModal').classList.contains('hidden')) {
        closeModal();
    }
});

// ─── INIT ────────────────────────────────────────────────
function init() {
    initNavLinks();
    initAuthModal();
    initCategoryFilters();
    initSearch();
    initPagination();
    initSellForm();
    initDetailButtons();
    renderProducts();
}

document.addEventListener('DOMContentLoaded', init);
