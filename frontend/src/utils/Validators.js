/**
 * Utilidades de validación para el formulario
 */

/**
 * Valida un NIF español
 * @param {string} nif 
 * @returns {boolean}
 */
export function validarNIF(nif) {
    nif = nif.trim().toUpperCase();
    const patronNIF = /^\d{8}[A-Z]$/;

    if (!patronNIF.test(nif)) {
        return false;
    }

    const letrasNIF = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const numero = parseInt(nif.substr(0, 8), 10);
    const letra = nif.charAt(8);
    const letraCalculada = letrasNIF.charAt(numero % 23);

    return letra === letraCalculada;
}

/**
 * Valida un código postal español
 * @param {string} cp 
 * @returns {boolean}
 */
export function validarCodigoPostal(cp) {
    const patronCP = /^\d{5}$/;
    return patronCP.test(cp.trim());
}

/**
 * Obtiene los valores de los checkboxes seleccionados
 * @param {string} nombreCheckbox 
 * @returns {string[]}
 */
export function obtenerValoresSeleccionados(nombreCheckbox) {
    const checkboxes = document.querySelectorAll(`input[name="${nombreCheckbox}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}
