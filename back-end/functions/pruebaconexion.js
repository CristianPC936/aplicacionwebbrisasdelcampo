// Importar el paquete mysql
const mysql = require('mysql');

// Configuración de la base de datos (usa los mismos datos que en tu función serverless)
const connection = mysql.createConnection({
  host: 'serveo.net',    // La URL proporcionada por Serveo
  user: 'root',          // Usuario de MySQL (en XAMPP el usuario por defecto es 'root')
  password: '',          // Contraseña de MySQL (en XAMPP normalmente es vacío)
  database: 'pruebaproyecto',  // Nombre de la base de datos en XAMPP
  port: 13306            // El puerto proporcionado por Serveo
});

// Intentar conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos con el ID ' + connection.threadId);
  
  // Aquí podrías agregar más código para ejecutar una consulta si la conexión es exitosa
});

// Cerrar la conexión
connection.end();
