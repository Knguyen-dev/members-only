const Message = require("../models/messageModel");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

/*
+ Message validators/sanitizers:
*/
const titleValidator = body("title")
	.trim()
	.escape()
	.isLength({ min: 1, max: 100 })
	.withMessage("Title must be between 1 and 100 characters");

const contentValidator = body("content")
	.trim()
	.escape()
	.isLength({ min: 1, max: 300 })
	.withMessage("Message length must be between 1 and 300 characters");

const userValidator = body("user").trim().isLength({ min: 1 }).escape();

/*
+ Message routes
*/

/*
- Gets all messages. Optionally, we could fetch for all messages from a 
  particular user, if the request body has 'user', which would be the 
  ID of a user document.

*/
const getMessages = async (req, res) => {
	const filter = {};
	if (req.body.user) {
		filter["_id"] = req.body.user;
	}

	try {
		const messages = await Message.find().sort({ createdAt: -1 });
		return res.status(200).json(messages);
	} catch (err) {
		res.status(500).json({
			error: "An unexpected error occurred. Please try again later.",
		});
	}
};

/*
+ Create a message

- NOTE: Here we're assuming that user, which is the userID, is being passed via 
  the body of the request. Since we're not relying on query parameter ':id', this
  will probably be done through an input type=hidden, or something with authentication
  in the body of the request!
*/
const createMessage = [
	titleValidator,
	contentValidator,
	userValidator,
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
				return res.status(400).json(errors);
			}

			// Save message to the database
			const message = await Message.create({
				title: req.body.title,
				content: req.body.content,
				user: req.body.user,
			});

			res.status(200).json(message);
		} catch (err) {
			res.status(500).json({
				error: "An unexpected error occurred. Please try again later.",
			});
		}
	},
];

/*
+ Updates an existing message via its id:
- Users would update or edit their message's title
  and content here.


- NOTE: This doesn't handle the upvoting or downvoting of messages.
*/
const updateMessage = [
	titleValidator,
	contentValidator,
	async (req, res) => {
		try {
			// Check validity of message's document ID
			if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
				return res.status(400).json({ error: "Invalid message!" });
			}

			// Sanitize data and check for errors
			const errors = validationResult(req).errors.reduce((errorMap, e) => {
				return {
					...errorMap,
					[e.path]: e.msg,
				};
			}, {});

			if (Object.keys(errors).length != 0) {
				return res.status(400).json(errors);
			}

			// Query the message based on its ID
			const message = await Message.findById(req.params.id);

			// If message with that ID wasn't found
			if (!message) {
				return res.status(404).json({ error: "No message found!" });
			}

			// Else, an existing message was found so let's make changes to it and save
			message.title = req.body.title;
			message.content = req.body.content;
			message.is_edited = true;
			await message.save();

			// Return the message as JSON
			res.status(200).json(message);
		} catch (err) {
			res.status(500).json({
				error: "An unexpected error occurred. Please try again later.",
			});
		}
	},
];

/*
+ Delete a message:
- Let users with administrator status be able to delete messages.
  So first focus on message deletion logic and then you'd prefix the 
  authentication in front or something.
*/

const deleteMessage = async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ error: "Invalid Message ID" });
		}
		const message = await Message.findByIdAndDelete(req.params.id);
		res.status(200).json(message);
	} catch (err) {
		res
			.status(500)
			.json({ error: "An unexpected error occurred. Please try again later." });
	}
};

module.exports = {
	createMessage,
	getMessages,
	updateMessage,
	deleteMessage,
};
