const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

/*
+ User input validators/sanitizers
*/
const emailValidator = body("email")
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
	});

const firstNameValidator = body("first_name")
	.trim()
	.escape()
	.isLength({ min: 1, max: 60 })
	.withMessage("First name must be between 1 to 60 characters");

const lastNameValidator = body("last_name")
	.trim()
	.escape()
	.isLength({ min: 1, max: 60 })
	.withMessage("Last name must be between 1 to 60 characters");

const passwordValidator = body("password")
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
	);

const confirmPasswordValidator = body("confirm_password")
	.custom((confirmPassword, { req }) => {
		return confirmPassword === req.body.password;
	})
	.withMessage("Passwords must match!");

/*
+ User Routes
+ Signing up a user
*/
const signupUser = [
	emailValidator,
	firstNameValidator,
	lastNameValidator,
	passwordValidator,
	confirmPasswordValidator,
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
	async (req, res) => {
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
				return res.status(400).json(errors);
			}

			// Get form data from request body
			const { email, password, first_name, last_name } = req.body;

			// Register user in the database
			const user = await User.signup(email, password, first_name, last_name);
			res.status(200).json({ id: user._id, email: user.email });
		} catch (err) {
			res.status(500).json({
				error: "An unexpected error occurred. Please try again later.",
			});
		}
	},
];

// Login route should be here

// - Get user via ID
const getUser = async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ error: "User ID not valid!" });
		}

		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ error: "User not found!" });
		}

		res.status(200).json(user);
	} catch (err) {
		res
			.status(500)
			.json({ error: "An unexpected error occurred. Please try again later." });
	}
};

module.exports = {
	signupUser,
	getUser,
};
