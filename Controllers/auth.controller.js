const createError = require("http-errors");
const mongoose = require("mongoose");
const kite = require("../services/kite");

const User = require("../Models/user.model");

const { broadcastMessage } = require("../app"); // Double-check the path to app.js

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
          .then(async (result) => {
            const { userData, accessToken, status } = result;
            await saveUserData(userData);
            console.log("Access token retrieved:", result.accessToken); // This will log { status: 'success' } if successful
            // Do something with the successful result
            res.send(
              JSON.stringify({
                status,
                accessToken,
              })
            );
            // Prepare the message object
            const message = JSON.stringify({
              status,
              accessToken,
            });
            broadcastMessage(message);
          })
          .catch((error) => {
            console.error("Error retrieving access token:", error); // This will log { status: 'error' } if there's an error
            // Handle the error case
            res.send({ status: "error" });
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

  getAccessToken: async (req, res, next) => {
    try {
      const user_id = req.query.user_id;
      const accessToken = await getAccessToken(user_id);

      if (accessToken) {
        console.log("Access Token:", accessToken);
        res.send({ status: "success", accessToken });
      } else {
        console.log("Access Token not found for the user");
        res.send({ status: "error" });
      }
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      res.send({ status: "error" });

      //next(error); Forward the error to the error handling middleware or next()
    }
  },
};

const saveUserData = async (userData) => {
  try {
    const query = {
      $or: [{ email: userData.email }, { user_id: userData.user_id }],
    };
    const existingUser = await User.findOneAndUpdate(query, userData, {
      new: true,
      upsert: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (existingUser) {
      console.log("User data updated:", existingUser);
    } else {
      console.log("New user data created:", userData);
    }
  } catch (error) {
    console.error("Error saving/updating user data:", error);
  }
};

const getAccessToken = async (userId) => {
  try {
    const user = await User.findOne({ user_id: userId });

    if (user) {
      const accessToken = user.access_token;
      return accessToken;
    } else {
      console.log("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
};
