const router = require("express").Router();
const authController = require("../controllers/authController");

router.get("/login", authController.login_get);
router.post("/login", authController.login_post);

router.get("/logout", authController.logout);

router.get("/sign-up", authController.signup_get);
router.post("/sign-up", authController.signup_post);

module.exports = router;
