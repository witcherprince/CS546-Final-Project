import express from "express";

const router = express.Router();

router.route("/").get(async (req, res) => {
  return res.render("users/userPage");
});

router.route("/userPage").post(async (req, res) => {
  return res.render("users/userPage");
});

export default router;
