const mysql = require('mysql');

const dbConfig = {
    host: 'serveo.net',
    user: 'root',
    password: '',
    database: 'pruebaproyecto',
    port: 13306
};

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

    const connection = mysql.createConnection(dbConfig);

    const { asistencias } = JSON.parse(event.body);

    // Promisify connection.query to use async/await
    const query = (sql, params) => new Promise((resolve, reject) => {
        connection.query(sql, params, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

    try {
        connection.connect();

        // Actualizar cada registro de asistencia
        for (const asistencia of asistencias) {
            const { idAsistencia, idtipoAsistencia } = asistencia;

            // Consulta para actualizar la asistencia
            const sql = 'UPDATE Asistencia SET idtipoAsistencia = ? WHERE idAsistencia = ?';
            await query(sql, [idtipoAsistencia, idAsistencia]);
        }

        connection.end();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Asistencia actualizada correctamente' })
        };
    } catch (error) {
        console.error('Error actualizando la asistencia:', error);
        connection.end();
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Error actualizando la asistencia' })
        };
    }
};
