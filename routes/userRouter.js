const router = require("express").Router();
const userController = require("../controllers/userController");

const auth = require("../middleware/auth");

// Admin-related Routes
router.get(
	"/admin_register",
	auth.handleIsAuth,
	userController.admin_register_get
);
router.post(
	"/admin_register",
	auth.handleIsAuth,
	userController.admin_register_post
);

router.get(
	"/member_register",
	auth.handleIsAuth,
	userController.member_register_get
);
router.post(
	"/member_register",
	auth.handleIsAuth,
	userController.member_register_post
);

// User or member related routes
router.get("/:id", auth.handleIsAuth, userController.getUserDetails);

module.exports = router;
