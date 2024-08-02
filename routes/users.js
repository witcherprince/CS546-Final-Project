import express from "express";
import userValidations from "../data/users.js";

const router = express.Router();

router.route("/").get(async (req, res) => {
  return res.render("users/userPage");
});

router.route("/userPage").post(async (req, res) => {
  console.log(req.body);

  if (!req.body["emailaddress"]) {
    return res.status(400).send("Must provide an email address");
  }
  if (!req.body["passwordInput"]) {
    return res.status(400).send("Must provide a password");
  }
  const emailAddressFormatted = req.body["emailaddress"];
  const password = req.body["passwordInput"];

  req.session.user = {
    emailAddress: emailAddressFormatted,
    loggedIn: true,
  };

  try {
    await userValidations.loginUser(emailAddressFormatted, password);
    return res.render("users/userPage");
  } catch ({ name, message }) {
    return res
      .status(400)
      .render("users/loginUserErrors", { errorMessage: message });
  }
});

export default router;
