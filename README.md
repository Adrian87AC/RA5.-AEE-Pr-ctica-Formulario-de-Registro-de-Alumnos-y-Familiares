# Formulario de Registro de Alumnos y Familiares

Este proyecto es una aplicación web full-stack para el registro de alumnos y sus familiares. Consta de un backend desarrollado con Node.js y Express, y un frontend desarrollado con HTML, CSS y JavaScript Vanilla.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:
- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) (generalmente viene con Node.js)
- Un navegador web moderno (Chrome, Firefox, Edge, etc.)

## Estructura del Proyecto

- `/backend`: Servidor API con Express.
- `/frontend`: Interfaz de usuario (HTML/JS).

## Configuración e Instalación

### 1. Backend

Navega a la carpeta del backend e instala las dependencias:

```bash
cd backend
npm install
```

### 2. Frontend

El frontend no requiere instalación de dependencias externas, ya que utiliza JavaScript nativo.

## Ejecución del Proyecto

### 1. Iniciar el Servidor (Backend)

Desde la carpeta `backend`, ejecuta el siguiente comando:

```bash
npm start
```

El servidor se iniciará en `http://localhost:3000` (o el puerto configurado por defecto). Deberías ver un mensaje indicando que el servidor está escuchando.

### 2. Iniciar la Interfaz (Frontend)

Para ver la aplicación, simplemente abre el archivo `frontend/index.html` en tu navegador.

**Recomendación:** Se recomienda utilizar una extensión como "Live Server" en VS Code para servir el frontend, lo que evita problemas de CORS y permite recarga automática.

## Cómo Probar la Aplicación

1. **Verificar Conexión**: Asegúrate de que el backend esté corriendo antes de interactuar con el formulario.
2. **Registro de Alumno**: Completa los campos del formulario de alumno (Nombre, Apellido, Edad, etc.).
3. **Añadir Familiares**: Utiliza el botón para añadir uno o más familiares al alumno.
4. **Enviar Formulario**: Haz clic en el botón de registro. Si todo es correcto, verás una alerta de confirmación.
5. **Consola del Navegador**: Puedes abrir las herramientas de desarrollador (`F12`) para ver los logs de las peticiones API y posibles errores.
6. **Datos Almacenados**: Los datos se guardan temporalmente en el servidor (en memoria o en un archivo JSON en `backend/data/` si está configurado).

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+).
- **Backend**: Node.js, Express, CORS, Body-parser.
