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

        // Ejecutar cargarCursos después de cargar los grados
        cargarCursos();
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

// Función para buscar estudiantes
async function buscarEstudiantes(event) {
    event.preventDefault(); // Evitar que se recargue la página al hacer clic en el botón

    // Obtener los valores de los selects de grado y sección
    const idGrado = document.getElementById('grade').value;
    const idSeccion = document.getElementById('section').value;
    const cicloEscolar = new Date().getFullYear(); // Obtener el año en curso

    // Construir la URL con los parámetros idGrado, idSeccion y cicloEscolar
    const url = `http://localhost:8888/.netlify/functions/leerAlumno?idGrado=${idGrado}&idSeccion=${idSeccion}&cicloEscolar=${cicloEscolar}`;

    try {
        // Realizar la solicitud fetch
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener los estudiantes');
        }

        // Parsear la respuesta JSON
        const estudiantes = await response.json();

        // Limpiar la tabla antes de llenarla con los nuevos datos
        const tbody = document.querySelector('.attendance-table tbody');
        tbody.innerHTML = ''; // Limpiar cualquier fila previa

        // Iterar sobre los estudiantes y agregar filas a la tabla
        estudiantes.forEach(estudiante => {
            const fila = document.createElement('tr');

            // Columna oculta: idAlumno
            const inputIdAlumno = document.createElement('input');
            inputIdAlumno.type = 'hidden';
            inputIdAlumno.value = estudiante.idAlumno;
            fila.appendChild(inputIdAlumno);

            // Columna 1: Nombres completos
            const columnaNombre = document.createElement('td');
            columnaNombre.textContent = `${estudiante.primerNombre} ${estudiante.segundoNombre || ''} ${estudiante.tercerNombre || ''} ${estudiante.primerApellido} ${estudiante.segundoApellido}`;
            fila.appendChild(columnaNombre);

            // Columna 2: Clave del alumno
            const columnaClave = document.createElement('td');
            columnaClave.textContent = estudiante.claveAlumno;
            fila.appendChild(columnaClave);

            // Columna 3: Botón "Editar"
            const columnaEditar = document.createElement('td');
            const botonEditar = document.createElement('button');
            botonEditar.className = 'edit-button';
            botonEditar.textContent = 'Editar';
            columnaEditar.appendChild(botonEditar);
            fila.appendChild(columnaEditar);

            // Columna 4: Botón "Dar de Baja"
            const columnaEliminar = document.createElement('td');
            const botonEliminar = document.createElement('button');
            botonEliminar.className = 'delete-button';
            botonEliminar.textContent = 'Dar de Baja';
            columnaEliminar.appendChild(botonEliminar);
            fila.appendChild(columnaEliminar);

            // Añadir la fila a la tabla
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al buscar los estudiantes:', error);
        alert('Hubo un error al buscar los estudiantes.');
    }
}

// Asignar la función al botón "Buscar Estudiantes"
document.querySelector('.search-button').addEventListener('click', buscarEstudiantes);

// Ejecutar las funciones cuando se carga la página
window.addEventListener('load', function() {
    cargarGrados();
    cargarSecciones();
});
