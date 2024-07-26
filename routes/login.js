import express from "express";

const router = express.Router();
router.route("/").get(async (req, res) => {
  return res.json("default login route");
});

router.route("/userLogin").get(async (req, res) => {
  res.render("users/login");
});

router.route("/userSignup").get(async (req, res) => {
  res.render("users/signup");
});

router.route("/orgLogin").get(async (req, res) => {
  return res.json("Login page for orgs");
});
export default router;
