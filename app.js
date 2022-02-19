//jshint esversion:6
require("dotenv").config();
const express = new require("express");
const ejs = new require("ejs");
const bodyParser = new require("body-parser");
const mongoose = new require("mongoose");
const md5 = new require("md5");
// const encrypt = new require("mongoose-encryption");
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
const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});
// userSchema.plugin(encrypt, {
// 	secret: process.env.SECRET,
// 	encryptedFields: ["password"],
// });
User = mongoose.model("User", userSchema);
// Requests
app.route("/").get((req, res) => {
	res.render("home");
});
console.log(md5("62d6bb063907d2c45336c459e2a4b5b9"));
app
	.route("/login")
	.get((req, res) => {
		res.render("login");
	})
	.post((req, res) => {
		const username = req.body.username;
		const password = md5(req.body.password);
		User.findOne({ email: username }, (err, foundUser) => {
			if (err) console.log(err);
			else {
				if (foundUser) {
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
			password: md5(req.body.password),
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
