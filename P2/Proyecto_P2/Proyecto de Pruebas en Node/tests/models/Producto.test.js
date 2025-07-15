const Producto = require('../../src/models/Producto');

// Mock de la base de datos
jest.mock('../../src/config/database');

describe('Producto Model', () => {
    let productoModel;
    let mockDb;

    beforeEach(() => {
        // Resetear mocks
        jest.clearAllMocks();

        // Crear mock de la base de datos
        mockDb = {
            query: jest.fn(),
            getConnection: jest.fn(),
            close: jest.fn()
        };

        // Mock del constructor de Database
        const Database = require('../../src/config/database');
        Database.mockImplementation(() => mockDb);

        productoModel = new Producto();
    });

    describe('obtenerTodos', () => {
        test('should return all products with correct format', async() => {
            const mockProductos = [
                {
                    id: 1,
                    nombre: 'Test Product',
                    descripcion: 'Test Description',
                    categoria: 'Test Category',
                    subcategoria: 'Test Subcategory',
                    precio: '99.99',
                    stock: '10'
                }
            ];

            mockDb.query.mockResolvedValue(mockProductos);

            const result = await productoModel.obtenerTodos();

            expect(mockDb.query).toHaveBeenCalledWith(
                expect.stringContaining(
                    'SELECT id, nombre, descripcion, categoria, subcategoria, precio, stock'
                )
            );
            expect(result).toHaveLength(1);
            expect(result[0].precio).toBe(99.99);
            expect(result[0].stock).toBe(10);
            expect(result[0].imagen).toBeDefined();
        });

        test('should handle database errors', async() => {
            mockDb.query.mockRejectedValue(new Error('Database error'));

            await expect(productoModel.obtenerTodos()).rejects.toThrow('Database error');
        });
    });

    describe('obtenerPorId', () => {
        test('should return product by id', async() => {
            const mockProducto = [{
                id: 1,
                nombre: 'Test Product',
                descripcion: 'Test Description',
                categoria: 'Test Category',
                subcategoria: 'Test Subcategory',
                precio: '99.99',
                stock: '10'
            }];

            mockDb.query.mockResolvedValue(mockProducto);

            const result = await productoModel.obtenerPorId(1);

            expect(mockDb.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE id = ?'),
                [1]
            );
            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(result.precio).toBe(99.99);
        });

        test('should return null if product not found', async() => {
            mockDb.query.mockResolvedValue([]);

            const result = await productoModel.obtenerPorId(999);

            expect(result).toBeNull();
        });
    });

    describe('crear', () => {
        test('should create new product', async() => {
            const nuevoProducto = {
                nombre: 'New Product',
                descripcion: 'New Description',
                categoria: 'New Category',
                subcategoria: 'New Subcategory',
                precio: 199.99,
                stock: 5
            };

            mockDb.query.mockResolvedValue({ insertId: 1 });

            const result = await productoModel.crear(nuevoProducto);

            expect(mockDb.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO productos'),
                expect.arrayContaining([
                    nuevoProducto.nombre,
                    nuevoProducto.descripcion,
                    nuevoProducto.categoria,
                    nuevoProducto.subcategoria,
                    nuevoProducto.precio,
                    nuevoProducto.stock
                ])
            );
            expect(result.id).toBe(1);
            expect(result.nombre).toBe(nuevoProducto.nombre);
        });
    });

    describe('actualizar', () => {
        test('should update existing product', async() => {
            const productoActualizado = {
                nombre: 'Updated Product',
                descripcion: 'Updated Description',
                categoria: 'Updated Category',
                subcategoria: 'Updated Subcategory',
                precio: 299.99,
                stock: 8
            };

            // Mock para la actualización
            mockDb.query.mockResolvedValueOnce({ affectedRows: 1 });

            // Mock para obtener el producto actualizado
            mockDb.query.mockResolvedValueOnce([{
                id: 1,
                ...productoActualizado,
                precio: '299.99',
                stock: '8'
            }]);

            // Espiar el método obtenerPorId
            jest.spyOn(productoModel, 'obtenerPorId').mockResolvedValue({
                id: 1,
                ...productoActualizado
            });

            const result = await productoModel.actualizar(1, productoActualizado);

            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(result.nombre).toBe(productoActualizado.nombre);
        });
    });

    describe('eliminar', () => {
        test('should delete product successfully', async() => {
            mockDb.query.mockResolvedValue({ affectedRows: 1 });

            const result = await productoModel.eliminar(1);

            expect(mockDb.query).toHaveBeenCalledWith(
                'DELETE FROM productos WHERE id = ?',
                [1]
            );
            expect(result).toBe(true);
        });

        test('should return false if product not found', async() => {
            mockDb.query.mockResolvedValue({ affectedRows: 0 });

            const result = await productoModel.eliminar(999);

            expect(result).toBe(false);
        });
    });

    describe('obtenerPorCategoria', () => {
        test('should return products by category', async() => {
            const mockProductos = [
                {
                    id: 1,
                    nombre: 'Product 1',
                    descripcion: 'Description 1',
                    categoria: 'Electronics',
                    subcategoria: 'Phones',
                    precio: '99.99',
                    stock: '10'
                },
                {
                    id: 2,
                    nombre: 'Product 2',
                    descripcion: 'Description 2',
                    categoria: 'Electronics',
                    subcategoria: 'Laptops',
                    precio: '199.99',
                    stock: '5'
                }
            ];

            mockDb.query.mockResolvedValue(mockProductos);

            const result = await productoModel.obtenerPorCategoria('Electronics');

            expect(mockDb.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE categoria = ?'),
                ['Electronics']
            );
            expect(result).toHaveLength(2);
            expect(result[0].categoria).toBe('Electronics');
            expect(result[1].categoria).toBe('Electronics');
        });
    });

    describe('obtenerRutaImagen', () => {
        test('should return default image when no specific image exists', () => {
            const result = productoModel.obtenerRutaImagen(999);
            expect(result).toBe('default.jpg');
        });
    });
});
