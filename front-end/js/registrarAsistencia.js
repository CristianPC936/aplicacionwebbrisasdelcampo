document.getElementById('nav-toggle').addEventListener('click', function() {
    var sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('hidden'); // Alterna la clase 'hidden' para desplazar el aside
});

// Función para llenar el select con los grados
async function cargarGrados() {
    try {
        const response = await fetch('http://localhost:8888/.netlify/functions/leerGrado');
        
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        
        const grados = await response.json();
        const selectGrado = document.getElementById('grade');
        
        // Limpiar cualquier opción previa
        selectGrado.innerHTML = '';

        // Iterar sobre los grados y crear opciones
        grados.forEach(grado => {
            const option = document.createElement('option');
            option.value = grado.idGrado; // Usar idGrado como el valor de la opción
            option.textContent = grado.nombreGrado; // Mostrar nombreGrado como el texto de la opción
            selectGrado.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los grados:', error);
    }
}

// Función para llenar el select con las secciones
async function cargarSecciones() {
    try {
        const response = await fetch('http://localhost:8888/.netlify/functions/leerSeccion');
        
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        
        const secciones = await response.json();
        const selectSeccion = document.getElementById('section');
        
        // Limpiar cualquier opción previa
        selectSeccion.innerHTML = '';

        // Iterar sobre las secciones y crear opciones
        secciones.forEach(seccion => {
            const option = document.createElement('option');
            option.value = seccion.idSeccion; // Usar idSeccion como el valor de la opción
            option.textContent = seccion.nombreSeccion; // Mostrar nombreSeccion como el texto de la opción
            selectSeccion.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las secciones:', error);
    }
}

// Usar addEventListener para que ambas funciones se ejecuten al cargar la página
window.addEventListener('load', function() {
    cargarGrados();
    cargarSecciones();
});

// Función para listar asistencia y realizar las solicitudes fetch
async function listarAsistencia() {
    const idGrado = document.getElementById('grade').value;
    const idSeccion = document.getElementById('section').value;
    const fecha = document.getElementById('date').value;
    const cicloEscolar = new Date().getFullYear(); // Obtener el año en curso

    try {
        // Primera solicitud fetch: verificar si existe registro de asistencia
        const urlAsistencia = `http://localhost:8888/.netlify/functions/leerAsistencia?idGrado=${idGrado}&idSeccion=${idSeccion}&fecha=${fecha}`;
        const responseAsistencia = await fetch(urlAsistencia);
        
        if (!responseAsistencia.ok) {
            throw new Error('Error en la solicitud de asistencia');
        }
        
        const dataAsistencia = await responseAsistencia.json();
        
        if (dataAsistencia.length > 0) {
            alert("Ya existe un registro de asistencia para esta fecha.");
            return; // Detener la ejecución si ya existe un registro
        }

        // Segunda solicitud fetch: leer alumnos del grado y sección seleccionados
        const urlAlumno = `http://localhost:8888/.netlify/functions/leerAlumno?idGrado=${idGrado}&idSeccion=${idSeccion}&cicloEscolar=${cicloEscolar}`;
        const responseAlumno = await fetch(urlAlumno);
        
        if (!responseAlumno.ok) {
            throw new Error('Error en la solicitud de alumnos');
        }
        
        const alumnos = await responseAlumno.json();

        // Tercera solicitud fetch: leer tipos de asistencia
        const urlTipoAsistencia = `http://localhost:8888/.netlify/functions/leerTipoAsistencia`;
        const responseTipoAsistencia = await fetch(urlTipoAsistencia);
        
        if (!responseTipoAsistencia.ok) {
            throw new Error('Error en la solicitud de tipos de asistencia');
        }

        const tiposAsistencia = await responseTipoAsistencia.json();

        // Limpiar la tabla de asistencia antes de llenarla
        const tbody = document.querySelector('.attendance-table tbody');
        tbody.innerHTML = ''; // Limpiar cualquier fila previa

        // Iterar sobre los alumnos y crear filas para la tabla
        alumnos.forEach(alumno => {
            const fila = document.createElement('tr');
            
            // Guardar idAlumno como atributo oculto en la fila
            fila.setAttribute('data-id-alumno', alumno.idAlumno);

            // Columna 1: Nombres completos
            const columnaNombre = document.createElement('td');
            columnaNombre.textContent = `${alumno.primerNombre} ${alumno.segundoNombre} ${alumno.tercerNombre} ${alumno.primerApellido} ${alumno.segundoApellido}`;
            fila.appendChild(columnaNombre);
            
            // Columna 2: Clave del alumno
            const columnaClave = document.createElement('td');
            columnaClave.textContent = alumno.claveAlumno;
            fila.appendChild(columnaClave);
            
            // Columna 3: Select para el tipo de asistencia
            const columnaAsistencia = document.createElement('td');
            const selectAsistencia = document.createElement('select');

            // Llenar el select con los tipos de asistencia
            tiposAsistencia.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.idtipoAsistencia;
                option.textContent = tipo.nombreAsistencia;
                selectAsistencia.appendChild(option);
            });

            columnaAsistencia.appendChild(selectAsistencia);
            fila.appendChild(columnaAsistencia);
            
            // Añadir la fila a la tabla
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al listar la asistencia:', error);
    }
}

function guardarAsistencia() {
    const fecha = document.getElementById('date').value;
    const tbody = document.querySelector('.attendance-table tbody');
    const registrosAsistencia = [];

    // Recorrer cada fila de la tabla para obtener los datos de asistencia
    tbody.querySelectorAll('tr').forEach(fila => {
        const idAlumno = fila.getAttribute('data-id-alumno'); // Recuperar el idAlumno desde el atributo oculto
        const idtipoAsistencia = fila.querySelector('select').value; // Recuperar el idtipoAsistencia seleccionado

        // Crear el objeto de asistencia y añadirlo a la lista
        registrosAsistencia.push({
            idAlumno: idAlumno,
            idtipoAsistencia: idtipoAsistencia,
            fecha: fecha
        });
    });

    // Crear el JSON para la solicitud
    const asistenciaJSON = {
        asistencias: registrosAsistencia
    };

    // Mostrar el JSON en la consola para verificarlo
    console.log(asistenciaJSON);

    // Enviar la solicitud POST a la función serverless
    fetch('http://localhost:8888/.netlify/functions/crearAsistencia', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(asistenciaJSON)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al registrar la asistencia');
        }
        return response.json();
    })
    .then(data => {
        alert('Asistencia registrada exitosamente');
    })
    .catch(error => {
        console.error('Error al registrar la asistencia:', error);
        alert('No se pudo registrar la asistencia');
    });
}

// Asignar la función al botón de guardar
document.querySelector('.save-button').addEventListener('click', guardarAsistencia);

// Asignar la función al botón de búsqueda
document.querySelector('.search-button').addEventListener('click', listarAsistencia);
