const express = require("express");
const router = express.Router();
const { getallusers, getallbooks, deletebook } = require("../controllers/admincontrollers");
const authenticateToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");




router.get("/getallusers", authenticateToken, isAdmin, getallusers);
router.get("/getallbooks", authenticateToken, isAdmin, getallbooks);
router.delete("/deletebook/:id", authenticateToken, isAdmin, deletebook);
module.exports = router;