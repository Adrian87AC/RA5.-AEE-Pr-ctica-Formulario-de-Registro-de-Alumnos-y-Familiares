import { Alumno } from './Alumno.js';

export class AlumnoBuilder {
    constructor() {
        this.alumno = new Alumno();
    }

    setNombre(nombre) {
        this.alumno.nombre = nombre;
        return this;
    }

    setApellidos(apellidos) {
        this.alumno.apellidos = apellidos;
        return this;
    }

    setNIF(nif) {
        this.alumno.nif = nif;
        return this;
    }

    setLenguaMaterna(lengua) {
        this.alumno.lenguaMaterna = lengua;
        return this;
    }

    setIdiomasConocidos(idiomas) {
        this.alumno.idiomasConocidos = idiomas;
        return this;
    }

    addFamiliar(familiar) {
        this.alumno.familiares.push(familiar);
        return this;
    }

    setDireccion(direccion) {
        this.alumno.direccion = direccion;
        return this;
    }

    setDatosAcademicos(datos) {
        this.alumno.datosAcademicos = datos;
        return this;
    }

    setInformacionMedica(info) {
        this.alumno.informacionMedica = info;
        return this;
    }

    build() {
        return this.alumno;
    }
}
