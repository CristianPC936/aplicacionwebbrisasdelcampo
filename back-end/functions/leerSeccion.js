const mysql = require('mysql');

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'serveo.net',
  user: 'root',
  password: '',
  database: 'pruebaproyecto',
  port: 13306
});

exports.handler = async (event, context) => {
  // Consulta SQL para obtener las secciones
  const sql = 'SELECT idSeccion, nombreSeccion FROM Seccion';

  // Retornar una promesa para manejar la consulta de manera asíncrona
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results) => {
      if (error) {
        reject({
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',  // Permitir solicitudes desde cualquier origen
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',  // Métodos permitidos
            'Access-Control-Allow-Headers': 'Content-Type'  // Encabezados permitidos
          },
          body: JSON.stringify({ error: 'Error al obtener las secciones: ' + error })
        });
      } else {
        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',  // Permitir solicitudes desde cualquier origen
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',  // Métodos permitidos
            'Access-Control-Allow-Headers': 'Content-Type'  // Encabezados permitidos
          },
          body: JSON.stringify(results)  // Devolver los resultados en formato JSON
        });
      }
    });
  });
};
