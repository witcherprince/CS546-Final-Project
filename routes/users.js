//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import express from "express";

const router = express.Router();
router.route("/").get(async (req, res) => {
  return res.render("landingPage");
});

router.route("/test").get(async (req, res) => {
  return res.render("landingPage");
});
export default router;
