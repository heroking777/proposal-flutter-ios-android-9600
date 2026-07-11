import { WebSocket } from 'ws';

interface Message {
  type: string;
  content: string;
  senderId: string;
}

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message: string) => {
    const msg: Message = JSON.parse(message);
    console.log(`Received message from ${msg.senderId}: ${msg.content}`);

    // Broadcast the message to all clients except the sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server started on port 8080');