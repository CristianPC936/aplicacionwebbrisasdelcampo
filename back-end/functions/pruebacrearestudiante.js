const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'fdb1029.awardspace.net',
    user: '4529799_proyectograduacion',
    password: 'y)JdX@_u3y%;MCwa',
    database: '4529799_proyectograduacion'
});
exports.handler = async (event, context) => {
    const { nombre, apellido, edad, grado } = JSON.parse(event.body);
    if (!nombre || !apellido || !edad || !grado) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Todos los campos son obligatorios' })
        };
    }
    const query = 'INSERT INTO estudiantes (nombre, apellido, edad, grado, fecha_registro) VALUES (?, ?, ?, ?, NOW())';
    return new Promise((resolve, reject) => {
        connection.connect(err => {
            if (err) {
                reject({
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Error de conexión a la base de datos' })
                });
                return;
            }
            connection.query(query, [nombre, apellido, edad, grado], (error, results) => {
                if (error) {
                    reject({
                        statusCode: 500,
                        body: JSON.stringify({ error: 'Error al insertar el estudiante' })
                    });
                } else {
                    resolve({
                        statusCode: 200,
                        body: JSON.stringify({ message: 'Estudiante registrado exitosamente', estudianteId: results.insertId })
                    });
                }
                connection.end();
            });
        });
    });
};
