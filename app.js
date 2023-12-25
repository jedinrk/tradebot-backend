const express = require("express");
const Websocket = require("ws");

const createError = require("http-errors");
const dotenv = require("dotenv").config();

const app = express();
const server = require("http").createServer(app);
const wss = new Websocket.Server({ port: 8080 });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB
require("./initDB")();

wss.on("connection", function connection(ws) {
  console.log("A new client message");
  ws.on("error", console.error);

  ws.send(`{ "message" : "Welcome !!!" }`);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
    ws.send(`{ "message" : "Got message" }`);
  });
});

const ProductRoute = require("./Routes/Product.route");
app.use("/products", ProductRoute);

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
