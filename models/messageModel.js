const mongoose = require("mongoose");
const { DateTime } = require("luxon");

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
	},
	{
		timestamps: true,
	}
);

messageSchema.virtual("formatted_created_date").get(function () {
	return DateTime.fromJSDate(this.createdAt).toLocaleString(
		DateTime.DATETIME_MED
	);
});

messageSchema.virtual("formatted_update_date").get(function () {
	return DateTime.fromJSDate(this.updatedAt).toLocaleString(
		DateTime.DATETIME_MED
	);
});

module.exports = mongoose.model("Message", messageSchema);
