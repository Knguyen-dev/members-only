const express = require("express");

const logger = require("morgan");
const cors = require("cors");
const userRouter = require("./routes/userRouter");

const app = express();

// Middleware
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRouter);

module.exports = app;
