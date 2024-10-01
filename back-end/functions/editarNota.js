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
            body: JSON.stringify({ message: 'Notas actualizadas correctamente' })
        };
    } catch (error) {
        console.error('Error actualizando las notas:', error);
        connection.end();
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error actualizando las notas' })
        };
    }
};
