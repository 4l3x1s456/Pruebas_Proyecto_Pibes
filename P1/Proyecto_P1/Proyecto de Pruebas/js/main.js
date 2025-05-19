async function cargarProductos() {
    try {
        console.log('Iniciando carga de productos...');
        const response = await fetch('../php/api/productos/read.php');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Datos cargados:', data);

        if (!data.productos || !Array.isArray(data.productos)) {
            console.error('Estructura de datos recibida:', data);
            throw new Error('Formato de datos inválido: se esperaba un array de productos');
        }

        productos = data.productos.map(p => ({
            ...p,
            precio: parseFloat(p.precio),
            stock: parseInt(p.stock),
            imagen: p.imagen.startsWith('default') ?
                '../assets/images/default.jpg' :
                `../assets/images/${p.imagen}`
        }));

        console.log('Productos procesados:', productos);
        renderProductos();

    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarError(error);
    }
}

function mostrarError(error) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los productos: ' + error.message
    });
}

function renderProductos() {
    const contenedor = document.getElementById("product-list");
    if (!contenedor) {
        console.error('No se encontró el contenedor de productos');
        return;
    }

    contenedor.innerHTML = '';
    productos.forEach(p => {
        const precioFormateado = typeof p.precio === 'number' ? p.precio.toFixed(2) : '0.00';
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
        col.innerHTML = `
            <div class="card h-100">
                <div class="category-badge badge bg-primary position-absolute top-0 end-0 m-2">
                    ${p.categoria}
                    ${p.subcategoria ? `<span class="ms-1 small">${p.subcategoria}</span>` : ''}
                </div>
                <img src="${p.imagen}" class="card-img-top product-image" alt="Falta imagen">
                <div class="card-body">
                    <h5 class="card-title">${p.nombre}</h5>
                    <p class="card-text">${p.descripcion}</p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <p class="text-primary fw-bold mb-0">$${precioFormateado}</p>
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
            </div>`;
        contenedor.appendChild(col);
    });
}

function agregarAlCarrito(id) {
    const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);
    const producto = productos.find(p => p.id === id);
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({ ...producto, cantidad });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: `${cantidad} ${producto.nombre} agregado(s) al carrito`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });
}

function renderCarrito() {
    const lista = document.getElementById("cart-items");
    const total = document.getElementById("cart-total");
    if (!lista || !total) return;

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    lista.innerHTML = "";
    let suma = 0;

    carrito.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        suma += subtotal;

        const item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `
            <div>
                <h6 class="mb-0">${p.nombre}</h6>
                <small class="text-muted">$${p.precio} x ${p.cantidad}</small>
            </div>
            <div>
                <span class="h6">$${subtotal.toFixed(2)}</span>
                <button class="btn btn-sm btn-danger ms-2" onclick="eliminarDelCarrito(${p.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        lista.appendChild(item);
    });

    total.textContent = suma.toFixed(2);
}

function eliminarDelCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
}

document.addEventListener('DOMContentLoaded', async () => {
    cargarProductos();
    renderProductos();
    renderCarrito();
});
