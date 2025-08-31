const express = require("express");
const path = require("path");
const session = require("express-session");
const collection = require("./mongodb");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: true,
}));

// Paths
const templatePath = path.join(__dirname, "templates");
const publicPath = path.join(__dirname, "public");

app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.static(publicPath));

// ========== ROUTES ==========

// Login Page
app.get("/", (req, res) => {
  if (req.session.user) res.redirect("/home");
  else res.render("login");
});

// Signup Page
app.get("/signup", (req, res) => {
  res.render("signup");
});

// Signup Logic
app.post("/signup", async (req, res) => {
  const data = { name: req.body.name, password: req.body.password };
  await collection.insertMany([data]);
  req.session.user = req.body.name;
  res.redirect("/home");
});

// Login Logic
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

// Home Page
app.get("/home", (req, res) => {
  if (req.session.user) {
    res.render("home", { user: req.session.user });
  } else {
    res.redirect("/");
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// ========== FAVORITES FEATURE ==========

// const favoriteMovies = []; // Temporary storage (no DB yet)

// // View favorites
// app.get("/favorites", (req, res) => {
//   if (!req.session.user) return res.redirect("/");
//   res.render("favorites", { user: req.session.user, favorites: favoriteMovies });
// });

// // Add movie to favorites
// app.post("/add-favorite", (req, res) => {
//   console.log("POST /add-favorite body:", req.body);
//   const { title, image } = req.body;
//   if (title && image) {
//     favoriteMovies.push({ title, image });
//     return res.status(200).send("Added");
//   }
//   res.status(400).send("Invalid data");
// });


// ========== TMDB SCRIPT HANDLER ==========

app.get("/js/script.js", (req, res) => {
  res.type("application/javascript");
  res.sendFile(path.join(__dirname, "public", "js", "script.js"));
});

// ========== START SERVER ==========

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
