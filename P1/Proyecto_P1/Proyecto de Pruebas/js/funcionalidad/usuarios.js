let usuarioAutenticado = localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')) : null;
let datosAdicionales = localStorage.getItem('datosAdicionales') ? JSON.parse(localStorage.getItem('datosAdicionales')) : {};

// Cargar contenido de usuario
function cargarUsuario() {
    const userContent = document.getElementById('user-content');
    if (!usuarioAutenticado) {
        // Mostrar formulario de login/register
        userContent.innerHTML = `
                    <div class="card p-4">
                        <h4 class="card-title" style: "color: #dcdcdc !important;">Iniciar Sesión o Registrarse</h4>
                        <form id="loginForm">
                            <div class="mb-3">
                                <input type="email" class="form-control" id="email" placeholder="Correo" required>
                            </div>
                            <div class="mb-3">
                                <input type="password" class="form-control" id="password" placeholder="Contraseña" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
                            <p class="mt-3">¿No tienes cuenta? <a href="#" id="showRegister">Regístrate</a></p>
                        </form>
                        <form id="registerForm" style="display: none;">
                            <div class="mb-3">
                                <input type="text" class="form-control" id="regNombre" placeholder="Nombre" required>
                            </div>
                            <div class="mb-3">
                                <input type="text" class="form-control" id="regApellido" placeholder="Apellido" required>
                            </div>
                            <div class="mb-3">
                                <input type="email" class="form-control" id="regEmail" placeholder="Correo" required>
                            </div>
                            <div class="mb-3">
                                <input type="password" class="form-control" id="regPassword" placeholder="Contraseña" required>
                            </div>
                            <div class="mb-3">
                                <input type="text" class="form-control" id="regEmpresa" placeholder="Empresa (Opcional)">
                            </div>
                            <div class="mb-3">
                                <input type="text" class="form-control" id="regDireccion" placeholder="Dirección (Opcional)">
                            </div>
                            <div class="mb-3">
                                <input type="text" class="form-control" id="regCiudad" placeholder="Ciudad (Opcional)">
                            </div>
                            <div class="mb-3">
                                <input type="text" class="form-control" id="regPais" placeholder="País (Opcional)">
                            </div>
                            <div class="mb-3">
                                <input type="text" class="form-control" id="regCodigoPostal" placeholder="Código Postal (Opcional)">
                            </div>
                            <button type="submit" class="btn btn-primary">Registrarse</button>
                            <p class="mt-3">¿Ya tienes cuenta? <a href="#" id="showLogin">Inicia sesión</a></p>
                        </form>
                    </div>
                `;
        // Manejar inicio de sesión
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                correo: document.getElementById('email').value,
                contrasena: document.getElementById('password').value
            };
            try {
                const response = await fetch('../php/api/usuarios/read.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    usuarioAutenticado = result.user; // Asegúrate de que result.user contiene el campo id
                    console.log('Usuario autenticado:', usuarioAutenticado); // Depuración
                    localStorage.setItem('usuario', JSON.stringify(usuarioAutenticado));
                    // Si no hay datos adicionales en localStorage, se inicializan vacíos
                    if (!localStorage.getItem('datosAdicionales')) {
                        datosAdicionales = {};
                        localStorage.setItem('datosAdicionales', JSON.stringify(datosAdicionales));
                    }
                    Swal.fire('Éxito', 'Sesión iniciada', 'success');
                    cargarUsuario();
                } else {
                    Swal.fire('Error', result.message, 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Error al iniciar sesión', 'error');
            }
        });
        // Manejar registro
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'block';
        });
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                nombre: document.getElementById('regNombre').value,
                apellido: document.getElementById('regApellido').value,
                correo: document.getElementById('regEmail').value,
                contrasena: document.getElementById('regPassword').value
            };
            datosAdicionales = {
                empresa: document.getElementById('regEmpresa').value,
                direccion: document.getElementById('regDireccion').value,
                ciudad: document.getElementById('regCiudad').value,
                pais: document.getElementById('regPais').value,
                codigo_postal: document.getElementById('regCodigoPostal').value
            };
            localStorage.setItem('datosAdicionales', JSON.stringify(datosAdicionales));
            try {
                const response = await fetch('../php/api/usuarios/create.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        Swal.fire('Éxito', 'Usuario registrado', 'success');
                        usuarioAutenticado = data;
                        localStorage.setItem('usuario', JSON.stringify(usuarioAutenticado));
                        cargarUsuario();
                    }
                } else {
                    Swal.fire('Error', 'Correo ya registrado', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Error al registrar', 'error');
            }
        });
        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
        });
    } else {
        // Mostrar perfil editable
        userContent.innerHTML = `
    <div class="card p-4">
        <h4 class="card-title">Perfil de ${usuarioAutenticado.nombre}</h4>
        <form id="editProfileForm">
            <div class="mb-3">
                <input type="text" class="form-control" id="editNombre" value="${usuarioAutenticado.nombre}" required>
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="editApellido" value="${usuarioAutenticado.apellido}" required>
            </div>
            <div class="mb-3">
                <input type="email" class="form-control" id="editCorreo" value="${usuarioAutenticado.correo}" disabled>
            </div>
            <div class="mb-3">
                <input type="password" class="form-control" id="editPassword" placeholder="Nueva Contraseña (Opcional)">
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="editEmpresa" value="${datosAdicionales.empresa || ''}">
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="editDireccion" value="${datosAdicionales.direccion || ''}">
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="editCiudad" value="${datosAdicionales.ciudad || ''}">
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="editPais" value="${datosAdicionales.pais || ''}">
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="editCodigoPostal" value="${datosAdicionales.codigo_postal || ''}">
            </div>
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
        </form>
        <button id="logoutButton" class="btn btn-danger mt-3">Cerrar Sesión</button>
    </div>
`;

        document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                id: usuarioAutenticado.id,
                nombre: document.getElementById('editNombre').value,
                apellido: document.getElementById('editApellido').value,
                correo: usuarioAutenticado.correo,
                contrasena: document.getElementById('editPassword').value || undefined
            };
            datosAdicionales = {
                empresa: document.getElementById('editEmpresa').value,
                direccion: document.getElementById('editDireccion').value,
                ciudad: document.getElementById('editCiudad').value,
                pais: document.getElementById('editPais').value,
                codigo_postal: document.getElementById('editCodigoPostal').value
            };
            localStorage.setItem('datosAdicionales', JSON.stringify(datosAdicionales));
            try {
                const response = await fetch('../php/api/usuarios/update.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    Swal.fire('Éxito', 'Perfil actualizado', 'success');
                    usuarioAutenticado = { ...usuarioAutenticado, ...data };
                    localStorage.setItem('usuario', JSON.stringify(usuarioAutenticado));
                }
            } catch (error) {
                Swal.fire('Error', 'Error al actualizar', 'error');
            }
        });

        // Manejar cierre de sesión
        document.getElementById('logoutButton').addEventListener('click', () => {
            localStorage.removeItem('usuario');
            localStorage.removeItem('datosAdicionales');
            Swal.fire('Sesión cerrada', 'Has cerrado sesión exitosamente', 'success').then(() => {
                history.replaceState(null, null, 'usuario.html');
                location.reload();
            });
        });
    }
}

// Cargar contenido de pedidos
function cargarPedidos() {
    const ordersContent = document.getElementById('orders-content');
    if (!usuarioAutenticado) {
        ordersContent.innerHTML = '<p class="text-white">Debes iniciar sesión para ver tus pedidos.</p>';
        return;
    }
    fetch('../php/api/pedidos/read.php?user_id=' + usuarioAutenticado.id) // Ajustar con ID real
        .then(response => response.json())
        .then(data => {
            if (data.pedidos && Array.isArray(data.pedidos)) {
                ordersContent.innerHTML = `
                            <table class="table table-dark table-striped">
                                <thead>
                                    <tr>
                                        <th>ID Pedido</th>
                                        <th>Fecha</th>
                                        <th>Producto</th>
                                        <th>Categoría</th>
                                        <th>Cantidad</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.pedidos.map(p => `
                                        <tr>
                                            <td>${p.id}</td>
                                            <td>${new Date(p.creacion).toLocaleDateString()}</td>
                                            <td>${p.nombre_producto}</td>
                                            <td>${p.categoria_producto}</td>
                                            <td>${p.cantidad}</td>
                                            <td>${p.estado}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        `;
            } else {
                ordersContent.innerHTML = '<p class="text-white">No hay pedidos disponibles.</p>';
            }
        })
        .catch(error => {
            console.error('Error al cargar pedidos:', error);
            ordersContent.innerHTML = '<p class="text-white">Error al cargar pedidos.</p>';
        });
}

// Inicializar pestañas
document.getElementById('user-tab').addEventListener('shown.bs.tab', cargarUsuario);
document.getElementById('orders-tab').addEventListener('shown.bs.tab', cargarPedidos);
cargarUsuario(); // Cargar por defecto