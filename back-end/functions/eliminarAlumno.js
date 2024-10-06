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

    const { idAlumno } = JSON.parse(event.body);

    // Consulta SQL para eliminar el alumno (estado = 0)
    const query = `UPDATE Alumno SET estado = 0 WHERE idAlumno = ?`;
    const values = [idAlumno];

    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error al eliminar el estudiante:', error);
                resolve({
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ message: 'Error al eliminar el estudiante' }),
                });
            } else {
                resolve({
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ message: 'Estudiante eliminado exitosamente' }),
                });
            }
        });
    });
};
