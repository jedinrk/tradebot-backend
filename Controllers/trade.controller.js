const createError = require("http-errors");
const mongoose = require("mongoose");
const kite = require("../services/kite");

const User = require("../Models/user.model");
const Trade = require("../Models/trade.model")

module.exports = {
  placeOrder: async (req, res, next) => {
    try {
      
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      // Forward the error to the error handling middleware or next()
      next(error);
    }
  },
};
