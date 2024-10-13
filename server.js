const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(bodyParser.raw({ type: 'image/jpeg', limit: '10mb' }));

const clients = new Set();

app.get('/', (req, res) => {
    res.send('Spectacles Relay Server is running');
});

app.post('/upload', (req, res) => {
    const frame = req.body;
    
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(frame);
        }
    });

    res.sendStatus(200);
});

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected');

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });
});

// Use a default port if process.env.PORT is not set
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the server at http://localhost:${PORT}`);
});