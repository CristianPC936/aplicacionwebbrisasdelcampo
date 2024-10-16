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
    // Responder a la solicitud OPTIONS (preflight)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight check successful' }),
    };
  }

  const data = JSON.parse(event.body);
  const { idAlumno, idGrado, cicloEscolar } = data;

  if (!idAlumno || !idGrado || !cicloEscolar) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Faltan parámetros necesarios' }),
    };
  }

  // Consulta SQL para obtener las notas del boletín del alumno
  const sql = `
    SELECT c.nombreCurso, n.bimestre, n.nota
    FROM notas n
    INNER JOIN curso c ON n.idCurso = c.idCurso
    INNER JOIN grado_has_curso ghc ON c.idCurso = ghc.idCurso
    WHERE n.idAlumno = ? AND ghc.idGrado = ? AND n.cicloEscolar = ?
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, [idAlumno, idGrado, cicloEscolar], (error, results) => {
      if (error) {
        reject({
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Error al obtener el boletín: ' + error }),
        });
      } else {
        resolve({
          statusCode: 200,
          headers,
          body: JSON.stringify(results),
        });
      }
    });
  });
};
