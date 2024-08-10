import express from "express";
import userValidations from "../data/users.js";

const router = express.Router();

router.route("/userPage").get(async (req, res) => {
  const userId = req.session.user.userId;

  if (!userId) {
    throw "No user ID exists";
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
  } catch (error) {
    res.status(500).render("layouts/error", { error: "Something went wrong." });
  }
});

router
  .route("/addChildren")
  .get(async (req, res) => {
    return res.render("users/addChildren");
  })
  .post(async (req, res) => {
    const { firstnameInput, lastnameInput, ageInput } = req.body;

    try {
      const newKid = await userValidations.addChild(
        req.session.user.userId,
        firstnameInput,
        lastnameInput,
        ageInput
      );
      return res.redirect("/users/userPage");
    } catch (error) {
      res
        .status(500)
        .render("layouts/error", { error: "Something went wrong." });
    }
  });

router.route("/editUserPage").get(async (req, res) => {
  return res.render("users/editUserPage");
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  return res.render("users/logout");
});

export default router;
