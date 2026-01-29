import { Alumno } from './Alumno.js';

/**
 * Patrón Builder para construir el objeto Alumno
 */
export function AlumnoBuilder() {
    this.alumno = new Alumno();
}

AlumnoBuilder.prototype.setNombre = function (nombre) {
    this.alumno.nombre = nombre;
    return this;
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

AlumnoBuilder.prototype.setDatosAcademicos = function (academico) {
    this.alumno.datosAcademicos = academico;
    return this;
};

AlumnoBuilder.prototype.setInformacionMedica = function (medica) {
    this.alumno.informacionMedica = medica;
    return this;
};

AlumnoBuilder.prototype.build = function () {
    return this.alumno;
};
