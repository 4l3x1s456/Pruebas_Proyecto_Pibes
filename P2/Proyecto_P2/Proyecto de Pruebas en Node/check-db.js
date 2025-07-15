const Database = require('./src/config/database');

async function checkTableStructure() {
    const database = new Database();
    
    try {
        await database.createPool();
        const pool = database.getPool();
        
        console.log('🔍 Verificando estructura de la tabla pedidos...\n');
        
        // Mostrar estructura de la tabla pedidos
        const [columns] = await pool.execute('DESCRIBE pedidos');
        
        console.log('📋 Estructura de la tabla pedidos:');
        console.table(columns);
        
        // Mostrar algunos datos de ejemplo
        const [data] = await pool.execute('SELECT * FROM pedidos LIMIT 3');
        
        console.log('\n📦 Datos de ejemplo:');
        console.table(data);
        
    } catch (error) {
        console.error('❌ Error al verificar estructura:', error);
    } finally {
        process.exit(0);
    }
}

checkTableStructure();
