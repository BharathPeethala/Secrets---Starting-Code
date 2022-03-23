//jshint esversion:6

//encrypting decrypting
// require("dotenv").config();
// const encrypt = new require("mongoose-encryption");

// hashing
// const md5 = new require("md5");

//hasing with salting
// const bcrypt = require("bcrypt");
// const saltRounds = 10;

const express = new require("express");
const ejs = new require("ejs");
const bodyParser = new require("body-parser");
const mongoose = new require("mongoose");
const session = new require("express-session");
const passport = new require("passport");
const passportLocalMongoose = new require("passport-local-mongoose");
const app = new express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
	session({
		secret: "Bharath is the best",
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

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
userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(encrypt, {
// 	secret: process.env.SECRET,
// 	encryptedFields: ["password"],
// });
const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Requests

app.route("/").get((req, res) => {
	res.render("home");
});
app.route("/logout").get((req, res) => {
	req.logout();
	res.redirect("/");
});
app
	.route("/login")
	.get((req, res) => {
		res.render("login");
	})
	.post((req, res) => {
		const user = User({
			username: req.body.username,
			password: req.body.password,
		});
		req.login(user, (err) => {
			if (err) console.log(err);
			else {
				passport.authenticate("local")(req, res, () => {
					res.redirect("/secrets");
				});
			}
		});
	});

app.route("/secrets").get((req, res) => {
	if (req.isAuthenticated()) {
		res.render("secrets");
	} else {
		res.redirect("/login");
	}
});
app
	.route("/register")
	.get((req, res) => {
		res.render("register");
	})
	.post((req, res) => {
		User.register({ username: req.body.username }, req.body.password, (err) => {
			if (err) {
				console.log(err);
				res.redirect("/register");
			} else {
				passport.authenticate("local")(req, res, function () {
					res.redirect("/secrets");
				});
			}
		});
	});

// Server connection on port 3000
app.listen(3000, () => {
	console.log("Server started at port:3000");
});
