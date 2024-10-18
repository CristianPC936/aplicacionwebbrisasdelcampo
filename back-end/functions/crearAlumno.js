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
    cicloEscolar,
    correoElectronico,
  } = JSON.parse(event.body);

  // Capitalizar los nombres y apellidos
  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const primerNombreCap = capitalize(primerNombre);
  const segundoNombreCap = segundoNombre ? capitalize(segundoNombre) : null;
  const tercerNombreCap = tercerNombre ? capitalize(tercerNombre) : null;
  const primerApellidoCap = capitalize(primerApellido);
  const segundoApellidoCap = segundoApellido ? capitalize(segundoApellido) : null;

  // Validar que todos los campos obligatorios estén presentes
  if (!primerNombreCap || !primerApellidoCap || !claveAlumno || !idGrado || !idSeccion || !cicloEscolar || !correoElectronico) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Faltan campos obligatorios' }),
    };
  }

  // Verificar si el estudiante ya está registrado en el mismo idGrado, idSeccion y cicloEscolar
  const checkStudentQuery = `
    SELECT idAlumno FROM Alumno
    WHERE primerNombre = ? 
    AND primerApellido = ? 
    AND idGrado = ? 
    AND idSeccion = ? 
    AND cicloEscolar = ?
  `;
  
  const checkStudentValues = [
    primerNombreCap,
    primerApellidoCap,
    idGrado,
    idSeccion,
    cicloEscolar,
  ];

  return new Promise((resolve, reject) => {
    connection.query(checkStudentQuery, checkStudentValues, (error, results) => {
      if (error) {
        console.error('Error al verificar si el estudiante ya existe:', error);
        return resolve({
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: 'Error al verificar si el estudiante ya existe' }),
        });
      }

      if (results.length > 0) {
        // Si ya existe un estudiante con el mismo nombre, grado, sección y ciclo
        return resolve({
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Ya está inscrito este estudiante' }),
        });
      }

      // Nueva consulta para verificar si la claveAlumno ya está en uso en el mismo grado, sección y ciclo escolar
      const checkClaveQuery = `
        SELECT idAlumno FROM Alumno
        WHERE claveAlumno = ? 
        AND idGrado = ? 
        AND idSeccion = ? 
        AND cicloEscolar = ?
      `;
      
      const checkClaveValues = [
        claveAlumno,
        idGrado,
        idSeccion,
        cicloEscolar,
      ];

      connection.query(checkClaveQuery, checkClaveValues, (error, results) => {
        if (error) {
          console.error('Error al verificar si la clave del alumno ya está en uso:', error);
          return resolve({
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Error al verificar si la clave del alumno ya está en uso' }),
          });
        }

        if (results.length > 0) {
          // Si ya existe un estudiante con la misma clave en el mismo grado, sección y ciclo escolar
          return resolve({
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'La clave del alumno ya está en uso' }),
          });
        }

        // Si no existen conflictos, insertar el nuevo estudiante
        const insertQuery = `INSERT INTO Alumno (
          primerNombre,
          segundoNombre,
          tercerNombre,
          primerApellido,
          segundoApellido,
          claveAlumno,
          idGrado,
          idSeccion,
          cicloEscolar,
          correoElectronico,
          estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;

        const insertValues = [
          primerNombreCap,
          segundoNombreCap,
          tercerNombreCap,
          primerApellidoCap,
          segundoApellidoCap,
          claveAlumno,
          idGrado,
          idSeccion,
          cicloEscolar,
          correoElectronico,
        ];

        connection.query(insertQuery, insertValues, (error, results) => {
          if (error) {
            console.error('Error al registrar el estudiante:', error);
            return resolve({
              statusCode: 500,
              headers,
              body: JSON.stringify({ message: 'Error al registrar el estudiante' }),
            });
          }

          resolve({
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Estudiante registrado exitosamente', idAlumno: results.insertId }),
          });
        });
      });
    });
  });
};
