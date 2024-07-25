import express from "express";

const router = express.Router();
router.route("/").get(async (req, res) => {
  return res.json("default login route");
});

router.route("/userLogin").get(async (req, res) => {
  return res.json("Login page for users");
});

router.route("/orgLogin").get(async (req, res) => {
  return res.json("Login page for orgs");
});
export default router;
