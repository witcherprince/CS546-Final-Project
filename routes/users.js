import express from "express";
import userValidations from "../data/users.js";

const router = express.Router();

router.route("/userPage").get(async (req, res) => {
  const userId = req.session.user.userId;

  if (!userId) {
    return res.redirect("/login/userLogin");
  }

  try {
    const user = await userValidations.getUserById(userId);

    return res.render("users/userPage", {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      town: user.location.town,
      zipcode: user.location.zipcode,
    });
  } catch (e) {
    res.status(500).render("layouts/error", { error: "Something went wrong." });
  }
});

export default router;
