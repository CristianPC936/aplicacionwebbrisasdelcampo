const mysql = require('mysql');

exports.handler = async (event, context) => {
    const connection = mysql.createConnection({
        host: 'serveo.net',
        user: 'root',
        password: '',
        database: 'pruebaproyecto',
        port: 13306
    });

    const { primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, claveAlumno, idGrado, idSeccion, cicloEscolar } = JSON.parse(event.body);

    const query = `
        INSERT INTO alumno (primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, claveAlumno, idGrado, idSeccion, cicloEscolar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, claveAlumno, idGrado, idSeccion, cicloEscolar];

    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                reject({
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Error inserting data', error: error.message })
                });
            } else {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Alumno inserted successfully', id: results.insertId })
                });
            }
        });
        connection.end();
    });
};
