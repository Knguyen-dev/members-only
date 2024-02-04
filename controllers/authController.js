const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const signup_get = (req, res) => {
	res.render("signup");
};

const signup_post = [
	body("email")
		.trim()
		.escape()
		.isEmail()
		.withMessage("Not a valid email!")
		.isLength({ max: 64 })
		.withMessage("Maximum email length is 64 characters!")
		.custom(async (email) => {
			const user = await User.findOne({ email });
			if (user) {
				throw new Error("E-mail already in use!");
			}
		}),
	body("first_name")
		.trim()
		.escape()
		.isLength({ min: 1, max: 60 })
		.withMessage("First name must be between 1 to 60 characters"),
	body("last_name")
		.trim()
		.escape()
		.isLength({ min: 1, max: 60 })
		.withMessage("Last name must be between 1 to 60 characters"),
	body("password")
		.trim()
		.isLength({ min: 8, max: 40 })
		.withMessage(
			"Password must be between 8 and 40 characters and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol"
		)
		.isStrongPassword({
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		})
		.withMessage(
			"Password must be between 8 and 40 characters and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol"
		),
	body("confirm_password")
		.custom((confirmPassword, { req }) => {
			return confirmPassword === req.body.password;
		})
		.withMessage("Passwords must match!"),
	/*
  - Error handling:
  1. Since it's associated with a signup form, we want to have an object
    with the errors. So 'errors' will be in form:
    {
      email: "Bad email!",
      first-name: 'First name can't be blank!',
      field-name: 'some error message'
    }
  */
	async (req, res, next) => {
		try {
			// Sanitize data and return an error map
			const errors = validationResult(req).errors.reduce((errorMap, e) => {
				return {
					...errorMap,
					[e.path]: e.msg,
				};
			}, {});

			// If there are errors, return the errors map
			if (Object.keys(errors).length != 0) {
				return res.render("signup", {
					errors,
				});
			}

			// Get form data from request body
			const { email, password, first_name, last_name } = req.body;

			// Register user in the database
			const user = await User.signup(email, password, first_name, last_name);

			// Redirect them to the login page
			res.redirect("/auth/login");
		} catch (err) {
			return next(err);
		}
	},
];

const login_get = (req, res) => {
	res.render("login");
};

const login_post = (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/auth/login",
		failureMessage: true, // puts our error message in req.session.messages
	})(req, res, next);
};

const logout = async (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		} else {
			res.redirect("/auth/login");
		}
	});
};

module.exports = {
	signup_get,
	signup_post,
	login_get,
	login_post,
	logout,
};

/*
+ I kind of know what's happening, but we're kind of blowing through. 

*/
