const mysql = require('mysql');

// Crear la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'serveo.net',
  user: 'root',
  password: '',
  database: 'pruebaproyecto',
  port: 13306
});

// Función serverless para leer los valores de la tabla tipoAsistencia
exports.handler = async (event, context) => {
  // Habilitar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    // Responder a la solicitud OPTIONS (preflight)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight check successful' }),
    };
  }

  return new Promise((resolve, reject) => {
    // Realizar la consulta SQL para obtener los valores de tipoAsistencia
    const query = 'SELECT idtipoAsistencia, nombreAsistencia FROM tipoAsistencia';

    // Conectar a la base de datos y ejecutar la consulta
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error al consultar la tabla tipoAsistencia:', error);
        reject({
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Error al obtener los datos de asistencia' }),
        });
      } else {
        // Devolver los resultados en formato JSON
        resolve({
          statusCode: 200,
          headers,
          body: JSON.stringify(results),
        });
      }
    });
  });
};
