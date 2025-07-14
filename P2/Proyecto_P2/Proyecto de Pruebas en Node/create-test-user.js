const Database = require('./src/config/database');

async function createTestUser() {
    const database = new Database();
    
    try {
        await database.createPool();
        const pool = database.getPool();
        
        // Verificar si ya existe el usuario de prueba
        const [existingUser] = await pool.execute(
            'SELECT * FROM usuarios WHERE correo = ?', 
            ['test@test.com']
        );
        
        if (existingUser.length > 0) {
            console.log('❌ El usuario de prueba ya existe');
            return;
        }
        
        // Crear usuario de prueba
        const [result] = await pool.execute(
            'INSERT INTO usuarios (nombre, apellido, correo, contrasena) VALUES (?, ?, ?, ?)',
            ['Usuario', 'Prueba', 'test@test.com', 'test123']
        );
        
        console.log('✅ Usuario de prueba creado exitosamente:');
        console.log('📧 Email: test@test.com');
        console.log('🔑 Contraseña: test123');
        console.log(`🆔 ID: ${result.insertId}`);
        
    } catch (error) {
        console.error('❌ Error al crear usuario de prueba:', error);
    } finally {
        process.exit(0);
    }
}

createTestUser();
