const User = require("../models/user");
const users = require("../mocks/users");
const UserController = require("../controllers/UserController");
const Encryption = require("../helpers/encryption");

function isEmpty(name, n) {
    return n.length == 0 ? name : undefined;
}

function isEmail(em) {
    return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(em);
}

const app = require("express").Router();

app.get("/users", (req, res) => {
    UserController.getUsers().then((result) => {
        res.send(result);
    });
});

app.post("/signup", async (req, res) => {
    const emptyField =
        isEmpty("name", req.body.name) ||
        isEmpty("username", req.body.username) ||
        isEmpty("email", req.body.email) ||
        isEmpty("password", req.body.password);
    if (emptyField) {
        res.send({ error: emptyField + " cannot be empty" });
        return;
    }
    if (!isEmail(req.body.email)) {
        res.send({ error: "Email address is not valid" });
    }
    let hashed;
    try {
        hashed = await Encryption.encrypt(req.body.password);
    } catch (error) {
        console.log(error);
    }
    req.body.password = hashed;
    UserController.storeUser(req.body)
        .then((result) => {
            res.send({
                message: "User registered successfully",
                id: result._id,
            });
        })
        .catch((error) => {
            res.send({
                error: error.message,
            });
        });
});

app.post("/login", (req, res) => {
    const emptyField =
        isEmpty("email", req.body.email) ||
        isEmpty("password", req.body.password);
    if (emptyField) {
        res.send({ error: emptyField + " cannot be empty" });
        return;
    }
    if (!isEmail(req.body.email)) {
        res.send({ error: "Email address is not valid" });
    }
    const newUser = req.body;
    console.log(req.body);
    UserController.getUser(newUser.email).then((result) => {
        if (!result) {
            // res.send({error:"No user exists with given email"});
            res.send({ error: "Invalid username or password" });
        }
        Encryption.encrypt(newUser.password).then((hashed) => {
            if (result.password == hashed) {
                result.password = undefined;
                res.send({ message: "Logged in successfully", user: result });
            } else {
                res.send({ error: "Invalid username or password" });
            }
        });
    });
});

module.exports = app;
