let filteredProducts = [];
let currentView = 'grid';

document.addEventListener('DOMContentLoaded', async function () {
    // Load products first
    await cargarProductos();
    initializeFilters();
    initializeViewToggle();
    filterAndRenderProducts();
});

function initializeFilters() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', debounce(filterAndRenderProducts, 300));

    // Sort select
    document.getElementById('sortSelect').addEventListener('change', filterAndRenderProducts);

    // Category select
    const categorySelect = document.getElementById('categorySelect');
    const categories = [...new Set(productos.map(p => p.categoria))].sort();
    categorySelect.innerHTML = '<option value="all">Todas las categorías</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    categorySelect.addEventListener('change', filterAndRenderProducts);

    // Price range
    const maxPriceAvailable = Math.max(...productos.map(p => p.precio));
    document.getElementById('maxPrice').placeholder = `Max (${maxPriceAvailable})`;
    document.getElementById('minPrice').addEventListener('input', debounce(filterAndRenderProducts, 300));
    document.getElementById('maxPrice').addEventListener('input', debounce(filterAndRenderProducts, 300));
}

function initializeViewToggle() {
    const gridBtn = document.getElementById('gridView');
    const listBtn = document.getElementById('listView');
    const productList = document.getElementById('product-list');

    // Set initial active state
    gridBtn.classList.add('active');

    gridBtn.addEventListener('click', () => {
        currentView = 'grid';
        productList.classList.remove('view-list');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        renderProducts(filteredProducts);
    });

    listBtn.addEventListener('click', () => {
        currentView = 'list';
        productList.classList.add('view-list');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        renderProducts(filteredProducts);
    });
}

function renderProducts(products) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3 class="text-muted">No se encontraron productos</h3>
            </div>`;
        return;
    }

    products.forEach(p => {
        const col = document.createElement('div');
        col.className = currentView === 'grid' ? 'col-md-4 mb-4' : 'col-12';

        const template = currentView === 'grid' ? `
            <div class="card h-100 product-card">
                <div class="position-relative">
                    <img src="${p.imagen}" class="card-img-top product-image" alt="${p.nombre}">
                    <div class="category-badge badge bg-primary position-absolute top-0 end-0 m-2">
                        ${p.categoria}
                        ${p.subcategoria ? `<span class="ms-1 small">${p.subcategoria}</span>` : ''}
                    </div>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${p.nombre}</h5>
                    <p class="card-text">${p.descripcion}</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <p class="text-primary fw-bold fs-4 mb-0">$${p.precio.toFixed(2)}</p>
                            <span class="badge bg-${p.stock > 0 ? 'success' : 'danger'}">
                                Stock: ${p.stock}
                            </span>
                        </div>
                        <div class="d-flex align-items-center">
                            <input type="number" 
                                class="form-control me-2" 
                                value="1" 
                                min="1" 
                                max="${p.stock}"
                                id="cantidad-${p.id}"
                                ${p.stock <= 0 ? 'disabled' : ''}>
                            <button class="btn btn-primary" 
                                onclick="agregarAlCarrito(${p.id})"
                                ${p.stock <= 0 ? 'disabled' : ''}>
                                <i class="fas fa-cart-plus"></i> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ` : `
            <div class="card product-card">
                <div class="row g-0">
                    <div class="col-md-3">
                        <div class="product-image-container">
                            <img src="${p.imagen}" class="product-image" alt="${p.nombre}">
                            <div class="category-badge badge bg-primary position-absolute">
                                ${p.categoria}
                                ${p.subcategoria ? `<span class="ms-1 small">${p.subcategoria}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card-body">
                            <h5 class="card-title mb-3">${p.nombre}</h5>
                            <p class="card-text mb-3">${p.descripcion}</p>
                            <p class="text-primary fw-bold fs-4 mb-0">$${p.precio.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="actions-column">
                            <span class="badge bg-${p.stock > 0 ? 'success' : 'danger'} fs-6 w-100">
                                Stock: ${p.stock}
                            </span>
                            <input type="number" 
                                class="form-control" 
                                value="1" 
                                min="1" 
                                max="${p.stock}"
                                id="cantidad-${p.id}"
                                ${p.stock <= 0 ? 'disabled' : ''}>
                            <button class="btn btn-primary w-100" 
                                onclick="agregarAlCarrito(${p.id})"
                                ${p.stock <= 0 ? 'disabled' : ''}>
                                <i class="fas fa-cart-plus"></i> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        col.innerHTML = template;
        container.appendChild(col);
    });
}

function filterAndRenderProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sortBy = document.getElementById('sortSelect').value;
    const category = document.getElementById('categorySelect').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;

    // Filter products
    filteredProducts = productos.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchTerm) ||
            p.descripcion.toLowerCase().includes(searchTerm) ||
            p.subcategoria.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || p.categoria === category;
        const matchesPrice = p.precio >= minPrice && p.precio <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
        case 'priceAsc':
            filteredProducts.sort((a, b) => a.precio - b.precio);
            break;
        case 'priceDesc':
            filteredProducts.sort((a, b) => b.precio - a.precio);
            break;
        case 'nameAsc':
            filteredProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'nameDesc':
            filteredProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
    }

    // Update product count
    document.getElementById('productCount').textContent =
        `${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''} encontrado${filteredProducts.length !== 1 ? 's' : ''}`;

    // Render filtered products with animation
    const container = document.getElementById('product-list');
    container.style.opacity = '0';
    setTimeout(() => {
        renderProducts(filteredProducts);
        container.style.opacity = '1';
    }, 300);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}