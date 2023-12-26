const WebSocket = require("ws");

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("A new client connected");
  ws.on("error", console.error);

  ws.send(`{ "message" : "Welcome !!!" }`);

  ws.on("message", (data) => {
    console.log("received: %s", data);
    ws.send(`{ "message" : "Got message" }`);
  });
});

function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

module.exports = { broadcastMessage };

