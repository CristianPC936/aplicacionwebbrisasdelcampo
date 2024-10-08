const mysql = require('mysql');

// Configurar la conexión a la base de datos
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
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    // Responder a la solicitud OPTIONS antes de una solicitud POST
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

  // Extraer la lista de asistencias del cuerpo de la solicitud
  const asistencias = JSON.parse(event.body).asistencias;

  if (!asistencias || !Array.isArray(asistencias)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'La solicitud debe contener un array de asistencias' }),
    };
  }

  // Validar cada asistencia
  for (const asistencia of asistencias) {
    if (!asistencia.idAlumno || !asistencia.idtipoAsistencia || !asistencia.fecha) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Cada asistencia debe contener idAlumno, idtipoAsistencia y fecha' }),
      };
    }
  }

  // Preparar la consulta para múltiples inserciones
  const query = `INSERT INTO Asistencia (idAlumno, idtipoAsistencia, fecha) VALUES ?`;

  // Transformar la lista de asistencias en un array de arrays para la consulta
  const values = asistencias.map(asistencia => [asistencia.idAlumno, asistencia.idtipoAsistencia, asistencia.fecha]);

  return new Promise((resolve, reject) => {
    connection.query(query, [values], (error, results) => {
      if (error) {
        console.error('Error al registrar las asistencias:', error);
        resolve({
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: 'Error al registrar las asistencias' }),
        });
      } else {
        resolve({
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: `${results.affectedRows} asistencias registradas exitosamente` }),
        });
      }
    });
  });
};
