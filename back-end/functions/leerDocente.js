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

  // Obtener el parámetro de la solicitud (cicloEscolar)
  const { cicloEscolar } = event.queryStringParameters;

  // Verificar que el cicloEscolar esté presente
  if (!cicloEscolar) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'El cicloEscolar es necesario' })
    };
  }

  // Consulta SQL para obtener los docentes filtrados por cicloEscolar
  const sql = `SELECT primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, idGrado, idSeccion
               FROM Docente
               WHERE cicloEscolar = ?`;

  // Retornar una promesa para manejar la consulta de manera asíncrona
  return new Promise((resolve, reject) => {
    connection.query(sql, [cicloEscolar], (error, results) => {
      if (error) {
        reject({
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Error al obtener los docentes: ' + error })
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
