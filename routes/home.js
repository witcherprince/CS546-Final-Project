import express from "express";

const router = express.Router();

router.route("/").get(async (req, res) => {
  return res.render("landingPage");
});

export default router;
