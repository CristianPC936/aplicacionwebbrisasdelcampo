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

  // Obtener los parámetros de la solicitud (idGrado, idSeccion, fecha)
  const { idGrado, idSeccion, fecha } = event.queryStringParameters;

  // Verificar que todos los parámetros estén presentes
  if (!idGrado || !idSeccion || !fecha) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'idGrado, idSeccion y fecha son necesarios' })
    };
  }

  // Consulta SQL para obtener la asistencia filtrada
  const sql = `
    SELECT at.idAsistencia, a.primerNombre, a.segundoNombre, a.tercerNombre, a.primerApellido, a.segundoApellido, a.claveAlumno, at.idtipoAsistencia
    FROM Alumno a
    INNER JOIN Asistencia at ON a.idAlumno = at.idAlumno
    WHERE a.idGrado = ? AND a.idSeccion = ? AND at.fecha = ?
  `;

  // Retornar una promesa para manejar la consulta de manera asíncrona
  return new Promise((resolve, reject) => {
    connection.query(sql, [idGrado, idSeccion, fecha], (error, results) => {
      if (error) {
        reject({
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Error al obtener la asistencia: ' + error })
        });
      } else {
        resolve({
          statusCode: 200,
          headers,
          body: JSON.stringify(results) // Devolver los resultados en formato JSON
        });
      }
    });
  });
};
