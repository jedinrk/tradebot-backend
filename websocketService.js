const WebSocket = require("ws");

let wss; // This variable will hold the WebSocket.Server instance

function initWebSocket(server) {
  wss = new WebSocket.Server({ noServer: true });

  wss.on("connection", (ws) => {
    console.log("A new client connected");

    ws.send(`{ "message" : "Welcome !!!" }`);

    ws.on("message", (data) => {
      console.log("received: %s", data);
      ws.send(`{ "message" : "Got message" }`);
    });
  });

  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });
}

function broadcastMessage(message) {
  if (!wss) {
    throw new Error("WebSocket server not initialized");
  }

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

module.exports = { initWebSocket, broadcastMessage };
