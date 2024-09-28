const mysql = require('mysql');

const dbConfig = {
    host: 'serveo.net',
    user: 'root',
    password: '',
    database: 'pruebaproyecto',
    port: 13306
};

exports.handler = async (event, context) => {
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
            body: JSON.stringify({ message: 'Asistencia actualizada correctamente' })
        };
    } catch (error) {
        console.error('Error actualizando la asistencia:', error);
        connection.end();
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error actualizando la asistencia' })
        };
    }
};
