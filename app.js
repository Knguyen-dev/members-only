const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const logger = require("morgan");
const path = require("path");

const indexRouter = require("./routes/indexRouter");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const messageRouter = require("./routes/messageRouter");

const app = express();

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/*
+ Session storage: Storing session data in a mongodb database
  instead of just having it on the server.
*/
app.use(
	session({
		secret: process.env.SECRET,
		sessionStore: MongoStore.create({
			mongoUrl: process.env.MONGO_URI,
			collectionName: "sessions",
		}),
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24, // one day
		},
	})
);

// Middleware for initializing passport.js, localstrategy, and lets passport work iwth session
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

/*
+ Records the current user in the locals so that we don't have to pass it everytime to 
  our render functions.
*/
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

// Routes
app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/messages", messageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, so error message only appears in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page, using the error code's status, or fallback to 500
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
