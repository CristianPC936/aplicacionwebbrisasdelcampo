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
  // Habilitar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight check successful' }),
    };
  }

  // Parsear el cuerpo de la solicitud
  const data = JSON.parse(event.body);
  const { idGrado, idSeccion, cicloEscolar } = data;

  // Verificar que los parámetros requeridos estén presentes
  if (!idGrado || !idSeccion || !cicloEscolar) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Faltan parámetros requeridos' })
    };
  }

  // Consulta SQL para obtener los estudiantes según el grado, sección y ciclo escolar
  const sql = `
    SELECT idAlumno, primerNombre, primerApellido
    FROM Alumno
    WHERE idGrado = ? 
    AND idSeccion = ? 
    AND cicloEscolar = ? 
    AND estado = 1
    ORDER BY primerApellido
  `;

  // Retornar una promesa para manejar la consulta de manera asíncrona
  return new Promise((resolve, reject) => {
    connection.query(sql, [idGrado, idSeccion, cicloEscolar], (error, results) => {
      if (error) {
        connection.end();
        return reject({
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Error al obtener los estudiantes: ' + error })
        });
      }

      connection.end();
      resolve({
        statusCode: 200,
        headers,
        body: JSON.stringify(results) // Devolver los resultados en formato JSON
      });
    });
  });
};
