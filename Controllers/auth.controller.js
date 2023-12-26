const createError = require("http-errors");
const mongoose = require("mongoose");
const kite = require("../services/kite");

const User = require("../Models/user.model");

const wsService = require("../services/websocketService");

module.exports = {
  redirectUrl: async (req, res, next) => {
    try {
      const requestToken = req.query.request_token;
      if (requestToken) {
        // Do something with the requestToken
        console.log("Received request token:", requestToken);
        // Process the token or perform necessary actions
        kite
          .getAccessToken(requestToken)
          .then((result) => {
            console.log("Access token retrieved:", result); // This will log { status: 'success' } if successful
            // Do something with the successful result
            res.send(result);
            // Prepare the message object
            const message = JSON.stringify(result);
            wsService.broadcastMessage(message);
          })
          .catch((error) => {
            console.error("Error retrieving access token:", error); // This will log { status: 'error' } if there's an error
            // Handle the error case
            res.send(error);
          });
      } else {
        // Handle case when request_token is not present
        console.error("No request token found");
        res.send({ status: "error" });
      }
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      // Forward the error to the error handling middleware or next()
      next(error);
    }
  },
};
