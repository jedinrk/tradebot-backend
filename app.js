const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const createError = require("http-errors");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { initWebSocket } = require("./websocketService"); // Import the WebSocket service

// Initialize DB
require("./initDB")();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes or specific routes
app.use(cors()); // This enables CORS for all routes, for specific routes, use cors() for that route

const server = http.createServer(app);

initWebSocket(server); // Initialize WebSocket server

// Your Routes
const ProductRoute = require("./Routes/Product.route");
const AuthRoute = require("./Routes/auth.route");
const UserRoute = require("./Routes/user.route");
app.use("/products", ProductRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);

// 404 handler and pass to error handler
app.use((req, res, next) => {
  next(createError(404, "Not found"));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server started on port " + PORT + "...");
});
