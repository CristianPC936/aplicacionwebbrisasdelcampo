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
  // Obtener el parámetro idGrado de la solicitud
  const { idGrado } = event.queryStringParameters;

  // Verificar que idGrado esté presente
  if (!idGrado) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'El parámetro idGrado es necesario' })
    };
  }

  // Consulta SQL para obtener los cursos correspondientes al idGrado
  const sql = `
    SELECT c.idCurso, c.nombreCurso
    FROM curso c
    INNER JOIN grado_has_curso ghc ON c.idCurso = ghc.idCurso
    WHERE ghc.idGrado = ?
  `;

  // Retornar una promesa para manejar la consulta de manera asíncrona
  return new Promise((resolve, reject) => {
    connection.query(sql, [idGrado], (error, results) => {
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
