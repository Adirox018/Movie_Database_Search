const express = require("express");
const path = require("path");
const session = require("express-session");
const collection = require("./mongodb");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: true,
}));

const templatePath = path.join(__dirname, "templates");
const publicPath = path.join(__dirname, "public");

app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.static(publicPath));

// Routes
app.get("/", (req, res) => {
  if (req.session.user) res.redirect("/home");
  else res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
  };
  await collection.insertMany([data]);
  req.session.user = req.body.name;
  res.redirect("/home");
});

app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.name });
    if (check && check.password === req.body.password) {
      req.session.user = req.body.name;
      res.redirect("/home");
    } else {
      res.send('<script>alert("Invalid credentials"); window.location.href = "/";</script>');
    }
  } catch (error) {
    console.error(error);
    res.send('<script>alert("Server error"); window.location.href = "/";</script>');
  }
});

app.get("/home", (req, res) => {
  if (req.session.user) res.render("home", { user: req.session.user });
  else res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});