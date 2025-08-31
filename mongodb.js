const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/LoginSignUp")
  .then(() => console.log("MongoDB connected"))
  .catch(() => console.log("MongoDB connection failed"));

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true }
});

const collection = mongoose.model("Users", schema);

module.exports = collection;
