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

  // Extraer los datos del estudiante del cuerpo de la solicitud
  const {
    primerNombre,
    segundoNombre,
    tercerNombre,
    primerApellido,
    segundoApellido,
    claveAlumno,
    idGrado,
    idSeccion,
    cicloEscolar
  } = JSON.parse(event.body);

  // Validar que todos los campos obligatorios estén presentes
  if (!primerNombre || !primerApellido || !claveAlumno || !idGrado || !idSeccion || !cicloEscolar) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Faltan campos obligatorios' }),
    };
  }

  // Consulta para insertar el estudiante con el campo "estado" predefinido como 1
  const query = `INSERT INTO Alumno (
    primerNombre,
    segundoNombre,
    tercerNombre,
    primerApellido,
    segundoApellido,
    claveAlumno,
    idGrado,
    idSeccion,
    cicloEscolar,
    estado
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;

  const values = [
    primerNombre,
    segundoNombre || null,
    tercerNombre || null,
    primerApellido,
    segundoApellido || null,
    claveAlumno,
    idGrado,
    idSeccion,
    cicloEscolar
  ];

  return new Promise((resolve, reject) => {
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error al registrar el estudiante:', error);
        resolve({
          statusCode: 500,
          body: JSON.stringify({ message: 'Error al registrar el estudiante' }),
        });
      } else {
        resolve({
          statusCode: 200,
          body: JSON.stringify({ message: 'Estudiante registrado exitosamente', idAlumno: results.insertId }),
        });
      }
    });
  });
};
