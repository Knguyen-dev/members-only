require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

// Connect to database and start server
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("Connected to MongoDB");

		app.listen(process.env.PORT, () => {
			console.log(`App listening on port ${process.env.PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
