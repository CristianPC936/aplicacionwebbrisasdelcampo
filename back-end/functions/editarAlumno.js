const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'serveo.net',
  user: 'root',
  password: '',
  database: 'pruebaproyecto',
  port: 13306,
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
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

  // Query to update student information
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
          body: JSON.stringify({ message: 'Error al actualizar el estudiante' }),
        });
      } else {
        resolve({
          statusCode: 200,
          body: JSON.stringify({ message: 'Estudiante actualizado exitosamente' }),
        });
      }
    });
  });
};
