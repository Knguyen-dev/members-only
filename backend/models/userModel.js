const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			lowercase: true,
			maxLength: 64,
			unique: true,
		},

		password: {
			type: String,
			required: true,
		},

		first_name: {
			type: String,
			required: true,
			maxLength: 60,
		},

		last_name: {
			type: String,
			required: true,
			maxLength: 60,
		},

		/*
    - NOTE: It should be noted that if a user is an admin, then
      making them a member won't really do anything more. Like an 
      admin has all of the permissions of a member, but 
      then they can also delete messages. So yeah you can 
      make an admin, also a member but know it won't really add
      any more functionality.
    */

		is_member: {
			type: Boolean,
			default: false,
		},

		is_admin: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: { virtuals: true }, // include virtuals in JSON.stringify()
		timestamps: true, // include createdAt and updated At properties
	}
);

userSchema.virtual("full_name").get(function () {
	return `${this.first_name} ${this.last_name}`;
});

userSchema.statics.signup = async function (
	email,
	password,
	first_name,
	last_name
) {
	// Create salt and password hash
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	// Save user to database and return the user
	const user = await this.create({
		email,
		password: hash,
		first_name,
		last_name,
	});
	return user;
};

module.exports = mongoose.model("User", userSchema);
