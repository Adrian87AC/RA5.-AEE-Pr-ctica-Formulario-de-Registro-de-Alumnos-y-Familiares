export class Alumno {
    constructor() {
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

    mostrarResumen() {
        console.log('=== RESUMEN DEL ALUMNO ===');
        console.log(`Nombre completo: ${this.nombre} ${this.apellidos}`);
        console.log(`NIF: ${this.nif}`);
        console.log(`Lengua materna: ${this.lenguaMaterna}`);
        console.log(`Idiomas: ${this.idiomasConocidos.join(', ')}`);
        console.log(`Número de familiares: ${this.familiares.length}`);
        return this;
    }
}
