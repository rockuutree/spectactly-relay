const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

let spectaclesConnection = null;

app.post('/send-text', (req, res) => {
    const { text } = req.body;
    if (spectaclesConnection && spectaclesConnection.readyState === WebSocket.OPEN) {
        spectaclesConnection.send(JSON.stringify({ type: 'text', content: text }));
        res.json({ success: true, message: 'Text sent to Spectacles' });
    } else {
        res.status(503).json({ success: false, message: 'Spectacles not connected' });
    }
});

wss.on('connection', (ws) => {
    console.log('Spectacles connected');
    spectaclesConnection = ws;

    ws.on('close', () => {
        console.log('Spectacles disconnected');
        spectaclesConnection = null;
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));