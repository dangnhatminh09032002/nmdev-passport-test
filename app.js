require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passportSetup = require("./config/passport-setup");
const session = require("express-session");
const passport = require("passport");

// Router
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "sid",
    resave: false,
    secret: "secret",
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

//connect to mongooseDB
const url = process.env.DB_URL;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: false,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

// set view engine
app.set("view engine", "ejs");

// set up routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// create home route
app.get("/", (req, res) => {
  res.render("home");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
