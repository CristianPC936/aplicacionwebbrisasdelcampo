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

// Función para cargar los cursos cuando cambia el grado
async function cargarCursos() {
    const selectGrado = document.getElementById('grade');
    const selectCurso = document.getElementById('course');

    // Obtener el idGrado seleccionado
    const idGrado = selectGrado.value;

    try {
        // Hacer la solicitud fetch a la función leerCurso con el idGrado
        const response = await fetch(`http://localhost:8888/.netlify/functions/leerCurso?idGrado=${idGrado}`);

        if (!response.ok) {
            throw new Error('Error en la solicitud de cursos');
        }

        const cursos = await response.json();

        // Limpiar las opciones previas del select de cursos
        selectCurso.innerHTML = '';

        // Iterar sobre los cursos y crear opciones
        cursos.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.idCurso; // Usar idCurso como el valor de la opción
            option.textContent = curso.nombreCurso; // Mostrar nombreCurso como el texto de la opción
            selectCurso.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los cursos:', error);
    }
}

// Función para listar las notas y realizar las solicitudes fetch
async function listarNotas() {
    const idGrado = document.getElementById('grade').value;
    const idSeccion = document.getElementById('section').value;
    const idCurso = document.getElementById('course').value;
    const bimestre = document.getElementById('bimester').value;
    const cicloEscolar = new Date().getFullYear(); // Obtener el año en curso

    try {
        // Primera solicitud fetch: verificar si ya existen notas registradas
        const urlNotas = `http://localhost:8888/.netlify/functions/leerNota?idCurso=${idCurso}&bimestre=${bimestre}&idGrado=${idGrado}&idSeccion=${idSeccion}`;
        const responseNotas = await fetch(urlNotas);
        
        if (!responseNotas.ok) {
            throw new Error('Error en la solicitud de notas');
        }
        
        const dataNotas = await responseNotas.json();
        
        if (dataNotas.length > 0) {
            alert("Ya existen notas registradas en este grado, sección, curso y bimestre.");
            return; // Detener la ejecución si ya hay notas registradas
        }

        // Segunda solicitud fetch: leer alumnos del grado y sección seleccionados
        const urlAlumno = `http://localhost:8888/.netlify/functions/leerAlumno?idGrado=${idGrado}&idSeccion=${idSeccion}&cicloEscolar=${cicloEscolar}`;
        const responseAlumno = await fetch(urlAlumno);
        
        if (!responseAlumno.ok) {
            throw new Error('Error en la solicitud de alumnos');
        }
        
        const alumnos = await responseAlumno.json();

        // Limpiar la tabla de notas antes de llenarla
        const tbody = document.querySelector('.attendance-table tbody');
        tbody.innerHTML = ''; // Limpiar cualquier fila previa

        // Iterar sobre los alumnos y crear filas para la tabla
        alumnos.forEach(alumno => {
            const fila = document.createElement('tr');
            
            // Columna oculta: idAlumno
            const inputIdAlumno = document.createElement('input');
            inputIdAlumno.type = 'hidden';
            inputIdAlumno.value = alumno.idAlumno;
            fila.appendChild(inputIdAlumno);

            // Columna 1: Nombres completos
            const columnaNombre = document.createElement('td');
            columnaNombre.textContent = `${alumno.primerNombre} ${alumno.segundoNombre} ${alumno.tercerNombre} ${alumno.primerApellido} ${alumno.segundoApellido}`;
            fila.appendChild(columnaNombre);
            
            // Columna 2: Clave del alumno
            const columnaClave = document.createElement('td');
            columnaClave.textContent = alumno.claveAlumno;
            fila.appendChild(columnaClave);
            
            // Columna 3: Input para la nota
            const columnaNota = document.createElement('td');
            const inputNota = document.createElement('input');
            inputNota.type = 'text';
            inputNota.placeholder = 'Ingrese nota'; // Puede ajustar según lo necesario
            columnaNota.appendChild(inputNota);
            fila.appendChild(columnaNota);
            
            // Añadir la fila a la tabla
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al listar las notas:', error);
    }
}

// Función para guardar las notas
async function guardarNotas() {
    const idCurso = document.getElementById('course').value; // Tomar el idCurso del select
    const bimestre = document.getElementById('bimester').value; // Tomar el bimestre del select
    const cicloEscolar = new Date().getFullYear(); // Obtener el año en curso

    // Obtener todas las filas de la tabla de notas
    const filas = document.querySelectorAll('.attendance-table tbody tr');
    
    // Crear un array para almacenar las notas de cada alumno
    const notas = [];

    filas.forEach(fila => {
        const idAlumno = fila.querySelector('input[type="hidden"]').value; // Obtener el idAlumno de la columna oculta
        const nota = fila.querySelector('input[type="text"]').value; // Obtener el valor de la nota del input

        // Verificar que la nota no esté vacía y sea válida
        if (!nota || isNaN(nota) || nota < 0 || nota > 100) {
            alert('Por favor, ingrese una nota válida entre 0 y 100.');
            return;
        }

        // Agregar el registro de la nota al array de notas
        notas.push({
            idAlumno: idAlumno,
            idCurso: idCurso,
            nota: parseInt(nota), // Asegurar que la nota sea un número
            bimestre: bimestre,
            cicloEscolar: cicloEscolar
        });
    });

    // Crear el JSON con las notas
    const data = { notas: notas };

    try {
        // Realizar la solicitud POST a la función serverless
        const response = await fetch('http://localhost:8888/.netlify/functions/crearNota', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Notas registradas exitosamente.');
        } else {
            throw new Error('Error al registrar las notas');
        }
    } catch (error) {
        console.error('Error al guardar las notas:', error);
        alert('Hubo un error al intentar registrar las notas.');
    }
}

// Asignar la función al botón de guardar
document.querySelector('.save-button').addEventListener('click', guardarNotas);

// Usar addEventListener para que ambas funciones se ejecuten al cargar la página
window.addEventListener('load', function() {
    cargarGrados();
    cargarSecciones();
});

// Añadir un event listener al select de grado para detectar cambios
document.getElementById('grade').addEventListener('change', cargarCursos);

// Asignar la función al botón de búsqueda
document.querySelector('.search-button').addEventListener('click', listarNotas);