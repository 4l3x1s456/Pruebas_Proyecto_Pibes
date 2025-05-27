let productos = [];
let carrito = [];

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
            throw new Error('Formato de datos inválido: se esperaba un array de productos');
        }

        productos = data.productos;
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
        cargarCarrito();

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

function cargarCarrito() {
    try {
        carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        renderCarrito();
    } catch (error) {
        console.error('Error al cargar carrito:', error);
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }
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
    try {
        const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);
        const producto = productos.find(p => parseInt(p.id) === parseInt(id));

        if (!producto) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }

        if (cantidad > producto.stock) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay suficiente stock disponible'
            });
            return;
        }

        // Buscar si el producto ya existe en el carrito
        const itemExistente = carrito.find(item => parseInt(item.id) === parseInt(id));

        if (itemExistente) {
            const nuevaCantidad = itemExistente.cantidad + cantidad;
            if (nuevaCantidad > producto.stock) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La cantidad total excedería el stock disponible'
                });
                return;
            }
            itemExistente.cantidad = nuevaCantidad;
        } else {
            carrito.push({
                id: parseInt(producto.id),
                nombre: producto.nombre,
                precio: parseFloat(producto.precio),
                imagen: producto.imagen,
                stock: parseInt(producto.stock),
                cantidad: cantidad
            });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        
        Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: `Se ${itemExistente ? 'actualizó la cantidad' : 'agregó'} en el carrito`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        renderCarrito();

    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        mostrarError(error);
    }
}

function renderCarrito() {
    const contenedor = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");
    const totalItemsElement = document.getElementById("total-items");
    
    if (!contenedor) return;

    contenedor.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        totalItems += item.cantidad;

        const itemElement = document.createElement("div");
        itemElement.className = "card mb-3 bg-dark text-white";
        itemElement.innerHTML = `
            <div class="row g-0 align-items-center p-2">
                <div class="col-md-2">
                    <img src="${item.imagen}" class="img-fluid rounded" alt="${item.nombre}">
                </div>
                <div class="col-md-4">
                    <div class="card-body">
                        <h5 class="card-title">${item.nombre}</h5>
                        <p class="card-text"><small>${item.descripcion || ''}</small></p>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="btn-group">
                        <button class="btn btn-outline-primary btn-sm" onclick="actualizarCantidad(${item.id}, ${item.cantidad - 1})">-</button>
                        <span class="btn btn-outline-secondary btn-sm disabled">${item.cantidad}</span>
                        <button class="btn btn-outline-primary btn-sm" onclick="actualizarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
                    </div>
                </div>
                <div class="col-md-2 text-end">
                    <span class="text-success">$${subtotal.toFixed(2)}</span>
                </div>
                <div class="col-md-2 text-end">
                    <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
        contenedor.appendChild(itemElement);
    });

    if (totalElement) totalElement.textContent = total.toFixed(2);
    if (totalItemsElement) totalItemsElement.textContent = totalItems;

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center p-4">
                <p class="text-muted">No hay productos en el carrito</p>
                <a href="productos.html" class="btn btn-primary">Ver Productos</a>
            </div>`;
    }
}

function finalizarCompra() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Carrito vacío',
            text: 'Agrega productos antes de finalizar la compra'
        });
        return;
    }

    Swal.fire({
        title: '¿Confirmar compra?',
        text: `Total a pagar: $${document.getElementById("cart-total").textContent}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Aquí iría la lógica de procesamiento de la compra
            localStorage.removeItem("carrito");
            carrito = [];
            renderCarrito();
            
            Swal.fire(
                '¡Compra exitosa!',
                'Gracias por tu compra',
                'success'
            );
        }
    });
}

function actualizarCantidad(id, nuevaCantidad) {
    try {
        const item = carrito.find(item => parseInt(item.id) === parseInt(id));
        
        if (!item) {
            throw new Error('Producto no encontrado en el carrito');
        }

        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(id);
            return;
        }

        if (nuevaCantidad > item.stock) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay suficiente stock disponible'
            });
            return;
        }

        item.cantidad = nuevaCantidad;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCarrito();

    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        mostrarError(error);
    }
}

function eliminarDelCarrito(id) {
    Swal.fire({
        title: '¿Eliminar producto?',
        text: "Se eliminará este producto del carrito",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                carrito = carrito.filter(item => parseInt(item.id) !== parseInt(id));
                localStorage.setItem("carrito", JSON.stringify(carrito));
                renderCarrito();

                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'Producto eliminado del carrito',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            } catch (error) {
                console.error('Error al eliminar del carrito:', error);
                mostrarError(error);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    cargarProductos().catch(error => {
        console.error('Error en inicialización:', error);
        mostrarError(error);
    });
});