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
      kids: user.kids,
    });
  } catch (error) {
    res.status(500).render("error", { error: "Something went wrong." });
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
      res.status(500).render("error", { error: "Something went wrong." });
    }
  });

router
  .route("/editUserPage")
  .get(async (req, res) => {
    return res.render("users/editUserPage");
  })
  .patch(async (req, res) => {
    console.log("PATCH request received");
    let userData = req.body;

    // Make sure the req.body is not empty -- checking if it's either undefined or if there isn't at least one key
    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).render("layouts/error", {
        error: "There are no fields in the request body.",
      });
    }

    try {
      const updatedFields = {};
      if (userData.firstnameInput)
        updatedFields.firstname = userData.firstnameInput;
      if (userData.lastnameInput)
        updatedFields.lastname = userData.lastnameInput;
      if (userData.emailaddress) updatedFields.email = userData.emailaddress;
      if (userData.townInput) updatedFields.town = userData.townInput;
      if (userData.zipcodeInput) updatedFields.zipcode = userData.zipcodeInput;

      let updateUser = await userValidations.changeInfo(
        req.session.user.userId,
        updatedFields
      );
      return res.redirect("/users/userPage");
    } catch (error) {
      console.log(error);
      res.status(500).render("error", { error: "Something went wrong." });
    }
  });

router.route("/addToFavorites/:daycareId").get(async (req, res) => {
  try {
    const daycareId = req.params["daycareId"];
    const userId = req.session.user["userId"];
    // check that current daycare isnt already in favorites
    const userInfo = await userValidations.getUserById(userId);
    const userFavorites = userInfo["favorites"];

    for (const currFavDaycareId of userFavorites) {
      if (currFavDaycareId.toString() === daycareId) {
        return res.json("already favorited this daycare");
      }
    }
    const addToFavorite = await userValidations.addFavDaycare(
      userId,
      daycareId
    );

    return res.redirect("/daycares/daycareList");
  } catch (error) {
    return res.status(400).render("error", { error: error });
  }
});

router.route("/removeFromFavorites/:daycareId").get(async (req, res) => {
  try {
    const daycareId = req.params["daycareId"];
    const userId = req.session.user["userId"];
    // check that current daycare isnt already in favorites
    const removeDaycare = await userValidations.removeFavDaycare(
      userId,
      daycareId
    );

    return res.redirect("/daycares/daycareList");
  } catch (error) {
    return res.status(400).render("error", { error: error });
  }
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  return res.render("users/logout");
});

export default router;
