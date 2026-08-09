let productsData = [];

function getMyListings() {
    return productsData.filter(p => p.isUserListed);
}

function renderSummary(myListings) {
    const countEl = document.getElementById("summaryCount");
    const valueEl = document.getElementById("summaryValue");
    if (countEl) countEl.innerText = myListings.length;
    if (valueEl) {
        const total = myListings.reduce((sum, p) => sum + p.price, 0);
        valueEl.innerText = `R${total.toFixed(2)}`;
    }
}

function renderMyListings() {
    const myListings = getMyListings();
    const container = document.getElementById("myListingsGridContainer");
    if (!container) return;

    renderSummary(myListings);

    if (myListings.length === 0) {
        container.innerHTML = `
      <div class="no-results">
        <i class="fas fa-box-open fa-2x" style="opacity:0.5; margin-bottom:1rem; display:block;"></i>
        You have not listed anything yet
        <br>
        <a href="dashboard.html#sellForm" class="empty-cta-link">List your first item <i class="fas fa-arrow-right"></i></a>
      </div>`;
        return;
    }

    let cardsHtml = "";
    for (let product of myListings) {
        const discountPercent = ((product.originalPrice - product.price) / product.originalPrice * 100).toFixed(0);
        const hasDiscount = product.originalPrice > product.price;

        const imageMarkup = product.image
            ? `<img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy">`
            : `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7L12 12L4 7M20 7V17L12 22L4 17V7M20 7L12 2L4 7" stroke="#7188AE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 12V22M12 12L20 7M12 12L4 7" stroke="#7188AE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;

        cardsHtml += `
      <div class="product-card">
        <div class="listing-badge"><i class="fas fa-user-plus"></i> Listed by You</div>
        <div class="card-img">
          ${imageMarkup}
        </div>
        <div class="card-info">
          <div class="product-title">${escapeHtml(product.name)}</div>
          <div class="price-row">
            <span class="current-price">R${product.price.toFixed(2)}</span>
            ${hasDiscount ? `<span class="old-price">R${product.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          ${hasDiscount ? `<div class="discount-badge">-${discountPercent}% OFF</div>` : '<div style="height:22px;"></div>'}
          <button class="remove-listing-btn" data-id="${product.id}">
            <i class="fas fa-trash-can"></i> Remove Listing
          </button>
        </div>
      </div>
    `;
    }
    container.innerHTML = cardsHtml;

    container.querySelectorAll(".remove-listing-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"), 10);
            const product = productsData.find(p => p.id === id);
            if (!product) return;
            if (confirm(`Remove "${product.name}" from your listings?`)) {
                productsData = removeProduct(productsData, id);
                renderMyListings();
            }
        });
    });
}

function init() {
    productsData = loadProducts();
    initNav();
    renderMyListings();
}

document.addEventListener("DOMContentLoaded", init);