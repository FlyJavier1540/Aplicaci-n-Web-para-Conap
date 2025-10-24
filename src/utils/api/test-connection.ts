/**
 * Script de diagnóstico para verificar conexión con el backend
 * Ejecuta esto en la consola del navegador para verificar la conexión
 */

export const testBackendConnection = async () => {
  console.log('🔍 Iniciando diagnóstico de conexión...\n');

  // 1. Verificar configuración
  console.log('1️⃣ Verificando configuración:');
  console.log('   API_BASE_URL:', 'http://localhost:3002/api');
  console.log('   import.meta.env:', import.meta?.env);
  console.log('   VITE_API_URL:', import.meta?.env?.VITE_API_URL);
  console.log('');

  // 2. Probar fetch directo (sin Axios)
  console.log('2️⃣ Probando conexión directa con fetch...');
  try {
    const response = await fetch('http://localhost:3002/api/catalogos/roles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('   ✅ Conexión exitosa!');
    console.log('   Status:', response.status);
    const data = await response.json();
    console.log('   Datos:', data);
  } catch (error: any) {
    console.error('   ❌ Error de conexión:', error.message);
    console.log('   Esto significa que el backend NO está corriendo o no es accesible');
  }
  console.log('');

  // 3. Verificar que el backend esté corriendo
  console.log('3️⃣ Instrucciones:');
  console.log('   Si ves "❌ Error de conexión", sigue estos pasos:');
  console.log('');
  console.log('   a) Verifica que el backend esté corriendo:');
  console.log('      Terminal → cd backend-guardarrecursos');
  console.log('      Terminal → npm start');
  console.log('      Debes ver: "Servidor Express escuchando en http://localhost:3002"');
  console.log('');
  console.log('   b) Verifica que el puerto sea el correcto:');
  console.log('      En backend/.env debe estar: PORT=3002');
  console.log('');
  console.log('   c) Verifica CORS en el backend:');
  console.log('      En backend/index.js debe tener:');
  console.log('      app.use(cors({');
  console.log('        origin: "http://localhost:5173",');
  console.log('        methods: ["GET", "POST", "PUT", "DELETE"],');
  console.log('        allowedHeaders: ["Content-Type", "Authorization"]');
  console.log('      }));');
  console.log('');
  console.log('   d) Prueba el backend directamente:');
  console.log('      Abre en el navegador: http://localhost:3002/api/catalogos/roles');
  console.log('      Debe mostrar JSON con los roles');
};

// Ejecutar automáticamente en desarrollo
if (import.meta.env.DEV) {
  console.log('💡 Ejecuta testBackendConnection() en la consola para diagnosticar problemas de conexión');
}

export default testBackendConnection;
