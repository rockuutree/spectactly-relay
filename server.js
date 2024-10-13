const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Increase the limit if you're dealing with large frames
app.use(bodyParser.raw({ type: 'image/jpeg', limit: '10mb' }));

// Store connected clients
const clients = new Set();

app.post('/upload', (req, res) => {
    const frame = req.body;
    
    // Broadcast the frame to all connected clients
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));