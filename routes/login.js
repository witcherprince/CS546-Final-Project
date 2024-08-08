import express from "express";
import userData from "../data/users.js";
import userValidations from "../data/users.js";

const router = express.Router();
router.route("/").get(async (req, res) => {
  return res.json("default login route");
});

router
  .route("/userLogin")
  .get(async (req, res) => {
    console.log("HITTING GET USER LOGIN");
    res.render("users/login");
  })
  .post(async (req, res) => {
    console.log(req.body);
    console.log("HITTING POST USER LOGIN");

    if (!req.body["emailaddress"]) {
      return res.status(400).send("Must provide an email address");
    }
    if (!req.body["passwordInput"]) {
      return res.status(400).send("Must provide a password");
    }
    const emailAddressFormatted = req.body["emailaddress"];
    const password = req.body["passwordInput"];

    try {
      const user = await userValidations.loginUser(
        emailAddressFormatted,
        password
      );
      req.session.user = {
        emailAddress: emailAddressFormatted,
        userId: user.id,
        loggedIn: true,
      };
      console.log(req.session.user.userId);
      return res.redirect("/users/userPage");
    } catch ({ name, message }) {
      return res
        .status(400)
        .render("users/loginUserErrors", { errorMessage: message });
    }
  });

router
  .route("/userSignup")
  .get(async (req, res) => {
    res.render("users/signup");
  })
  .post(async (req, res) => {
    const userInfo = req.body;

    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res.status(400).render("error", { error: "Bad Request" });
    }

    try {
      const newUser = await userData.createUser(
        userInfo.firstnameInput,
        userInfo.lastnameInput,
        userInfo.emailaddress,
        userInfo.passwordInput,
        userInfo.townInput,
        userInfo.zipcodeInput
      );
      return res.redirect("/login/userLogin");
    } catch (e) {
      return res.status(400).render("error", { error: e });
    }
  });

router.route("/orgLogin").get(async (req, res) => {
  return res.json("Login page for orgs");
});

export default router;
