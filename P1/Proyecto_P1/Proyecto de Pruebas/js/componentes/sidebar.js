function loadSidebar() {
    const sidebar = `
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <img src="../assets/icons/main-icon.png" alt="Logo" class="sidebar-logo">
                <h3>Menú</h3>
            </div>
            <ul class="list-unstyled">
                <li>
                    <a href="../index.html">
                        <i class="fas fa-home"></i>
                        <span class="menu-text">Inicio</span>
                    </a>
                </li>
                <li>
                    <a href="../html/productos.html">
                        <i class="fas fa-store"></i>
                        <span class="menu-text">Productos</span>
                    </a>
                </li>
                <li>
                    <a href="../html/carrito.html">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="menu-text">Carrito</span>
                    </a>
                </li>
                <li>
                    <a href="../html/usuario.html">
                        <i class="fas fa-user"></i>
                        <span class="menu-text">Usuario</span>
                    </a>
                </li>
            </ul>
        </div>`;
    document.body.insertAdjacentHTML('afterbegin', sidebar);
}