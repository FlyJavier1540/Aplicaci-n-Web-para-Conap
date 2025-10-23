import pg from 'pg';
import 'dotenv/config'; // Variables .env

const { 
  Pool 
} = pg;

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

// Crea el Pool de Conexiones (reutilizable y eficiente)
const pool = new Pool(config);

/**
 * Función para probar la conexión a la base de datos.
 */
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Conexión exitosa a PostgreSQL!');
    client.release();
  } catch (err) {
    console.error('Error al conectar a PostgreSQL:', err.message);
    console.log('Configuración de DB utilizada:', { 
        host: config.host, 
        database: config.database, 
        user: config.user 
    });
    process.exit(1); // Sale si la conexión falla
  }
}

// Exporta el pool para que los controladores puedan hacer consultas
export { 
  pool, 
  testConnection 
};