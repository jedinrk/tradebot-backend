const express = require("express");
const router = express.Router();

const authController = require("../Controllers/auth.controller");

//Create a new product
router.get("/authorize", authController.redirectUrl);

module.exports = router;
