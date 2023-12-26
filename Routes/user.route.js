const express = require("express");
const router = express.Router();

const userController = require("../Controllers/user.controller");

//Create a new product
router.get("/getPositions", userController.getPositions);

module.exports = router;
