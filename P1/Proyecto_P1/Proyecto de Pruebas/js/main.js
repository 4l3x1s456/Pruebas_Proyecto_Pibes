const productos = [
    {
        id: 1,
        nombre: "Smartphone XYZ",
        precio: 599.99,
        descripcion: "Último modelo con cámara de 48MP y 128GB de almacenamiento",
        imagen: "https://via.placeholder.com/300",
        categoria: "Electrónicos"
    },
    {
        id: 2,
        nombre: "Laptop Pro",
        precio: 999.99,
        descripcion: "16GB RAM, SSD 512GB, Procesador i7",
        imagen: "https://via.placeholder.com/300",
        categoria: "Computadoras"
    },
    // Añade más productos aquí
];


function renderProductos() {
    const contenedor = document.getElementById("product-list");
    if (!contenedor) return;

    contenedor.innerHTML = '';
    productos.forEach(p => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
        col.innerHTML = `
            <div class="card h-100">
                <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${p.nombre}</h5>
                    <p class="card-text">${p.descripcion}</p>
                    <p class="text-primary fw-bold">$${p.precio.toFixed(2)}</p>
                    <div class="d-flex align-items-center">
                        <input type="number" class="form-control me-2" value="1" min="1" id="cantidad-${p.id}">
                        <button class="btn btn-primary" onclick="agregarAlCarrito(${p.id})">
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
        carrito.push({...producto, cantidad});
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

document.addEventListener('DOMContentLoaded', () => {
    renderProductos();
    renderCarrito();
});
