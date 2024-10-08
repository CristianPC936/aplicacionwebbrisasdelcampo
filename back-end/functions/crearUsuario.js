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

  // Extraer los datos del docente del cuerpo de la solicitud
  const {
    primerNombre,
    segundoNombre,
    tercerNombre,
    primerApellido,
    segundoApellido,
    nombreUsuario,
    contrasenia,
    idGrado,
    idSeccion,
    cicloEscolar
  } = JSON.parse(event.body);

  // Validar que todos los campos obligatorios estén presentes
  if (!primerNombre || !primerApellido || !nombreUsuario || !contrasenia || !idGrado || !idSeccion) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Faltan campos obligatorios' }),
    };
  }

  // Consulta para insertar el docente
  const query = `INSERT INTO Docente (
    primerNombre,
    segundoNombre,
    tercerNombre,
    primerApellido,
    segundoApellido,
    nombreUsuario,
    contrasenia,
    idGrado,
    idSeccion,
    cicloEscolar
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    primerNombre,
    segundoNombre || null,
    tercerNombre || null,
    primerApellido,
    segundoApellido || null,
    nombreUsuario,
    contrasenia,
    idGrado,
    idSeccion,
    cicloEscolar || null
  ];

  return new Promise((resolve, reject) => {
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error al registrar el docente:', error);
        resolve({
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: 'Error al registrar el docente' }),
        });
      } else {
        resolve({
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Docente registrado exitosamente', idDocente: results.insertId }),
        });
      }
    });
  });
};
