const User = require("../models/userModel");
const mongoose = require("mongoose");
const Message = require("../models/messageModel");
const { body, validationResult } = require("express-validator");

// Index contoller
const index = async (req, res) => {
	try {
		const messages = await Message.find()
			.sort({ createdAt: -1 })
			.populate("user");

		res.render("index", {
			messages,
		});
	} catch (err) {
		return next(err);
	}
};

// get user account details
const getUserDetails = async (req, res, next) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			const err = new Error("Invalid ID for user!");
			return next(err);
		}

		const [user, messages] = await Promise.all([
			User.findById(req.params.id),
			Message.find({
				user: req.params.id,
			}),
		]);

		if (!user) {
			const err = new Error("No user found!");
		}

		res.render("user_details", {
			user,
			messages,
		});
	} catch (err) {
		return next(err);
	}
};

const admin_register_get = (req, res) => {
	res.render("admin_register", {
		secret_code: process.env.ADMIN_SECRET_CODE,
	});
};

const admin_register_post = async (req, res) => {
	if (process.env.ADMIN_SECRET_CODE !== req.body.secret_code) {
		return res.render("admin_register", {
			errors: { secret_code: "Bad code!" },
			secret_code: process.env.ADMIN_SECRET_CODE,
		});
	}

	// Find the user in the database associated with the currently logged in user
	try {
		const user = await User.findById(req.user.id);
		user.role = "admin";
		await user.save();
		res.redirect(`/users/${user.id}`);
	} catch (err) {
		return next(err);
	}
};

const member_register_get = (req, res) => {
	res.render("member_register", {
		secret_code: process.env.MEMBER_SECRET_CODE,
	});
};

const member_register_post = async (req, res) => {
	// Check if the code they entered was the same secret code
	if (process.env.MEMBER_SECRET_CODE !== req.body.secret_code) {
		return res.render("member_register", {
			errors: {
				secret_code: "Bad code!",
			},
			secret_code: process.env.MEMBER_SECRET_CODE,
		});
	}

	try {
		// Find user, change role, save changes, and redirect
		const user = await User.findById(req.user.id);
		user.role = "member";
		await user.save();
		res.redirect(`/users/${user.id}`);
	} catch (err) {
		return next(err);
	}
};

module.exports = {
	index,
	getUserDetails,
	admin_register_get,
	admin_register_post,
	member_register_get,
	member_register_post,
};
