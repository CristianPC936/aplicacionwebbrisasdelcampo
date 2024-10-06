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

  const {
    idAlumno,
    primerNombre,
    segundoNombre,
    tercerNombre,
    primerApellido,
    segundoApellido,
    correoElectronico,
  } = JSON.parse(event.body);

  // Query para actualizar la información del estudiante
  const query = `UPDATE Alumno SET primerNombre = ?, segundoNombre = ?, tercerNombre = ?, primerApellido = ?, segundoApellido = ?, correoElectronico = ? WHERE idAlumno = ?`;
  const values = [
    primerNombre,
    segundoNombre || null,
    tercerNombre || null,
    primerApellido,
    segundoApellido || null,
    correoElectronico || null,
    idAlumno,
  ];

  return new Promise((resolve, reject) => {
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error al actualizar el estudiante:', error);
        resolve({
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: 'Error al actualizar el estudiante' }),
        });
      } else {
        resolve({
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Estudiante actualizado exitosamente' }),
        });
      }
    });
  });
};
