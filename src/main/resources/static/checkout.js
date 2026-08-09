const DELIVERY_FEE = 60;

function renderCheckout() {
    const container = document.getElementById("cartItemsList");
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    if (!container) return;

    const cart = loadCart();

    if (cart.length === 0) {
        container.innerHTML = `<div class="no-results"><i class="fas fa-bag-shopping fa-2x" style="opacity:0.5; margin-bottom:1rem; display:block;"></i> Your cart is empty <br> <a href="dashboard.html" class="empty-cta-link">Go find something to buy</a></div>`;
        updateSummary(cart);
        placeOrderBtn.disabled = true;
        return;
    }

    let rowsHtml = "";
    for (let item of cart) {
        const lineTotal = item.price * item.qty;
        const imageMarkup = item.image
            ? `<img src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy">`
            : `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7L12 12L4 7M20 7V17L12 22L4 17V7M20 7L12 2L4 7" stroke="#7188AE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;

        rowsHtml += `
      <div class="cart-item-row">
        <div class="cart-item-img">${imageMarkup}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${escapeHtml(item.name)}</div>
          <div class="cart-item-price">R${item.price.toFixed(2)} each</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
        </div>
        <div class="cart-item-linetotal">R${lineTotal.toFixed(2)}</div>
        <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-xmark"></i></button>
      </div>
    `;
    }
    container.innerHTML = rowsHtml;
    updateSummary(cart);
    placeOrderBtn.disabled = false;

    container.querySelectorAll(".qty-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id, 10);
            const delta = parseInt(btn.dataset.delta, 10);
            changeCartQty(loadCart(), id, delta);
            renderCheckout();
        });
    });

    container.querySelectorAll(".cart-item-remove").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id, 10);
            removeFromCart(loadCart(), id);
            renderCheckout();
        });
    });
}

function updateSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const delivery = cart.length > 0 ? DELIVERY_FEE : 0;
    const total = subtotal + delivery;

    document.getElementById("summarySubtotal").innerText = `R${subtotal.toFixed(2)}`;
    document.getElementById("summaryDelivery").innerText = `R${delivery.toFixed(2)}`;
    document.getElementById("summaryTotal").innerText = `R${total.toFixed(2)}`;
}

function initPlaceOrder() {
    const btn = document.getElementById("placeOrderBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
        const cart = loadCart();
        if (cart.length === 0) return;
        const total = document.getElementById("summaryTotal").innerText;
        alert(`Order placed! Your total was ${total}. The seller will be notified to arrange handover.`);
        clearCart();
        renderCheckout();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initNav();
    renderCheckout();
    initPlaceOrder();
});