const express = require('express');
const fetch = require('node-fetch');
const M3u8Parser = require('m3u8-parser');
const path = require('path');
const app = express();
const port = 3000;

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener los canales desde un enlace M3U personalizado
app.get('/channels', async (req, res) => {
    const m3uUrl = req.query.url; // El enlace se pasa como parámetro en la URL
    if (!m3uUrl) {
        return res.status(400).send('Por favor, proporciona un enlace M3U válido');
    }

    try {
        const response = await fetch(m3uUrl);
        const m3uData = await response.text();

        const parser = new M3u8Parser.Parser();
        parser.push(m3uData);
        parser.end();

        const parsed = parser.manifest;
        const channels = parsed.playlists ? parsed.playlists.map(playlist => ({
            name: playlist.attributes.NAME || 'Unnamed Channel',
            url: playlist.uri
        })) : [];

        res.json(channels);
    } catch (error) {
        console.error('Error fetching M3U:', error);
        res.status(500).send('Error al procesar el enlace IPTV');
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
