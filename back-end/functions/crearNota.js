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
  const data = JSON.parse(event.body); // Parsear los datos de la solicitud POST
  const notas = data.notas; // Lista de notas a registrar

  // Generar la consulta SQL para insertar varias filas
  let sql = 'INSERT INTO Notas (idAlumno, idCurso, nota, bimestre, cicloEscolar) VALUES ?';

  // Estructurar los valores a insertar en la consulta
  const values = notas.map(nota => [nota.idAlumno, nota.idCurso, nota.nota, nota.bimestre, nota.cicloEscolar]);

  // Retornar una promesa para manejar la consulta de manera asíncrona
  return new Promise((resolve, reject) => {
    connection.query(sql, [values], (error, result) => {
      if (error) {
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: 'Error al registrar las notas: ' + error })
        });
      } else {
        resolve({
          statusCode: 200,
          body: JSON.stringify({ message: 'Notas registradas exitosamente', result })
        });
      }
    });
  });
};
