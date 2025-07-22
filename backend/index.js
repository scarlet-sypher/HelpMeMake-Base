require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require('./models/User')
const PORT = process.env.PORT || 3000;
const url = process.env.MONGO_URL;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  try {
    const newUser = new User(req.body); 
    console.log(req.body)
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log("app is listening on port");
  mongoose
    .connect(url)
    .then(() => console.log("Database Connected!"))
    .catch((err) => console.log(err));
});
