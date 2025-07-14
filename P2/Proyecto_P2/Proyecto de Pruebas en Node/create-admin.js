const Database = require('./src/config/database');

async function createAdminUser() {
    const database = new Database();
    
    try {
        await database.createPool();
        const pool = database.getPool();
        
        // Verificar si ya existe un admin
        const [existingAdmin] = await pool.execute(
            'SELECT * FROM usuarios WHERE correo = ?', 
            ['admin@agstore.com']
        );
        
        if (existingAdmin.length > 0) {
            console.log('❌ El usuario administrador ya existe');
            return;
        }
        
        // Crear usuario administrador
        const [result] = await pool.execute(
            'INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol) VALUES (?, ?, ?, ?, ?)',
            ['Administrador', 'Sistema', 'admin@agstore.com', 'admin123', 'admin']
        );
        
        console.log('✅ Usuario administrador creado exitosamente:');
        console.log('📧 Email: admin@agstore.com');
        console.log('🔑 Contraseña: admin123');
        console.log('👤 Rol: admin');
        console.log(`🆔 ID: ${result.insertId}`);
        
    } catch (error) {
        console.error('❌ Error al crear usuario administrador:', error);
    } finally {
        process.exit(0);
    }
}

createAdminUser();
