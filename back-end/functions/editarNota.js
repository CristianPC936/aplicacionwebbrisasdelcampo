const mysql = require('mysql');

// Configuración de la conexión a la base de datos
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

    const { notas } = JSON.parse(event.body);

    // Promisificar connection.query para usar async/await
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

        // Actualizar cada registro de nota
        for (const nota of notas) {
            const { idNotas, nota: nuevaNota } = nota;

            // Consulta para actualizar la nota
            const sql = 'UPDATE Notas SET nota = ? WHERE idNotas = ?';
            await query(sql, [nuevaNota, idNotas]);
        }

        connection.end();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Notas actualizadas correctamente' })
        };
    } catch (error) {
        console.error('Error actualizando las notas:', error);
        connection.end();
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Error actualizando las notas' })
        };
    }
};
