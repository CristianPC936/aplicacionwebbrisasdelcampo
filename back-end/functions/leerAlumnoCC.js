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
  // Obtener los parámetros de la solicitud (idGrado, idSeccion, cicloEscolar)
  const { idGrado, idSeccion, cicloEscolar } = event.queryStringParameters;

  // Verificar que idGrado, idSeccion y cicloEscolar estén presentes
  if (!idGrado || !idSeccion || !cicloEscolar) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'idGrado, idSeccion y cicloEscolar son necesarios' })
    };
  }

    // Consulta SQL para obtener los alumnos filtrados por idGrado, idSeccion y cicloEscolar
    const sql = `SELECT idAlumno, primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, claveAlumno, correoElectronico
               FROM Alumno 
               WHERE idGrado = ? AND idSeccion = ? AND cicloEscolar = ?`;

  // Retornar una promesa para manejar la consulta de manera asíncrona
  return new Promise((resolve, reject) => {
    connection.query(sql, [idGrado, idSeccion, cicloEscolar], (error, results) => {
      if (error) {
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: 'Error al obtener los alumnos: ' + error })
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
