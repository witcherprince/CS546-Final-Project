import express from "express";
import userData from '../data/users.js';

const router = express.Router();
router.route("/").get(async (req, res) => {
  return res.json("default login route");
});

router.route("/userLogin").get(async (req, res) => {
  res.render("users/login");
});

router.route("/userSignup").get(async (req, res) => {
    res.render("users/signup");
})
.post(async (req, res) => {
    const userInfo = req.body;

    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res.status(400).render('error', { error: 'Bad Request'})
    }

    try {

    const newUser = await userData.createUser(userInfo.firstnameInput, userInfo.lastnameInput, userInfo.emailaddress, userInfo.passwordInput, 
        userInfo.townInput, userInfo.zipcodeInput);
    return res.redirect("/login/userLogin");
    }
    catch (e) {
      return res.status(400).render('error', { error: e})
    }

});

router.route("/orgLogin").get(async (req, res) => {
  return res.json("Login page for orgs");
});
export default router;
