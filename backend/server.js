const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos del frontend (Usando ruta absoluta para evitar fallos)
const frontendPath = path.resolve(__dirname, '..', 'frontend');
console.log('📂 Sirviendo archivos estáticos desde:', frontendPath);
app.use(express.static(frontendPath));

// Ruta raíz explícita para evitar errores de navegación
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Rutas de datos
const DATA_FILE = path.join(__dirname, 'data', 'datos.json');
const REGISTROS_FILE = path.join(__dirname, 'data', 'registros.json');

// Endpoint para obtener los datos maestros (lenguas, países, etc.)
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error leyendo datos:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint para registrar un alumno (POST)
app.post('/api/alumno', (req, res) => {
    const nuevoAlumno = req.body;
    console.log('🎓 Recibido registro de alumno:', nuevoAlumno.nombre);

    // Leer registros actuales
    fs.readFile(REGISTROS_FILE, 'utf8', (err, data) => {
        let registros = [];
        if (!err && data) {
            registros = JSON.parse(data);
        }

        // Añadir el nuevo alumno
        registros.push({
            ...nuevoAlumno,
            fechaRegistro: new Date().toISOString()
        });

        // Guardar en el archivo
        fs.writeFile(REGISTROS_FILE, JSON.stringify(registros, null, 2), (err) => {
            if (err) {
                console.error('Error guardando registro:', err);
                return res.status(500).json({ error: 'Error al persistir el registro' });
            }
            res.status(201).json({ message: 'Alumno registrado con éxito', id: registros.length });
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);

    // Intentar abrir el navegador automáticamente en Windows
    if (process.platform === 'win32') {
        require('child_process').exec(`start http://localhost:${PORT}`);
    }
});
