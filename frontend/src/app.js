import { DataService } from './services/DataService.js';
import { AlumnoBuilder } from './models/AlumnoBuilder.js';
import { Familiar } from './models/Familiar.js';
import { Direccion } from './models/Direccion.js';
import { DatosAcademicos } from './models/DatosAcademicos.js';
import { InformacionMedica } from './models/InformacionMedica.js';
import { validarNIF, validarCodigoPostal, obtenerValoresSeleccionados } from './utils/Validators.js';

class App {
    constructor() {
        this.dataService = new DataService();
        this.contadorFamiliares = 1;
        this.init();
    }

    async init() {
        try {
            await this.dataService.cargarDatos();
            this.inicializarDesplegables();
            this.configurarEventListeners();
            console.log('🚀 Aplicación iniciada y configurada');
        } catch (error) {
            alert('Error al cargar los datos. Reintente por favor.');
        }
    }

    inicializarDesplegables() {
        const data = this.dataService.datosJSON;

        this.dataService.cargarOpciones('lenguaAlumno', data.lenguas);
        this.dataService.cargarOpcionesMultiples('idiomasAlumno', data.idiomas);

        this.dataService.cargarOpciones('profesionFamiliar0', data.profesiones);
        this.dataService.cargarOpciones('lenguaFamiliar0', data.lenguas);
        this.dataService.cargarOpcionesMultiples('idiomasFamiliar0', data.idiomas);

        this.dataService.cargarPaises();
        this.dataService.cargarOpciones('ciudadNacimientoFamiliar0', this.dataService.getTodasLasCiudades());

        this.dataService.cargarOpciones('nivelAlcanzado', data.nivelesEstudio);
        this.dataService.cargarOpciones('nivelSolicitado', data.nivelesEstudio);
        this.dataService.cargarOpcionesMultiples('idiomasEstudiados', data.idiomas);
        this.dataService.cargarOpcionesMultiples('alergias', data.alergias);
    }

    configurarEventListeners() {
        document.getElementById('pais').addEventListener('change', () => this.cargarCiudades());
        document.getElementById('ciudad').addEventListener('change', () => this.cargarPoblaciones());
        document.getElementById('btnAgregarFamiliar').addEventListener('click', () => this.agregarFamiliar());
        document.getElementById('formularioAlumno').addEventListener('submit', (e) => this.validarFormulario(e));

        // Delegación de eventos para eliminar familiares
        document.getElementById('familiares-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-eliminar-familiar')) {
                const id = e.target.getAttribute('data-id');
                this.eliminarFamiliar(id);
            }
        });
    }

    cargarCiudades() {
        const pais = document.getElementById('pais').value;
        const selectCiudad = document.getElementById('ciudad');
        const selectPoblacion = document.getElementById('poblacion');

        if (!pais) {
            selectCiudad.innerHTML = '<option value="">Primero selecciona un país</option>';
            selectPoblacion.innerHTML = '<option value="">Primero selecciona una ciudad</option>';
            return;
        }

        const ciudades = this.dataService.getCiudadesPorPais(pais);
        this.dataService.cargarOpciones('ciudad', ciudades.map(c => c.nombre));
        selectPoblacion.innerHTML = '<option value="">Primero selecciona una ciudad</option>';
    }

    cargarPoblaciones() {
        const pais = document.getElementById('pais').value;
        const ciudad = document.getElementById('ciudad').value;
        const selectPoblacion = document.getElementById('poblacion');

        if (!ciudad) {
            selectPoblacion.innerHTML = '<option value="">Primero selecciona una ciudad</option>';
            return;
        }

        const poblaciones = this.dataService.getPoblacionesPorCiudad(pais, ciudad);
        this.dataService.cargarOpciones('poblacion', poblaciones);
    }

    agregarFamiliar() {
        const contenedor = document.getElementById('familiares-container');
        const id = this.contadorFamiliares;

        const div = document.createElement('div');
        div.className = 'familiar-item card mb-3';
        div.id = `familiar${id}`;
        div.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5>Familiar ${id + 1}</h5>
                <button type="button" class="btn btn-danger btn-sm btn-eliminar-familiar" data-id="${id}">
                    Eliminar
                </button>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Nombre *</label>
                        <input type="text" class="form-control" id="nombreFamiliar${id}" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Apellidos *</label>
                        <input type="text" class="form-control" id="apellidosFamiliar${id}" required>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">NIF *</label>
                        <input type="text" class="form-control" id="nifFamiliar${id}" required>
                        <div class="invalid-feedback">NIF inválido</div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Profesión *</label>
                        <select class="form-select" id="profesionFamiliar${id}" required></select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Ciudad de Nacimiento *</label>
                        <select class="form-select" id="ciudadNacimientoFamiliar${id}" required></select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Lengua Materna *</label>
                        <select class="form-select" id="lenguaFamiliar${id}" required></select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 mb-3">
                        <label class="form-label">Idiomas Conocidos *</label>
                        <div id="idiomasFamiliar${id}" class="idiomas-container"></div>
                    </div>
                </div>
            </div>
        `;

        contenedor.appendChild(div);

        const data = this.dataService.datosJSON;
        this.dataService.cargarOpciones(`profesionFamiliar${id}`, data.profesiones);
        this.dataService.cargarOpciones(`lenguaFamiliar${id}`, data.lenguas);
        this.dataService.cargarOpcionesMultiples(`idiomasFamiliar${id}`, data.idiomas);
        this.dataService.cargarOpciones(`ciudadNacimientoFamiliar${id}`, this.dataService.getTodasLasCiudades());

        this.contadorFamiliares++;
    }

    eliminarFamiliar(id) {
        const familiares = document.querySelectorAll('.familiar-item');
        if (familiares.length <= 1) {
            alert('Debe haber al menos un familiar asociado.');
            return;
        }
        document.getElementById(`familiar${id}`).remove();
    }

    validarFormulario(event) {
        event.preventDefault();
        let esValido = true;
        let errores = [];

        // Validación Alumno
        const nombre = document.getElementById('nombreAlumno').value.trim();
        const nif = document.getElementById('nifAlumno').value.trim();
        if (!nombre) { esValido = false; errores.push('Nombre alumno obligatorio'); }
        if (!validarNIF(nif)) {
            esValido = false;
            errores.push('NIF alumno inválido');
            document.getElementById('nifAlumno').classList.add('is-invalid');
        } else {
            document.getElementById('nifAlumno').classList.remove('is-invalid');
        }

        // Validación Familiares
        const familiaresItems = document.querySelectorAll('.familiar-item');
        const familiaresValidos = [];

        familiaresItems.forEach(item => {
            const id = item.id.replace('familiar', '');
            const nifFam = document.getElementById(`nifFamiliar${id}`).value.trim();
            const nomFam = document.getElementById(`nombreFamiliar${id}`).value.trim();

            if (!nomFam) { esValido = false; errores.push('Nombre familiar obligatorio'); }
            if (!validarNIF(nifFam)) {
                esValido = false;
                errores.push('NIF familiar inválido');
                document.getElementById(`nifFamiliar${id}`).classList.add('is-invalid');
            } else {
                document.getElementById(`nifFamiliar${id}`).classList.remove('is-invalid');
            }

            if (esValido) {
                const fam = new Familiar();
                fam.nombre = nomFam;
                fam.apellidos = document.getElementById(`apellidosFamiliar${id}`).value.trim();
                fam.nif = nifFam;
                fam.profesion = document.getElementById(`profesionFamiliar${id}`).value;
                fam.ciudadNacimiento = document.getElementById(`ciudadNacimientoFamiliar${id}`).value;
                fam.lenguaMaterna = document.getElementById(`lenguaFamiliar${id}`).value;
                fam.idiomasConocidos = obtenerValoresSeleccionados(`idiomasFamiliar${id}`);
                familiaresValidos.push(fam);
            }
        });

        // Validación Dirección
        const cp = document.getElementById('codigoPostal').value.trim();
        if (!validarCodigoPostal(cp)) {
            esValido = false;
            errores.push('Código postal inválido');
            document.getElementById('codigoPostal').classList.add('is-invalid');
        } else {
            document.getElementById('codigoPostal').classList.remove('is-invalid');
        }

        if (!esValido) {
            alert('Errores:\n' + errores.join('\n'));
            return;
        }

        // Construcción del objeto final
        const builder = new AlumnoBuilder();
        builder
            .setNombre(nombre)
            .setApellidos(document.getElementById('apellidosAlumno').value.trim())
            .setNIF(nif)
            .setLenguaMaterna(document.getElementById('lenguaAlumno').value)
            .setIdiomasConocidos(obtenerValoresSeleccionados('idiomasAlumno'));

        const dir = new Direccion();
        dir.pais = document.getElementById('pais').value;
        dir.ciudad = document.getElementById('ciudad').value;
        dir.poblacion = document.getElementById('poblacion').value;
        dir.direccionCompleta = document.getElementById('direccionCompleta').value.trim();
        dir.codigoPostal = cp;
        builder.setDireccion(dir);

        const academico = new DatosAcademicos();
        academico.colegioProcedencia = document.getElementById('colegioProcedencia').value.trim();
        academico.nivelAlcanzado = document.getElementById('nivelAlcanzado').value;
        academico.idiomasEstudiados = obtenerValoresSeleccionados('idiomasEstudiados');
        academico.nivelSolicitado = document.getElementById('nivelSolicitado').value;
        builder.setDatosAcademicos(academico);

        const medico = new InformacionMedica();
        medico.alergias = obtenerValoresSeleccionados('alergias');
        medico.medicacionActual = document.getElementById('medicacion').value.trim();
        builder.setInformacionMedica(medico);

        familiaresValidos.forEach(f => builder.addFamiliar(f));

        const alumno = builder.build();
        console.log('🎓 Objeto alumno construido:', alumno);

        // Enviar al servidor
        this.dataService.registrarAlumno(alumno)
            .then(resultado => {
                console.log('✅ Servidor respondió:', resultado);
                this.mostrarResumenModal(alumno);
                alert('¡Alumno registrado con éxito en el servidor!');
            })
            .catch(error => {
                console.error('❌ Error al enviar al servidor:', error);
                alert('Error al conectar con el servidor. Se mostrará el resumen local.');
                this.mostrarResumenModal(alumno);
            });
    }

    mostrarResumenModal(alumno) {
        let html = `
            <div class="resumen-container">
                <div class="alert alert-info py-2"><i class="fas fa-user-graduate"></i> <strong>1. Datos del Alumno</strong></div>
                <div class="ps-3 mb-3">
                    <p class="mb-1"><strong>Nombre Completo:</strong> ${alumno.nombre} ${alumno.apellidos}</p>
                    <p class="mb-1"><strong>NIF:</strong> ${alumno.nif}</p>
                    <p class="mb-1"><strong>Lengua Materna:</strong> ${alumno.lenguaMaterna}</p>
                    <p class="mb-1"><strong>Idiomas:</strong> ${alumno.idiomasConocidos.join(', ')}</p>
                </div>

                <div class="alert alert-success py-2"><i class="fas fa-users"></i> <strong>2. Familiares Asociados</strong></div>
                <div class="ps-3 mb-3">
                    ${alumno.familiares.map((f, i) => `
                        <div class="border-start ps-2 mb-2">
                            <p class="mb-0 fw-bold text-success">Familiar ${i + 1}: ${f.nombre} ${f.apellidos}</p>
                            <p class="small mb-0">NIF: ${f.nif} | Profesión: ${f.profesion}</p>
                            <p class="small mb-0">Origen: ${f.ciudadNacimiento} | Lengua: ${f.lenguaMaterna}</p>
                            <p class="small">Idiomas: ${f.idiomasConocidos.join(', ')}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="alert alert-primary py-2"><i class="fas fa-map-marker-alt"></i> <strong>3. Dirección</strong></div>
                <div class="ps-3 mb-3">
                    <p class="mb-1"><strong>Ubicación:</strong> ${alumno.direccion.pais} > ${alumno.direccion.ciudad} > ${alumno.direccion.poblacion}</p>
                    <p class="mb-1"><strong>Dirección:</strong> ${alumno.direccion.direccionCompleta} (CP: ${alumno.direccion.codigoPostal})</p>
                </div>

                <div class="alert alert-warning py-2 text-dark"><i class="fas fa-graduation-cap"></i> <strong>4. Datos Académicos</strong></div>
                <div class="ps-3 mb-3">
                    <p class="mb-1"><strong>Procedencia:</strong> ${alumno.datosAcademicos.colegioProcedencia}</p>
                    <p class="mb-1"><strong>Nivel Alcanzado:</strong> ${alumno.datosAcademicos.nivelAlcanzado}</p>
                    <p class="mb-1"><strong>Idiomas Estudiados:</strong> ${alumno.datosAcademicos.idiomasEstudiados.join(', ')}</p>
                    <p class="mb-1"><strong>Nivel Solicitado:</strong> ${alumno.datosAcademicos.nivelSolicitado}</p>
                </div>

                <div class="alert alert-danger py-2"><i class="fas fa-heartbeat"></i> <strong>5. Información Médica</strong></div>
                <div class="ps-3 mb-3">
                    <p class="mb-1"><strong>Alergias:</strong> ${alumno.informacionMedica.alergias.length > 0 ? alumno.informacionMedica.alergias.join(', ') : 'Ninguna'}</p>
                    <p class="mb-1"><strong>Medicación:</strong> ${alumno.informacionMedica.medicacionActual || 'No indica'}</p>
                </div>
            </div>
        `;
        document.getElementById('resumenContenido').innerHTML = html;
        const modal = new bootstrap.Modal(document.getElementById('resumenModal'));
        modal.show();
    }
}

// Inicializar la app
new App();
