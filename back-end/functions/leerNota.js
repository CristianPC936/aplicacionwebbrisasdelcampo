const mysql = require('mysql');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'serveo.net',
  user: 'root',
  password: '',
  database: 'pruebaproyecto',
  port: 13306
});

exports.handler = async (event, context) => {
  // Obtener los parámetros de la solicitud (idCurso, bimestre, idGrado, idSeccion)
  const { idCurso, bimestre, idGrado, idSeccion } = event.queryStringParameters;

  // Verificar que todos los parámetros estén presentes
  if (!idCurso || !bimestre || !idGrado || !idSeccion) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'idCurso, bimestre, idGrado, y idSeccion son necesarios' })
    };
  }

  // Consulta SQL para obtener las notas filtradas
  const sql = `
    SELECT n.idNotas, a.primerNombre, a.segundoNombre, a.tercerNombre, a.primerApellido, a.segundoApellido, a.claveAlumno, n.nota
    FROM Alumno a
    INNER JOIN Notas n ON a.idAlumno = n.idAlumno
    WHERE a.idGrado = ? AND a.idSeccion = ? AND n.idCurso = ? AND n.bimestre = ?
  `;

  // Retornar una promesa para manejar la consulta de manera asíncrona
  return new Promise((resolve, reject) => {
    connection.query(sql, [idGrado, idSeccion, idCurso, bimestre], (error, results) => {
      if (error) {
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: 'Error al obtener las notas: ' + error })
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
