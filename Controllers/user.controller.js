const createError = require("http-errors");
const mongoose = require("mongoose");
const kite = require("../services/kite");

module.exports = {
  getPositions: async (req, res, next) => {
    try {
      const positions = await kite.getPositions();
      console.log("positions: ", positions);
      res.send(positions);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      // Forward the error to the error handling middleware or next()
      next(error);
    }
  },
};
