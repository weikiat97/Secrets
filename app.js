//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
})

app.get("/register", function(req, res) {
    res.render("register");
})

app.get("/login", function(req, res) {
    res.render("login");
})

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save(function(err) {
        if (!err) {
            res.render("secrets");
        } else {
            res.send(err);
        }
    });
})

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);
    console.log(password);
    User.findOne({email: username}, function(err, foundUser) {
        if (err) {
            res.send(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                } else {
                    res.send("Wrong password! Try again!");
                }
            } else {
                res.send("No such user! Please register instead");
            }
        }
    })
})

app.listen(3000, function() {
    console.log("Server started listening on port 3000.");
});