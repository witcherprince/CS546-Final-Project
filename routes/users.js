import express from "express";
import userValidations from "../data/users.js";

const router = express.Router();

router.route("/userPage").get(async (req, res) => {
  return res.render("users/userPage");
});

export default router;
