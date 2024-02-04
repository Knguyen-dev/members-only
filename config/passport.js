const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const customFields = {
	usernameField: "email",
	passwordField: "password",
};

const verifyCallback = async (email, password, done) => {
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return done(null, false, { message: "Email was not found dude!" });
		}

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return done(null, false, { message: "Incorrect password dude!" });
		}

		return done(null, user);
	} catch (err) {
		done(err);
	}
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);
passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser((userId, done) => {
	User.findById(userId)
		.then((user) => {
			done(null, user);
		})
		.catch((err) => {
			done(err);
		});
});
