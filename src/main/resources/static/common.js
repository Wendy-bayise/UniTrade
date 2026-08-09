const UT_STORAGE_KEY = "ut_products_v1";
const UT_CART_KEY = "ut_cart_v1";
const UT_MESSAGES_KEY = "ut_conversations_v1";

const defaultProducts = [
    { id: 1, name: "Autos Wireless", price: 540.90, originalPrice: 600.00, category: "Home", isUserListed: false, image: "https://images.pexels.com/photos/7417547/pexels-photo-7417547.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 2, name: "Smart Watch PVR", price: 600.00, originalPrice: 1250.00, category: "Home", isUserListed: false, image: "https://images.pexels.com/photos/9130511/pexels-photo-9130511.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 3, name: "Controller Elite", price: 544.99, originalPrice: 850.00, category: "Home", isUserListed: false, image: "https://images.pexels.com/photos/15822012/pexels-photo-15822012.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 4, name: "AirPods Pro", price: 844.99, originalPrice: 850.00, category: "Home", isUserListed: false, image: "https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 5, name: "AirPods Max", price: 843.99, originalPrice: 850.00, category: "Home", isUserListed: false, image: "https://images.pexels.com/photos/7054538/pexels-photo-7054538.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 6, name: "Classic Tee", price: 29.99, originalPrice: 49.99, category: "Shirts", isUserListed: false, image: "https://images.pexels.com/photos/12039633/pexels-photo-12039633.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 7, name: "Denim Jacket", price: 79.99, originalPrice: 129.99, category: "Mens Wear", isUserListed: false, image: "https://images.pexels.com/photos/5779608/pexels-photo-5779608.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 8, name: "Floral Dress", price: 59.99, originalPrice: 99.99, category: "Women Wear", isUserListed: false, image: "https://images.pexels.com/photos/4380970/pexels-photo-4380970.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 9, name: "Running Shoes", price: 89.99, originalPrice: 149.99, category: "Shoes", isUserListed: false, image: "https://images.pexels.com/photos/20298286/pexels-photo-20298286.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 10, name: "Leather Sofa", price: 499.99, originalPrice: 799.99, category: "Furniture", isUserListed: false, image: "https://images.pexels.com/photos/6933860/pexels-photo-6933860.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 11, name: "Smart Lamp", price: 39.99, originalPrice: 69.99, category: "Home", isUserListed: false, image: "https://images.pexels.com/photos/22610370/pexels-photo-22610370.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 12, name: "Casual Shorts", price: 34.99, originalPrice: 59.99, category: "Clothes", isUserListed: false, image: "https://images.pexels.com/photos/4004222/pexels-photo-4004222.jpeg?auto=compress&cs=tinysrgb&w=400" }
];

const categoriesList = ["All", "Home", "Furniture", "Shirts", "Mens Wear", "Women Wear", "Shoes", "Clothes", "Electronics", "Accessories"];

function loadProducts() {
    try {
        const raw = localStorage.getItem(UT_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {}
    saveProducts(defaultProducts);
    return [...defaultProducts];
}

function saveProducts(products) {
    try {
        localStorage.setItem(UT_STORAGE_KEY, JSON.stringify(products));
    } catch (err) {}
}

function getNextProductId(products) {
    return products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

function addProduct(products, newProductFields) {
    const newProduct = {
        id: getNextProductId(products),
        isUserListed: true,
        ...newProductFields
    };
    const updated = [newProduct, ...products];
    saveProducts(updated);
    return updated;
}

function removeProduct(products, id) {
    const updated = products.filter(p => p.id !== id);
    saveProducts(updated);
    return updated;
}

function escapeHtml(str) {
    return String(str).replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function loadCart() {
    try {
        const raw = localStorage.getItem(UT_CART_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (err) {}
    return [];
}

function saveCart(cart) {
    try {
        localStorage.setItem(UT_CART_KEY, JSON.stringify(cart));
    } catch (err) {}
    updateCartBadge();
}

function addToCart(cart, product) {
    const existing = cart.find(item => item.id === product.id);
    let updated;
    if (existing) {
        updated = cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
    } else {
        updated = [...cart, { id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 }];
    }
    saveCart(updated);
    return updated;
}

function removeFromCart(cart, id) {
    const updated = cart.filter(item => item.id !== id);
    saveCart(updated);
    return updated;
}

function changeCartQty(cart, id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return cart;
    const newQty = item.qty + delta;
    if (newQty <= 0) return removeFromCart(cart, id);
    const updated = cart.map(i => i.id === id ? { ...i, qty: newQty } : i);
    saveCart(updated);
    return updated;
}

function clearCart() {
    saveCart([]);
}

function updateCartBadge() {
    const badge = document.getElementById("cartBadge");
    if (!badge) return;
    const cart = loadCart();
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.innerText = totalQty;
    badge.style.display = totalQty > 0 ? "flex" : "none";
}

const defaultConversations = [
    {
        id: 1,
        withName: "Naledi M.",
        productName: "AirPods Pro",
        messages: [
            { sender: "them", text: "Hey! Is the AirPods Pro still available?", time: "09:12 AM" },
            { sender: "me", text: "Yep, still have them. Barely used.", time: "09:20 AM" },
            { sender: "them", text: "Would you take R800 for it?", time: "09:22 AM" }
        ]
    },
    {
        id: 2,
        withName: "Thabo K.",
        productName: "Leather Sofa",
        messages: [
            { sender: "them", text: "Does the sofa have any tears or stains?", time: "Yesterday" },
            { sender: "me", text: "No, it's in great shape, just moving out of res.", time: "Yesterday" }
        ]
    },
    {
        id: 3,
        withName: "Aisha P.",
        productName: "Smart Watch PVR",
        messages: [
            { sender: "them", text: "Can you meet at the campus library to hand it over?", time: "Mon" }
        ]
    }
];

function loadConversations() {
    try {
        const raw = localStorage.getItem(UT_MESSAGES_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {}
    saveConversations(defaultConversations);
    return JSON.parse(JSON.stringify(defaultConversations));
}

function saveConversations(conversations) {
    try {
        localStorage.setItem(UT_MESSAGES_KEY, JSON.stringify(conversations));
    } catch (err) {}
}

function appendMessage(conversations, conversationId, text, sender = "me") {
    const updated = conversations.map(c => {
        if (c.id !== conversationId) return c;
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return { ...c, messages: [...c.messages, { sender, text, time }] };
    });
    saveConversations(updated);
    return updated;
}

function getConversationInitial(conversation) {
    return conversation.withName.trim().charAt(0).toUpperCase();
}

function initUserGreeting() {
    const nameEl = document.getElementById("userNameDisplay");
    const avatarEl = document.getElementById("userAvatarInitial");
    if (!nameEl) return;

    let storedName = "";
    try {
        storedName = sessionStorage.getItem("utUserName") || "";
    } catch (err) {
        storedName = "";
    }

    const displayName = storedName.trim() !== "" ? storedName.trim() : "Student";
    nameEl.innerText = displayName;
    if (avatarEl) avatarEl.innerText = displayName.charAt(0).toUpperCase();
}

function initLogout() {
    const logoutBtn = document.getElementById("logoutLink");
    if (!logoutBtn) return;
    logoutBtn.addEventListener("click", () => {
        try {
            sessionStorage.removeItem("utUserName");
        } catch (err) {}
    });
}

function initNav() {
    initUserGreeting();
    initLogout();
    updateCartBadge();
}