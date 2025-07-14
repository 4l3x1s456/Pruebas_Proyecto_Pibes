const request = require('supertest');
const app = require('../../src/app');

// Mock de la base de datos
jest.mock('../../src/config/database');

describe('Productos API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/productos', () => {
        test('should return all products', async() => {
            // Mock del modelo Producto
            const Producto = require('../../src/models/Producto');
            const mockObtenerTodos = jest.fn().mockResolvedValue([
                {
                    id: 1,
                    nombre: 'Test Product',
                    descripcion: 'Test Description',
                    categoria: 'Test Category',
                    precio: 99.99,
                    stock: 10,
                    imagen: 'test.jpg'
                }
            ]);

            Producto.prototype.obtenerTodos = mockObtenerTodos;

            const response = await request(app)
                .get('/api/productos')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.productos).toHaveLength(1);
            expect(response.body.productos[0].nombre).toBe('Test Product');
        });

        test('should handle database errors', async() => {
            const Producto = require('../../src/models/Producto');
            const mockObtenerTodos = jest.fn().mockRejectedValue(new Error('Database error'));
            Producto.prototype.obtenerTodos = mockObtenerTodos;

            const response = await request(app)
                .get('/api/productos')
                .expect(500);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Error interno del servidor');
        });
    });

    describe('GET /api/productos/:id', () => {
        test('should return product by id', async() => {
            const Producto = require('../../src/models/Producto');
            const mockObtenerPorId = jest.fn().mockResolvedValue({
                id: 1,
                nombre: 'Test Product',
                descripcion: 'Test Description',
                categoria: 'Test Category',
                precio: 99.99,
                stock: 10,
                imagen: 'test.jpg'
            });

            Producto.prototype.obtenerPorId = mockObtenerPorId;

            const response = await request(app)
                .get('/api/productos/1')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.producto.id).toBe(1);
            expect(mockObtenerPorId).toHaveBeenCalledWith('1');
        });

        test('should return 404 if product not found', async() => {
            const Producto = require('../../src/models/Producto');
            const mockObtenerPorId = jest.fn().mockResolvedValue(null);
            Producto.prototype.obtenerPorId = mockObtenerPorId;

            const response = await request(app)
                .get('/api/productos/999')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Producto no encontrado');
        });
    });

    describe('GET /api/productos/categoria/:categoria', () => {
        test('should return products by category', async() => {
            const Producto = require('../../src/models/Producto');
            const mockObtenerPorCategoria = jest.fn().mockResolvedValue([
                {
                    id: 1,
                    nombre: 'Product 1',
                    categoria: 'Electronics',
                    precio: 99.99,
                    stock: 10
                },
                {
                    id: 2,
                    nombre: 'Product 2',
                    categoria: 'Electronics',
                    precio: 199.99,
                    stock: 5
                }
            ]);

            Producto.prototype.obtenerPorCategoria = mockObtenerPorCategoria;

            const response = await request(app)
                .get('/api/productos/categoria/Electronics')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.categoria).toBe('Electronics');
            expect(response.body.productos).toHaveLength(2);
            expect(mockObtenerPorCategoria).toHaveBeenCalledWith('Electronics');
        });
    });

    describe('POST /api/productos', () => {
        test('should require authentication', async() => {
            const response = await request(app)
                .post('/api/productos')
                .send({
                    nombre: 'New Product',
                    precio: 99.99
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Token de acceso requerido');
        });

        test('should require admin role', async() => {
            // Mock JWT para simular usuario no admin
            const jwt = require('jsonwebtoken');
            jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
                callback(null, { id: 1, email: 'user@test.com', rol: 'cliente' });
            });

            const response = await request(app)
                .post('/api/productos')
                .set('Authorization', 'Bearer fake-token')
                .send({
                    nombre: 'New Product',
                    precio: 99.99
                })
                .expect(403);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('No tienes permisos para acceder a este recurso');
        });

        test('should create product with admin token', async() => {
            // Mock JWT para simular admin
            const jwt = require('jsonwebtoken');
            jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
                callback(null, { id: 1, email: 'admin@test.com', rol: 'admin' });
            });

            // Mock del modelo
            const Producto = require('../../src/models/Producto');
            const mockCrear = jest.fn().mockResolvedValue({
                id: 1,
                nombre: 'New Product',
                precio: 99.99,
                stock: 10
            });
            Producto.prototype.crear = mockCrear;

            const response = await request(app)
                .post('/api/productos')
                .set('Authorization', 'Bearer admin-token')
                .send({
                    nombre: 'New Product',
                    precio: 99.99,
                    stock: 10
                })
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Producto creado exitosamente');
            expect(response.body.producto.nombre).toBe('New Product');
        });

        test('should validate required fields', async() => {
            // Mock JWT para simular admin
            const jwt = require('jsonwebtoken');
            jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
                callback(null, { id: 1, email: 'admin@test.com', rol: 'admin' });
            });

            const response = await request(app)
                .post('/api/productos')
                .set('Authorization', 'Bearer admin-token')
                .send({
                    descripcion: 'Only description'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Nombre y precio son campos obligatorios');
        });

        test('should validate positive values', async() => {
            // Mock JWT para simular admin
            const jwt = require('jsonwebtoken');
            jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
                callback(null, { id: 1, email: 'admin@test.com', rol: 'admin' });
            });

            const response = await request(app)
                .post('/api/productos')
                .set('Authorization', 'Bearer admin-token')
                .send({
                    nombre: 'Test Product',
                    precio: -10,
                    stock: -5
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('El precio y stock deben ser valores positivos');
        });
    });
});
