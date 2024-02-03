const router = require("express").Router();
const userController = require("../controllers/userController");

// Create user route
router.post("/", userController.signupUser);

// Get user details route
router.get("/:id", userController.getUser);

// Delete user route

// Update user route

module.exports = router;
