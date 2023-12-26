const express = require("express");

const createError = require("http-errors");
const dotenv = require("dotenv").config();

const app = express();
//const server = require("http").createServer(app);
//const wss = new Websocket.Server({ port: 8080 });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB
require("./initDB")();

//const wsService = new WebSocketService(server);

const WebSocketService = require('./services/websocketService');

const ProductRoute = require("./Routes/Product.route");
const AuthRoute = require("./Routes/auth.route");
app.use("/products", ProductRoute);
app.use("/api/auth", AuthRoute);

//404 handler and pass to error handler
app.use((req, res, next) => {
  /*
  const err = new Error('Not found');
  err.status = 404;
  next(err);
  */
  // You can use the above code if your not using the http-errors module
  next(createError(404, "Not found"));
});

//Error handler
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

app.listen(PORT, () => {
  console.log("Server started on port " + PORT + "...");
});

