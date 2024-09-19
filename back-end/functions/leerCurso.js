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
  // Consulta SQL para obtener los cursos
  const sql = 'SELECT idCurso, nombreCurso FROM curso';

  // Retornar una promesa para manejar la consulta de manera asíncrona
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results) => {
      if (error) {
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: 'Error al obtener los cursos: ' + error })
        });
      } else {
        resolve({
          statusCode: 200,
          body: JSON.stringify(results) // Devolver los resultados en formato JSON
        });
      }
    });
  });
};
