const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'serveo.net',
  user: 'root',
  password: '',
  database: 'pruebaproyecto',
  port: 13306,
});

exports.handler = async (event, context) => {
  // Habilitar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Método no permitido' }),
    };
  }

  // Extraer el nombre del curso del cuerpo de la solicitud
  const { nombreCurso } = JSON.parse(event.body);

  if (!nombreCurso) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'El nombre del curso es obligatorio' }),
    };
  }

  // Conectar a la base de datos y registrar el curso
  const query = `INSERT INTO curso (nombreCurso) VALUES (?)`;

  return new Promise((resolve, reject) => {
    connection.query(query, [nombreCurso], (error, results) => {
      if (error) {
        console.error('Error al registrar el curso:', error);
        resolve({
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: 'Error al registrar el curso' }),
        });
      } else {
        resolve({
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Curso registrado exitosamente', idCurso: results.insertId }),
        });
      }
    });
  });
};
