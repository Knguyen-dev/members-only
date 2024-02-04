const router = require("express").Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

// Index
router.get("/", userController.index);

module.exports = router;
