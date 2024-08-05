import express from "express";

const router = express.Router();

router.route("/").get(async (req, res) => {
  const user = req.session.user;
  return res.render("landingPage", { user });
});

export default router;
