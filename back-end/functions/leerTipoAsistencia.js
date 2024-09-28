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
  return new Promise((resolve, reject) => {
    // Realizar la consulta SQL para obtener los valores de tipoAsistencia
    const query = 'SELECT idtipoAsistencia, nombreAsistencia FROM tipoAsistencia';

    // Conectar a la base de datos y ejecutar la consulta
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error al consultar la tabla tipoAsistencia:', error);
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: 'Error al obtener los datos de asistencia' }),
        });
      } else {
        // Devolver los resultados en formato JSON
        resolve({
          statusCode: 200,
          body: JSON.stringify(results),
        });
      }
    });
  });
};
