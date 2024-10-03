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

    const { idAlumno } = JSON.parse(event.body);

    // Consulta SQL para eliminar el alumno
    const query = `UPDATE Alumno SET estado = 0 WHERE idAlumno = ?`;
    const values = [idAlumno];

    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error al eliminar el estudiante:', error);
                resolve({
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Error al eliminar el estudiante' }),
                });
            } else {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Estudiante eliminado exitosamente' }),
                });
            }
        });
    });
};
