function loadFooter() {
    const footer = `
        <footer class="footer">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4 mb-4 mb-lg-0">
                        <h5>Sobre Nosotros</h5>
                        <p class="text-muted">AG-Store es tu tienda de confianza para encontrar los mejores productos tecnológicos al mejor precio.</p>
                        <div class="social-links">
                            <a href="#" class="text-light me-3"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" class="text-light me-3"><i class="fab fa-twitter"></i></a>
                            <a href="#" class="text-light me-3"><i class="fab fa-instagram"></i></a>
                            <a href="#" class="text-light"><i class="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                    <div class="col-lg-4 mb-4 mb-lg-0">
                        <h5>Enlaces Rápidos</h5>
                        <ul class="list-unstyled">
                            <li class="mb-2"><a href="../html/productos.html" class="text-muted text-decoration-none">Productos</a></li>
                            <li class="mb-2"><a href="../html/carrito.html" class="text-muted text-decoration-none">Carrito</a></li>
                            <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Términos y Condiciones</a></li>
                            <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Política de Privacidad</a></li>
                        </ul>
                    </div>
                    <div class="col-lg-4">
                        <h5>Contacto</h5>
                        <ul class="list-unstyled text-muted">
                            <li class="mb-2"><i class="fas fa-map-marker-alt me-2"></i> Av. Principal #123, Quito</li>
                            <li class="mb-2"><i class="fas fa-phone me-2"></i> (593) 98-141-6375</li>
                            <li class="mb-2"><i class="fas fa-envelope me-2"></i> alexis.santy07@gmail.com</li>
                        </ul>
                    </div>
                </div>
                <hr class="my-4">
                <div class="row align-items-center">
                    <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        <small class="text-muted">&copy; ${new Date().getFullYear()} AlexGames Studios. Todos los derechos reservados.</small>
                    </div>
                    <div class="col-md-6 text-center text-md-end">
                        <img src="../assets/icons/payment-methods.png" alt="Métodos de pago" class="payment-methods" height="30">
                    </div>
                </div>
            </div>
        </footer>`;
    document.body.insertAdjacentHTML('beforeend', footer);
}