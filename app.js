//jshint esversion:6
const express = new require("express");
const ejs = new require("ejs");
const bodyParser = new require("body-parser");
const mongoose = new require("mongoose");
const app = new express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database connection
mongoose
	.connect("mongodb://localhost:27017/User")
	.then(() => {
		console.log("Sucessfully connected");
	})
	.catch((err) => {
		console.log(err);
	});

// Model and schema creation
const userSchema = {
	email: String,
	password: String,
};
const User = mongoose.model("User", userSchema);

// Requests
app.route("/").get((req, res) => {
	res.render("home");
});
app
	.route("/login")
	.get((req, res) => {
		res.render("login");
	})
	.post((req, res) => {
		const username = req.body.username;
		const password = req.body.password;
		console.log("password entered:" + password);
		User.findOne({ email: username }, (err, foundUser) => {
			if (err) console.log(err);
			else {
				if (foundUser) {
					console.log("password in database:" + foundUser.email);
					if (foundUser.password == password) res.render("secrets");
					else console.log("Password is incorrect");
				} else {
					console.log("User not found!");
				}
			}
		});
	});

app
	.route("/register")
	.get((req, res) => {
		res.render("register");
	})
	.post((req, res) => {
		const newUser = new User({
			email: req.body.username,
			password: req.body.password,
		});
		newUser.save((err) => {
			if (!err) res.render("secrets");
			else console.log(err);
		});
	});

// Server connection on port 3000
app.listen(3000, () => {
	console.log("Server started at port:3000");
});
