//Here is where you'll set up your server as shown in lecture code
// This file should set up the express server as shown in the lecture code
import express from "express";
import session from "express-session";
import exphbs from "express-handlebars";
import cookieParser from "cookie-parser";
import configRoutesFunction from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = 3000;

const app = express();

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    console.log(`Original method: ${req.method}`);
    req.method = req.body._method.toUpperCase();
    console.log(`Rewritten method: ${req.method}`);
    delete req.body._method;
  }
  next();
};

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthState",
    secret: "dayCareFinderSecret",
    saveUninitialized: false,
    resave: false,
  })
);

app.use("/login", (req, res, next) => {
  // const expiresAt = new Date();
  // expiresAt.setHours(expiresAt.getHours() + 1);
  // res.cookie("loginCookie", "testValue", { expires: expiresAt });

  // redirect if already logged in
  if (req.session.user) {
    return res.redirect("/users/userPage");
  }
  next();
});

app.use("/users", (req, res, next) => {
  // if user is not logged in we need to have them login first and then they can access user functionality
  if (!req.session.user) {
    return res.redirect("/login/userLogin");
  }
  next();
});

app.use("/daycares/addDaycareReview", (req, res, next) => {
  if (!req.session.user) {
    console.log("Must be logged in to leave a review.");
    return res.redirect("/login/userLogin");
  }

  next();
});
app.use("/daycares/updateDaycareReview", (req, res, next) => {
  if (!req.session.user) {
    console.log("Must be logged in to update a review.");
    return res.redirect("/login/userLogin");
  }

  next();
});

app.use("/daycares/welcome", (req, res, next) => {
  if (!req.session.daycare) {
    console.log("Must be logged in to access welcome page for daycare.");
    return res.redirect("/daycares/login");
  }

  next();
});

app.use("/daycares/delete", (req, res, next) => {
  if (!req.session.daycare) {
    console.log("Must be logged in to delete daycare");
    return res.redirect("/daycares/login");
  }

  next();
});

configRoutesFunction(app);

app.listen(PORT, () => {
  console.log(`Your routes will be running on http://localhost:${PORT}`);
});
