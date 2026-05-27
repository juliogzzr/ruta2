const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // Evita bloqueos de seguridad
});

app.use(express.static(path.join(__dirname, 'public')));

let unidadesActivas = {};

io.on('connection', (socket) => {
    // Al conectar, enviamos las unidades que ya están en ruta
    socket.emit('unidades-iniciales', unidadesActivas);

    socket.on('actualizar-ubicacion', (data) => {
        if (!data.id) return;

        if (data.lat === null) {
            delete unidadesActivas[data.id];
        } else {
            unidadesActivas[data.id] = { lat: data.lat, lng: data.lng };
        }
        io.emit('posicion-actualizada', data);
    });

    socket.on('usuario-subio', (coords) => {
        console.log(`[LOG] Usuario abordó en: ${coords.lat}, ${coords.lng}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`>>> Servidor robusto corriendo en http://localhost:${PORT}`);
});

