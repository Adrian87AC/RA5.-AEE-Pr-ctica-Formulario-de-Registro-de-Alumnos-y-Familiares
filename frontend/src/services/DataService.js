/**
 * Servicio para gestionar la comunicación con la API del Backend
 */
export class DataService {
    constructor() {
        this.datosJSON = null;
        this.API_URL = 'http://localhost:3000/api';
    }

    async cargarDatos() {
        try {
            // Ahora cargamos los datos desde la API en lugar de un archivo local
            const respuesta = await fetch(`${this.API_URL}/data`);
            if (!respuesta.ok) throw new Error('Error en la respuesta de la API');

            this.datosJSON = await respuesta.json();
            console.log('✅ Datos cargados desde la API correctamente');
            return this.datosJSON;
        } catch (error) {
            console.error('❌ Error al cargar datos de la API:', error);
            throw error;
        }
    }

    async registrarAlumno(alumno) {
        try {
            const respuesta = await fetch(`${this.API_URL}/alumno`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(alumno)
            });

            if (!respuesta.ok) throw new Error('Error al registrar el alumno en el servidor');

            return await respuesta.json();
        } catch (error) {
            console.error('❌ Error en el registro:', error);
            throw error;
        }
    }

    cargarOpciones(idElemento, opciones) {
        const select = document.getElementById(idElemento);
        if (!select) return;

        select.innerHTML = '<option value="">Selecciona una opción</option>';
        opciones.forEach(opcion => {
            const optionElement = document.createElement('option');
            optionElement.value = opcion;
            optionElement.textContent = opcion;
            select.appendChild(optionElement);
        });
    }

    cargarOpcionesMultiples(idContenedor, opciones) {
        const contenedor = document.getElementById(idContenedor);
        if (!contenedor) return;

        contenedor.innerHTML = '';
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

    cargarPaises() {
        const selectPais = document.getElementById('pais');
        if (!selectPais) return;

        selectPais.innerHTML = '<option value="">Selecciona un país</option>';
        this.datosJSON.paises.forEach(pais => {
            const option = document.createElement('option');
            option.value = pais.nombre;
            option.textContent = pais.nombre;
            selectPais.appendChild(option);
        });
    }

    getCiudadesPorPais(nombrePais) {
        const pais = this.datosJSON.paises.find(p => p.nombre === nombrePais);
        return pais ? pais.ciudades : [];
    }

    getPoblacionesPorCiudad(nombrePais, nombreCiudad) {
        const pais = this.datosJSON.paises.find(p => p.nombre === nombrePais);
        if (!pais) return [];
        const ciudad = pais.ciudades.find(c => c.nombre === nombreCiudad);
        return ciudad ? ciudad.poblaciones : [];
    }

    getTodasLasCiudades() {
        const todasCiudades = [];
        this.datosJSON.paises.forEach(pais => {
            pais.ciudades.forEach(ciudad => {
                todasCiudades.push(ciudad.nombre);
            });
        });
        return todasCiudades;
    }
}
