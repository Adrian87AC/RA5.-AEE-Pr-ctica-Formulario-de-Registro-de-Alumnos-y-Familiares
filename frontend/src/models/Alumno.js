/**
 * Constructor de Alumno usando Prototipos (Requisito DWEC).
 * Representa la entidad principal del sistema de registro.
 */
export function Alumno() {
    this.nombre = '';
    this.apellidos = '';
    this.nif = '';
    this.lenguaMaterna = '';
    this.idiomasConocidos = [];
    this.familiares = []; // Array de instancias de la clase Familiar
    this.direccion = null; // Instancia de la clase Direccion
    this.datosAcademicos = null; // Instancia de la clase DatosAcademicos
    this.informacionMedica = null; // Instancia de la clase InformacionMedica
}

/**
 * Genera un resumen por consola de los datos básicos del alumno.
 * @returns {Alumno} La propia instancia para permitir encadenamiento.
 */
Alumno.prototype.mostrarResumen = function () {
    console.log('=== RESUMEN DEL ALUMNO ===');
    console.log(`Nombre completo: ${this.nombre} ${this.apellidos}`);
    console.log(`NIF: ${this.nif}`);
    console.log(`Lengua materna: ${this.lenguaMaterna}`);
    console.log(`Idiomas: ${this.idiomasConocidos.join(', ')}`);
    console.log(`Número de familiares: ${this.familiares.length}`);
    return this;
};
