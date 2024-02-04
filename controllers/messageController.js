const User = require("../models/userModel");
const Message = require("../models/messageModel");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const message_create_get = (req, res) => {
	res.render("create_message");
};

const messageValidator = [
	body("title")
		.trim()
		.escape()
		.isLength({ min: 1, max: 100 })
		.withMessage("Title must be between 1 to 100 characters"),
	body("content")
		.trim()
		.escape()
		.isLength({ min: 1, max: 300 })
		.withMessage("Content must be between 1 to 300 characters"),
];

const message_create_post = [
	messageValidator,

	async (req, res) => {
		try {
			const errors = validationResult(req).errors.reduce((errorMap, e) => {
				return {
					...errorMap,
					[e.path]: e.msg,
				};
			}, {});

			// If there are errors, return the errors map
			if (Object.keys(errors).length != 0) {
				return res.render("create_message", {
					errors,
				});
			}

			// Create a message object and save it
			// NOTE: Still need to have the user who created the post
			const message = new Message({
				title: req.body.title,
				content: req.body.content,
				user: req.user.id,
			});
			await message.save();

			// Redirect them to the home page
			res.redirect("/");
		} catch (err) {
			return next(err);
		}
	},
];

const message_update_get = async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			const error = new Error("Invalid ID for message");
			return next(error);
		}

		const message = await Message.findById(req.params.id).populate("user");

		if (!message) {
			const error = new Error("Invalid ID for message");
			return next(error);
		}

		res.render("create_message", {
			isUpdate: true,
			message,
		});
	} catch (err) {
		return next(err);
	}
};

const message_update_post = [
	messageValidator,
	async (req, res) => {
		// Sanitize data and return an error map
		const errors = validationResult(req).errors.reduce((errorMap, e) => {
			return {
				...errorMap,
				[e.path]: e.msg,
			};
		}, {});

		// Get route ensures message id is valid and links to an existing message
		// Created new message object since we need it for rendering errors if it happens
		const updatedMessage = new Message({
			title: req.body.title,
			content: req.body.content,
			_id: req.params.id,
			is_edited: true,
		});

		// If there are errors, return the errors map
		if (Object.keys(errors).length != 0) {
			return res.render("create_message", {
				isUpdate: true,
				errors,
				message: updatedMessage,
			});
		}

		// Everything is valid, so save message to the database
		await Message.findByIdAndUpdate(req.params.id, updatedMessage);

		// Just redirect them to the home page for now
		res.redirect("/");
	},
];

const message_delete_post = async (req, res) => {
	// Check the validity of the ID

	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		const error = new Error("Invalid ID for Message!");
		error.status = 400;
		return next(error);
	}

	// Get message and check its existence
	const message = await Message.findById(req.params.id);
	if (!message) {
		const error = new Error("Message not found!");
		error.status = 404;
		return next(error);
	}

	// Delete the message
	await Message.deleteOne({
		_id: req.params.id,
	});

	// Redirect the user to the home page
	res.redirect("/");
};

module.exports = {
	message_create_get,
	message_create_post,
	message_update_get,
	message_update_post,
	message_delete_post,
};
