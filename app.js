// =============================================================================
// TUTORIAL: FORMULARIO DE REGISTRO DE ALUMNOS
// =============================================================================
// En este archivo aprenderás:
// 1. Cómo validar formularios con JavaScript
// 2. Qué es el patrón Builder y cómo usarlo
// 3. Qué son los prototipos en JavaScript
// 4. Cómo cargar datos dinámicamente desde JSON
// 5. Cómo trabajar con expresiones regulares
// =============================================================================

// -----------------------------------------------------------------------------
// 1. VARIABLE GLOBAL PARA ALMACENAR LOS DATOS DEL JSON
// -----------------------------------------------------------------------------
// Esta variable guardará todos los datos que carguemos del archivo JSON
// La declaramos aquí para que esté disponible en todo el código
let datosJSON = null;

// -----------------------------------------------------------------------------
// 2. FUNCIÓN PARA CARGAR DATOS DESDE JSON
// -----------------------------------------------------------------------------
// Esta función se ejecuta cuando la página termina de cargar
// async/await nos permite esperar a que los datos se carguen antes de continuar
async function cargarDatosJSON() {
    try {
        // fetch() hace una petición para obtener el archivo JSON
        const respuesta = await fetch('datos.json');

        // Convertimos la respuesta a formato JSON (objeto JavaScript)
        datosJSON = await respuesta.json();

        console.log('✅ Datos JSON cargados correctamente:', datosJSON);

        // Una vez cargados los datos, inicializamos los desplegables
        inicializarDesplegables();

    } catch (error) {
        console.error('❌ Error al cargar datos JSON:', error);
        alert('Error al cargar los datos necesarios. Por favor, recarga la página.');
    }
}

// -----------------------------------------------------------------------------
// 3. FUNCIÓN PARA INICIALIZAR TODOS LOS DESPLEGABLES
// -----------------------------------------------------------------------------
// Esta función llena todos los <select> del formulario con los datos del JSON
function inicializarDesplegables() {
    // Cargamos las lenguas maternas (para alumno y familiares)
    cargarOpciones('lenguaAlumno', datosJSON.lenguas);

    // Cargamos los idiomas conocidos (multiselección)
    cargarOpcionesMultiples('idiomasAlumno', datosJSON.idiomas);

    // Cargamos profesiones para los familiares
    cargarOpciones('profesionFamiliar0', datosJSON.profesiones);

    // Cargamos lengua materna para familiares
    cargarOpciones('lenguaFamiliar0', datosJSON.lenguas);

    // Cargamos idiomas para familiares
    cargarOpcionesMultiples('idiomasFamiliar0', datosJSON.idiomas);

    // Cargamos los países
    cargarPaises();

    // Cargamos ciudades de nacimiento (todas las ciudades disponibles)
    cargarCiudadesNacimiento();

    // Cargamos niveles de estudio
    cargarOpciones('nivelAlcanzado', datosJSON.nivelesEstudio);
    cargarOpciones('nivelSolicitado', datosJSON.nivelesEstudio);

    // Cargamos idiomas estudiados
    cargarOpcionesMultiples('idiomasEstudiados', datosJSON.idiomas);

    // Cargamos alergias
    cargarOpcionesMultiples('alergias', datosJSON.alergias);
}

// -----------------------------------------------------------------------------
// 4. FUNCIÓN AUXILIAR PARA CARGAR OPCIONES EN UN <SELECT>
// -----------------------------------------------------------------------------
// Esta función toma un array de opciones y las añade a un elemento <select>
// Parámetros:
//   - idElemento: el ID del <select> en el HTML
//   - opciones: array con las opciones a mostrar
function cargarOpciones(idElemento, opciones) {
    const select = document.getElementById(idElemento);

    // Si el elemento no existe, salimos de la función
    if (!select) return;

    // Limpiamos las opciones existentes (excepto la primera que dice "Selecciona...")
    select.innerHTML = '<option value="">Selecciona una opción</option>';

    // Añadimos cada opción al <select>
    opciones.forEach(opcion => {
        const optionElement = document.createElement('option');
        optionElement.value = opcion;
        optionElement.textContent = opcion;
        select.appendChild(optionElement);
    });
}

// -----------------------------------------------------------------------------
// 5. FUNCIÓN PARA CARGAR OPCIONES MÚLTIPLES (CHECKBOXES)
// -----------------------------------------------------------------------------
// Esta función crea checkboxes para permitir seleccionar múltiples opciones
function cargarOpcionesMultiples(idContenedor, opciones) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    // Limpiamos el contenedor
    contenedor.innerHTML = '';

    // Creamos un checkbox por cada opción
    opciones.forEach((opcion, index) => {
        const div = document.createElement('div');
        div.className = 'form-check';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input';
        checkbox.id = `${idContenedor}_${index}`;
        checkbox.value = opcion;
        checkbox.name = idContenedor;

        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.htmlFor = checkbox.id;
        label.textContent = opcion;

        div.appendChild(checkbox);
        div.appendChild(label);
        contenedor.appendChild(div);
    });
}

// -----------------------------------------------------------------------------
// 6. FUNCIÓN PARA CARGAR PAÍSES
// -----------------------------------------------------------------------------
function cargarPaises() {
    const selectPais = document.getElementById('pais');
    if (!selectPais) return;

    selectPais.innerHTML = '<option value="">Selecciona un país</option>';

    datosJSON.paises.forEach(pais => {
        const option = document.createElement('option');
        option.value = pais.nombre;
        option.textContent = pais.nombre;
        selectPais.appendChild(option);
    });
}

// -----------------------------------------------------------------------------
// 7. FUNCIÓN PARA CARGAR CIUDADES SEGÚN EL PAÍS SELECCIONADO
// -----------------------------------------------------------------------------
// Esta función es un ejemplo de CASCADING DROPDOWNS (desplegables en cascada)
// Cuando cambias el país, automáticamente se actualizan las ciudades disponibles
function cargarCiudadesPorPais() {
    const paisSeleccionado = document.getElementById('pais').value;
    const selectCiudad = document.getElementById('ciudad');

    // Limpiamos las ciudades y poblaciones
    selectCiudad.innerHTML = '<option value="">Selecciona una ciudad</option>';
    document.getElementById('poblacion').innerHTML = '<option value="">Primero selecciona una ciudad</option>';

    if (!paisSeleccionado) return;

    // Buscamos el país seleccionado en nuestros datos
    const pais = datosJSON.paises.find(p => p.nombre === paisSeleccionado);

    if (pais && pais.ciudades) {
        pais.ciudades.forEach(ciudad => {
            const option = document.createElement('option');
            option.value = ciudad.nombre;
            option.textContent = ciudad.nombre;
            selectCiudad.appendChild(option);
        });
    }
}

// -----------------------------------------------------------------------------
// 8. FUNCIÓN PARA CARGAR POBLACIONES SEGÚN LA CIUDAD SELECCIONADA
// -----------------------------------------------------------------------------
function cargarPoblacionesPorCiudad() {
    const paisSeleccionado = document.getElementById('pais').value;
    const ciudadSeleccionada = document.getElementById('ciudad').value;
    const selectPoblacion = document.getElementById('poblacion');

    selectPoblacion.innerHTML = '<option value="">Selecciona una población</option>';

    if (!paisSeleccionado || !ciudadSeleccionada) return;

    const pais = datosJSON.paises.find(p => p.nombre === paisSeleccionado);
    if (pais) {
        const ciudad = pais.ciudades.find(c => c.nombre === ciudadSeleccionada);
        if (ciudad && ciudad.poblaciones) {
            ciudad.poblaciones.forEach(poblacion => {
                const option = document.createElement('option');
                option.value = poblacion;
                option.textContent = poblacion;
                selectPoblacion.appendChild(option);
            });
        }
    }
}

// -----------------------------------------------------------------------------
// 9. FUNCIÓN PARA CARGAR TODAS LAS CIUDADES DE NACIMIENTO
// -----------------------------------------------------------------------------
// Esta función carga TODAS las ciudades disponibles (sin filtrar por país)
function cargarCiudadesNacimiento() {
    const todasCiudades = [];

    // Recorremos todos los países y todas sus ciudades
    datosJSON.paises.forEach(pais => {
        pais.ciudades.forEach(ciudad => {
            todasCiudades.push(ciudad.nombre);
        });
    });

    // Cargamos estas ciudades en el select de ciudad de nacimiento del primer familiar
    cargarOpciones('ciudadNacimientoFamiliar0', todasCiudades);
}

// =============================================================================
// VALIDACIONES CON EXPRESIONES REGULARES
// =============================================================================
// Las expresiones regulares (RegEx) son patrones que nos permiten validar texto
// Son muy útiles para validar NIFs, emails, teléfonos, códigos postales, etc.
// =============================================================================

// -----------------------------------------------------------------------------
// 10. VALIDACIÓN DE NIF ESPAÑOL
// -----------------------------------------------------------------------------
// El NIF español tiene 8 números seguidos de una letra
// La letra se calcula según un algoritmo específico
function validarNIF(nif) {
    // Eliminamos espacios en blanco
    nif = nif.trim().toUpperCase();

    // Expresión regular: 8 dígitos seguidos de 1 letra
    // ^ = inicio de la cadena
    // \d{8} = exactamente 8 dígitos
    // [A-Z] = una letra de la A a la Z
    // $ = final de la cadena
    const patronNIF = /^\d{8}[A-Z]$/;

    // Primero verificamos que el formato sea correcto
    if (!patronNIF.test(nif)) {
        return false;
    }

    // Ahora verificamos que la letra sea correcta
    const letrasNIF = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const numero = parseInt(nif.substr(0, 8), 10);
    const letra = nif.charAt(8);

    // La letra correcta se obtiene dividiendo el número entre 23
    // y usando el resto como índice en la cadena de letras
    const letraCalculada = letrasNIF.charAt(numero % 23);

    return letra === letraCalculada;
}

// -----------------------------------------------------------------------------
// 11. VALIDACIÓN DE CÓDIGO POSTAL ESPAÑOL
// -----------------------------------------------------------------------------
// Los códigos postales en España tienen 5 dígitos
function validarCodigoPostal(cp) {
    // ^ = inicio, \d{5} = exactamente 5 dígitos, $ = final
    const patronCP = /^\d{5}$/;
    return patronCP.test(cp.trim());
}

// =============================================================================
// PATRÓN BUILDER: CONSTRUCCIÓN DE OBJETOS COMPLEJOS
// =============================================================================
// El patrón Builder nos ayuda a crear objetos complejos paso a paso
// Es especialmente útil cuando un objeto tiene muchas propiedades
// y queremos construirlo de forma clara y ordenada
// =============================================================================

// -----------------------------------------------------------------------------
// 12. CLASE ALUMNO (usando prototipos)
// -----------------------------------------------------------------------------
// En JavaScript, los prototipos son la forma "clásica" de crear objetos
// Aunque ahora existe la palabra clave "class", es importante entender prototipos

// Constructor de Alumno - Define las propiedades básicas
function Alumno() {
    this.nombre = '';
    this.apellidos = '';
    this.nif = '';
    this.lenguaMaterna = '';
    this.idiomasConocidos = [];
    this.familiares = [];
    this.direccion = null;
    this.datosAcademicos = null;
    this.informacionMedica = null;
}

// Añadimos un método al prototipo de Alumno
// Esto significa que TODOS los objetos Alumno tendrán este método
Alumno.prototype.mostrarResumen = function () {
    console.log('=== RESUMEN DEL ALUMNO ===');
    console.log(`Nombre completo: ${this.nombre} ${this.apellidos}`);
    console.log(`NIF: ${this.nif}`);
    console.log(`Lengua materna: ${this.lenguaMaterna}`);
    console.log(`Idiomas: ${this.idiomasConocidos.join(', ')}`);
    console.log(`Número de familiares: ${this.familiares.length}`);
    return this;
};

// -----------------------------------------------------------------------------
// 13. CLASE FAMILIAR (usando prototipos)
// -----------------------------------------------------------------------------
function Familiar() {
    this.nombre = '';
    this.apellidos = '';
    this.nif = '';
    this.profesion = '';
    this.ciudadNacimiento = '';
    this.lenguaMaterna = '';
    this.idiomasConocidos = [];
}

// -----------------------------------------------------------------------------
// 14. CLASE DIRECCIÓN (usando prototipos)
// -----------------------------------------------------------------------------
function Direccion() {
    this.pais = '';
    this.ciudad = '';
    this.poblacion = '';
    this.direccionCompleta = '';
    this.codigoPostal = '';
}

// -----------------------------------------------------------------------------
// 15. CLASE DATOS ACADÉMICOS (usando prototipos)
// -----------------------------------------------------------------------------
function DatosAcademicos() {
    this.colegioProcedencia = '';
    this.nivelAlcanzado = '';
    this.idiomasEstudiados = [];
    this.nivelSolicitado = '';
}

// -----------------------------------------------------------------------------
// 16. CLASE INFORMACIÓN MÉDICA (usando prototipos)
// -----------------------------------------------------------------------------
function InformacionMedica() {
    this.alergias = [];
    this.medicacionActual = '';
}

// =============================================================================
// PATRÓN BUILDER - LA CLASE QUE CONSTRUYE EL ALUMNO
// =============================================================================
// El Builder nos permite construir el objeto Alumno paso a paso
// Cada método devuelve 'this' para poder encadenar llamadas
// Por ejemplo: builder.setNombre('Juan').setApellidos('Pérez')...
// =============================================================================

// -----------------------------------------------------------------------------
// 17. ALUMNO BUILDER - CONSTRUCTOR
// -----------------------------------------------------------------------------
function AlumnoBuilder() {
    this.alumno = new Alumno();
}

// Métodos para establecer datos del alumno
AlumnoBuilder.prototype.setNombre = function (nombre) {
    this.alumno.nombre = nombre;
    return this; // Devolvemos 'this' para poder encadenar métodos
};

AlumnoBuilder.prototype.setApellidos = function (apellidos) {
    this.alumno.apellidos = apellidos;
    return this;
};

AlumnoBuilder.prototype.setNIF = function (nif) {
    this.alumno.nif = nif;
    return this;
};

AlumnoBuilder.prototype.setLenguaMaterna = function (lengua) {
    this.alumno.lenguaMaterna = lengua;
    return this;
};

AlumnoBuilder.prototype.setIdiomasConocidos = function (idiomas) {
    this.alumno.idiomasConocidos = idiomas;
    return this;
};

AlumnoBuilder.prototype.addFamiliar = function (familiar) {
    this.alumno.familiares.push(familiar);
    return this;
};

AlumnoBuilder.prototype.setDireccion = function (direccion) {
    this.alumno.direccion = direccion;
    return this;
};

AlumnoBuilder.prototype.setDatosAcademicos = function (datos) {
    this.alumno.datosAcademicos = datos;
    return this;
};

AlumnoBuilder.prototype.setInformacionMedica = function (info) {
    this.alumno.informacionMedica = info;
    return this;
};

// Método final que devuelve el objeto Alumno construido
AlumnoBuilder.prototype.build = function () {
    return this.alumno;
};

// =============================================================================
// GESTIÓN DE FAMILIARES DINÁMICOS
// =============================================================================
// Estas funciones permiten añadir o eliminar familiares del formulario
// =============================================================================

let contadorFamiliares = 1; // Empezamos en 1 porque ya hay uno por defecto

// -----------------------------------------------------------------------------
// 18. FUNCIÓN PARA AÑADIR UN NUEVO FAMILIAR AL FORMULARIO
// -----------------------------------------------------------------------------
function agregarFamiliar() {
    const contenedor = document.getElementById('familiares-container');

    // Creamos un nuevo div para el familiar
    const nuevoFamiliar = document.createElement('div');
    nuevoFamiliar.className = 'familiar-item card mb-3';
    nuevoFamiliar.id = `familiar${contadorFamiliares}`;

    // HTML del nuevo familiar
    nuevoFamiliar.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5>Familiar ${contadorFamiliares + 1}</h5>
            <button type="button" class="btn btn-danger btn-sm" onclick="eliminarFamiliar(${contadorFamiliares})">
                Eliminar
            </button>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                    <label class="form-label">Nombre *</label>
                    <input type="text" class="form-control" id="nombreFamiliar${contadorFamiliares}" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Apellidos *</label>
                    <input type="text" class="form-control" id="apellidosFamiliar${contadorFamiliares}" required>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-6">
                    <label class="form-label">NIF *</label>
                    <input type="text" class="form-control" id="nifFamiliar${contadorFamiliares}" required>
                    <div class="invalid-feedback">NIF inválido</div>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Profesión *</label>
                    <select class="form-select" id="profesionFamiliar${contadorFamiliares}" required></select>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-6">
                    <label class="form-label">Ciudad de Nacimiento *</label>
                    <select class="form-select" id="ciudadNacimientoFamiliar${contadorFamiliares}" required></select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Lengua Materna *</label>
                    <select class="form-select" id="lenguaFamiliar${contadorFamiliares}" required></select>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-12">
                    <label class="form-label">Idiomas Conocidos *</label>
                    <div id="idiomasFamiliar${contadorFamiliares}" class="idiomas-container"></div>
                </div>
            </div>
        </div>
    `;

    contenedor.appendChild(nuevoFamiliar);

    // Cargamos los datos en los nuevos desplegables
    cargarOpciones(`profesionFamiliar${contadorFamiliares}`, datosJSON.profesiones);
    cargarOpciones(`lenguaFamiliar${contadorFamiliares}`, datosJSON.lenguas);
    cargarOpcionesMultiples(`idiomasFamiliar${contadorFamiliares}`, datosJSON.idiomas);

    // Cargamos todas las ciudades de nacimiento
    const todasCiudades = [];
    datosJSON.paises.forEach(pais => {
        pais.ciudades.forEach(ciudad => {
            todasCiudades.push(ciudad.nombre);
        });
    });
    cargarOpciones(`ciudadNacimientoFamiliar${contadorFamiliares}`, todasCiudades);

    contadorFamiliares++;
}

// -----------------------------------------------------------------------------
// 19. FUNCIÓN PARA ELIMINAR UN FAMILIAR
// -----------------------------------------------------------------------------
function eliminarFamiliar(indice) {
    // No permitimos eliminar si solo hay un familiar
    const familiares = document.querySelectorAll('.familiar-item');
    if (familiares.length <= 1) {
        alert('Debe haber al menos un familiar asociado.');
        return;
    }

    const familiar = document.getElementById(`familiar${indice}`);
    if (familiar) {
        familiar.remove();
    }
}

// =============================================================================
// FUNCIONES DE VALIDACIÓN DEL FORMULARIO
// =============================================================================

// -----------------------------------------------------------------------------
// 20. FUNCIÓN AUXILIAR PARA OBTENER VALORES DE CHECKBOXES SELECCIONADOS
// -----------------------------------------------------------------------------
function obtenerValoresSeleccionados(nombreCheckbox) {
    const checkboxes = document.querySelectorAll(`input[name="${nombreCheckbox}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

// -----------------------------------------------------------------------------
// 21. FUNCIÓN PRINCIPAL DE VALIDACIÓN Y ENVÍO DEL FORMULARIO
// -----------------------------------------------------------------------------
function validarFormulario(event) {
    // Prevenimos el envío por defecto del formulario
    event.preventDefault();

    let esValido = true;
    let mensajesError = [];

    // =========================================================================
    // VALIDACIÓN 1: DATOS DEL ALUMNO
    // =========================================================================
    const nombreAlumno = document.getElementById('nombreAlumno').value.trim();
    const apellidosAlumno = document.getElementById('apellidosAlumno').value.trim();
    const nifAlumno = document.getElementById('nifAlumno').value.trim();
    const lenguaAlumno = document.getElementById('lenguaAlumno').value;
    const idiomasAlumno = obtenerValoresSeleccionados('idiomasAlumno');

    if (!nombreAlumno) {
        mensajesError.push('El nombre del alumno es obligatorio');
        esValido = false;
    }

    if (!apellidosAlumno) {
        mensajesError.push('Los apellidos del alumno son obligatorios');
        esValido = false;
    }

    if (!nifAlumno) {
        mensajesError.push('El NIF del alumno es obligatorio');
        esValido = false;
    } else if (!validarNIF(nifAlumno)) {
        mensajesError.push('El NIF del alumno no es válido');
        document.getElementById('nifAlumno').classList.add('is-invalid');
        esValido = false;
    } else {
        document.getElementById('nifAlumno').classList.remove('is-invalid');
    }

    if (!lenguaAlumno) {
        mensajesError.push('La lengua materna del alumno es obligatoria');
        esValido = false;
    }

    if (idiomasAlumno.length === 0) {
        mensajesError.push('Debe seleccionar al menos un idioma conocido para el alumno');
        esValido = false;
    }

    // =========================================================================
    // VALIDACIÓN 2: FAMILIARES
    // =========================================================================
    const familiares = [];
    const familiaresItems = document.querySelectorAll('.familiar-item');

    familiaresItems.forEach((item, index) => {
        // Obtenemos el ID real del familiar (puede no ser secuencial si se eliminaron algunos)
        const familiarId = item.id.replace('familiar', '');

        const nombreFam = document.getElementById(`nombreFamiliar${familiarId}`).value.trim();
        const apellidosFam = document.getElementById(`apellidosFamiliar${familiarId}`).value.trim();
        const nifFam = document.getElementById(`nifFamiliar${familiarId}`).value.trim();
        const profesionFam = document.getElementById(`profesionFamiliar${familiarId}`).value;
        const ciudadNacFam = document.getElementById(`ciudadNacimientoFamiliar${familiarId}`).value;
        const lenguaFam = document.getElementById(`lenguaFamiliar${familiarId}`).value;
        const idiomasFam = obtenerValoresSeleccionados(`idiomasFamiliar${familiarId}`);

        if (!nombreFam || !apellidosFam) {
            mensajesError.push(`El familiar ${index + 1} debe tener nombre y apellidos`);
            esValido = false;
        }

        if (!nifFam) {
            mensajesError.push(`El NIF del familiar ${index + 1} es obligatorio`);
            esValido = false;
        } else if (!validarNIF(nifFam)) {
            mensajesError.push(`El NIF del familiar ${index + 1} no es válido`);
            document.getElementById(`nifFamiliar${familiarId}`).classList.add('is-invalid');
            esValido = false;
        } else {
            document.getElementById(`nifFamiliar${familiarId}`).classList.remove('is-invalid');
        }

        if (!profesionFam || !ciudadNacFam || !lenguaFam) {
            mensajesError.push(`Complete todos los campos del familiar ${index + 1}`);
            esValido = false;
        }

        if (idiomasFam.length === 0) {
            mensajesError.push(`Seleccione al menos un idioma para el familiar ${index + 1}`);
            esValido = false;
        }

        // Si todo es válido, creamos el objeto Familiar
        if (nombreFam && apellidosFam && validarNIF(nifFam)) {
            const familiar = new Familiar();
            familiar.nombre = nombreFam;
            familiar.apellidos = apellidosFam;
            familiar.nif = nifFam;
            familiar.profesion = profesionFam;
            familiar.ciudadNacimiento = ciudadNacFam;
            familiar.lenguaMaterna = lenguaFam;
            familiar.idiomasConocidos = idiomasFam;
            familiares.push(familiar);
        }
    });

    if (familiares.length === 0) {
        mensajesError.push('Debe haber al menos un familiar válido');
        esValido = false;
    }

    // =========================================================================
    // VALIDACIÓN 3: DIRECCIÓN ACTUAL
    // =========================================================================
    const pais = document.getElementById('pais').value;
    const ciudad = document.getElementById('ciudad').value;
    const poblacion = document.getElementById('poblacion').value;
    const direccionCompleta = document.getElementById('direccionCompleta').value.trim();
    const codigoPostal = document.getElementById('codigoPostal').value.trim();

    if (!pais || !ciudad || !poblacion) {
        mensajesError.push('Debe completar País, Ciudad y Población');
        esValido = false;
    }

    if (!direccionCompleta) {
        mensajesError.push('La dirección completa es obligatoria');
        esValido = false;
    }

    if (!codigoPostal) {
        mensajesError.push('El código postal es obligatorio');
        esValido = false;
    } else if (!validarCodigoPostal(codigoPostal)) {
        mensajesError.push('El código postal debe tener 5 dígitos');
        document.getElementById('codigoPostal').classList.add('is-invalid');
        esValido = false;
    } else {
        document.getElementById('codigoPostal').classList.remove('is-invalid');
    }

    // =========================================================================
    // VALIDACIÓN 4: DATOS ACADÉMICOS
    // =========================================================================
    const colegio = document.getElementById('colegioProcedencia').value.trim();
    const nivelAlcanzado = document.getElementById('nivelAlcanzado').value;
    const idiomasEstudiados = obtenerValoresSeleccionados('idiomasEstudiados');
    const nivelSolicitado = document.getElementById('nivelSolicitado').value;

    if (!colegio) {
        mensajesError.push('El colegio de procedencia es obligatorio');
        esValido = false;
    }

    if (!nivelAlcanzado) {
        mensajesError.push('El nivel de estudios alcanzado es obligatorio');
        esValido = false;
    }

    if (idiomasEstudiados.length === 0) {
        mensajesError.push('Debe seleccionar al menos un idioma estudiado');
        esValido = false;
    }

    if (!nivelSolicitado) {
        mensajesError.push('El nivel de estudio solicitado es obligatorio');
        esValido = false;
    }

    // =========================================================================
    // VALIDACIÓN 5: INFORMACIÓN MÉDICA (OPCIONAL)
    // =========================================================================
    const alergias = obtenerValoresSeleccionados('alergias');
    const medicacion = document.getElementById('medicacion').value.trim();

    // =========================================================================
    // SI HAY ERRORES, MOSTRAMOS LOS MENSAJES Y SALIMOS
    // =========================================================================
    if (!esValido) {
        alert('Por favor, corrija los siguientes errores:\n\n' + mensajesError.join('\n'));
        return false;
    }

    // =========================================================================
    // SI TODO ES VÁLIDO, CONSTRUIMOS EL OBJETO ALUMNO CON EL PATRÓN BUILDER
    // =========================================================================

    // Creamos el objeto Dirección
    const direccion = new Direccion();
    direccion.pais = pais;
    direccion.ciudad = ciudad;
    direccion.poblacion = poblacion;
    direccion.direccionCompleta = direccionCompleta;
    direccion.codigoPostal = codigoPostal;

    // Creamos el objeto DatosAcademicos
    const datosAcademicos = new DatosAcademicos();
    datosAcademicos.colegioProcedencia = colegio;
    datosAcademicos.nivelAlcanzado = nivelAlcanzado;
    datosAcademicos.idiomasEstudiados = idiomasEstudiados;
    datosAcademicos.nivelSolicitado = nivelSolicitado;

    // Creamos el objeto InformacionMedica
    const infoMedica = new InformacionMedica();
    infoMedica.alergias = alergias;
    infoMedica.medicacionActual = medicacion;

    // =========================================================================
    // USAMOS EL PATRÓN BUILDER PARA CONSTRUIR EL ALUMNO
    // =========================================================================
    const builder = new AlumnoBuilder();
    const alumno = builder
        .setNombre(nombreAlumno)
        .setApellidos(apellidosAlumno)
        .setNIF(nifAlumno)
        .setLenguaMaterna(lenguaAlumno)
        .setIdiomasConocidos(idiomasAlumno)
        .setDireccion(direccion)
        .setDatosAcademicos(datosAcademicos)
        .setInformacionMedica(infoMedica)
        .build();

    // Añadimos los familiares
    familiares.forEach(fam => {
        builder.addFamiliar(fam);
    });

    // Mostramos el alumno completo en la consola
    console.log('🎓 ALUMNO REGISTRADO:', alumno);
    alumno.mostrarResumen();

    // Mostramos el resumen en el modal
    mostrarResumenModal(alumno);

    return false; // Evitamos que se envíe el formulario
}

// =============================================================================
// FUNCIÓN PARA MOSTRAR EL RESUMEN EN UN MODAL
// =============================================================================
function mostrarResumenModal(alumno) {
    // Construimos el HTML del resumen
    let html = `
        <div class="resumen-section">
            <h5>📋 Datos del Alumno</h5>
            <p><strong>Nombre completo:</strong> ${alumno.nombre} ${alumno.apellidos}</p>
            <p><strong>NIF:</strong> ${alumno.nif}</p>
            <p><strong>Lengua materna:</strong> ${alumno.lenguaMaterna}</p>
            <p><strong>Idiomas conocidos:</strong> ${alumno.idiomasConocidos.join(', ')}</p>
        </div>
        
        <div class="resumen-section">
            <h5>👨‍👩‍👧‍👦 Familiares (${alumno.familiares.length})</h5>
    `;

    alumno.familiares.forEach((fam, index) => {
        html += `
            <div class="familiar-resumen">
                <p><strong>Familiar ${index + 1}:</strong> ${fam.nombre} ${fam.apellidos}</p>
                <p class="small">NIF: ${fam.nif} | Profesión: ${fam.profesion}</p>
                <p class="small">Ciudad de nacimiento: ${fam.ciudadNacimiento}</p>
                <p class="small">Lengua: ${fam.lenguaMaterna} | Idiomas: ${fam.idiomasConocidos.join(', ')}</p>
            </div>
        `;
    });

    html += `</div>`;

    if (alumno.direccion) {
        html += `
            <div class="resumen-section">
                <h5>📍 Dirección Actual</h5>
                <p>${alumno.direccion.direccionCompleta}</p>
                <p>${alumno.direccion.poblacion}, ${alumno.direccion.ciudad}</p>
                <p>${alumno.direccion.pais} - CP: ${alumno.direccion.codigoPostal}</p>
            </div>
        `;
    }

    if (alumno.datosAcademicos) {
        html += `
            <div class="resumen-section">
                <h5>🎓 Datos Académicos</h5>
                <p><strong>Colegio de procedencia:</strong> ${alumno.datosAcademicos.colegioProcedencia}</p>
                <p><strong>Nivel alcanzado:</strong> ${alumno.datosAcademicos.nivelAlcanzado}</p>
                <p><strong>Idiomas estudiados:</strong> ${alumno.datosAcademicos.idiomasEstudiados.join(', ')}</p>
                <p><strong>Nivel solicitado:</strong> ${alumno.datosAcademicos.nivelSolicitado}</p>
            </div>
        `;
    }

    if (alumno.informacionMedica) {
        html += `
            <div class="resumen-section">
                <h5>🏥 Información Médica</h5>
                <p><strong>Alergias:</strong> ${alumno.informacionMedica.alergias.length > 0 ? alumno.informacionMedica.alergias.join(', ') : 'Ninguna'}</p>
                <p><strong>Medicación actual:</strong> ${alumno.informacionMedica.medicacionActual || 'Ninguna'}</p>
            </div>
        `;
    }

    // Insertamos el HTML en el modal
    document.getElementById('resumenContenido').innerHTML = html;

    // Mostramos el modal usando Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('resumenModal'));
    modal.show();
}

// =============================================================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// =============================================================================
// Este código se ejecuta automáticamente cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Aplicación iniciada');

    // Cargamos los datos del JSON
    cargarDatosJSON();

    // Añadimos listeners para los cambios en país y ciudad
    document.getElementById('pais').addEventListener('change', cargarCiudadesPorPais);
    document.getElementById('ciudad').addEventListener('change', cargarPoblacionesPorCiudad);

    // Añadimos el listener para el botón de añadir familiar
    document.getElementById('btnAgregarFamiliar').addEventListener('click', agregarFamiliar);

    // Añadimos el listener para el envío del formulario
    document.getElementById('formularioAlumno').addEventListener('submit', validarFormulario);

    console.log('✅ Event listeners configurados');
});