const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
		},
		title: {
			type: String,
			required: true,
			maxLength: 100,
		},
		content: {
			type: String,
			required: true,
			maxlength: 300,
		},
		is_edited: {
			type: Boolean,
			default: false,
		},
		num_upvotes: {
			type: Number,
			default: 0,
		},
		num_downvotes: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Message", messageSchema);
