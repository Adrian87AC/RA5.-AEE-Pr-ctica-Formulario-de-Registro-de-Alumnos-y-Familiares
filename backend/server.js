const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuración de Middlewares
app.use(cors()); // Habilita CORS para permitir peticiones desde el frontend
app.use(bodyParser.json()); // Permite procesar el cuerpo de las peticiones en formato JSON

// Servir archivos estáticos del frontend (Usando ruta absoluta para evitar fallos de ruta)
const frontendPath = path.resolve(__dirname, '..', 'frontend');
console.log('📂 Sirviendo archivos estáticos desde:', frontendPath);
app.use(express.static(frontendPath));

// Ruta raíz explícita para entregar el index.html al acceder a la URL base
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Definición de rutas para los archivos de persistencia de datos
const DATA_FILE = path.join(__dirname, 'data', 'datos.json');
const REGISTROS_FILE = path.join(__dirname, 'data', 'registros.json');

/**
 * Endpoint para obtener los datos maestros (lenguas, países, etc.)
 * Lee el archivo datos.json y devuelve su contenido al frontend.
 */
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error leyendo datos:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(JSON.parse(data));
    });
});

/**
 * Endpoint para registrar un nuevo alumno (POST)
 * Recibe el objeto alumno, lo añade al archivo registros.json y persiste los cambios.
 */
app.post('/api/alumno', (req, res) => {
    const nuevoAlumno = req.body;
    console.log('🎓 Recibido registro de alumno:', nuevoAlumno.nombre);

    // 1. Leer los registros actuales existentes
    fs.readFile(REGISTROS_FILE, 'utf8', (err, data) => {
        let registros = [];
        // Si el archivo ya tiene datos, los cargamos
        if (!err && data) {
            registros = JSON.parse(data);
        }

        // 2. Añadir el nuevo registro con una marca de tiempo
        registros.push({
            ...nuevoAlumno,
            fechaRegistro: new Date().toISOString()
        });

        // 3. Sobrescribir el archivo registros.json con la lista actualizada
        fs.writeFile(REGISTROS_FILE, JSON.stringify(registros, null, 2), (err) => {
            if (err) {
                console.error('Error guardando registro:', err);
                return res.status(500).json({ error: 'Error al persistir el registro' });
            }
            res.status(201).json({ message: 'Alumno registrado con éxito', id: registros.length });
        });
    });
});

// Iniciamos el servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);

    // Automatización para abrir el navegador en entornos Windows
    if (process.platform === 'win32') {
        require('child_process').exec(`start http://localhost:${PORT}`);
    }
});
