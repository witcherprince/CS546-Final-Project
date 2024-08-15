import express from "express";
import userValidations from "../data/users.js";
import daycareValidations from "../data/daycares.js";

const router = express.Router();

router.route("/userPage").get(async (req, res) => {
  const userId = req.session.user.userId;

  if (!userId) {
    return res.status(500).render("error", { error: "No user ID exists" });
  }

  try {
    const user = await userValidations.getUserById(userId);

    // get favorite daycares
    const userFavorites = user.favorites || [];
    const favoriteDaycares = await Promise.all(
      userFavorites.map(async (daycareId) => {
        return await daycareValidations.getOrg(daycareId);
      })
    );

    return res.render("users/userPage", {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      town: user.location.town,
      zipcode: user.location.zipcode,
      kids: user.kids,
      favorites: favoriteDaycares,
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

router.route("/editChildren").get(async (req, res) => {
  return res.render("users/editChildren");
});

// Need to make this work so when the user clicks delete child, they delete that specific child with their name
router
  .route("/deleteChild")
  .get(async (req, res) => {
    return res.render("users/deleteChild");
  })
  .delete(async (req, res) => {
    const userId = req.session.user.userId;

    if (!userId) {
      return res.status(500).render("error", { error: "No user ID exists" });
    }

    try {
      const deleteChild = await userValidations.removeChild(userId);
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

      if (userData.townInput || userData.zipcodeInput) {
        updatedFields.location = updatedFields.location || {};

        if (userData.townInput)
          updatedFields.location.town = userData.townInput;
        if (userData.zipcodeInput)
          updatedFields.location.zipcode = userData.zipcodeInput;
      }

      //if (userData.townInput || userData.zipcodeInput) {
      //  updatedFields.location = {};

      //  if (userData.townInput)
      //    updatedFields.location.town = userData.townInput;
      //  if (userData.zipcodeInput)
      //    updatedFields.location.zipcode = userData.zipcodeInput;
      //}

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

router
  .route("/changePassword")
  .get(async (req, res) => {
    return res.render("users/changePassword");
  })
  .patch(async (req, res) => {
    const userId = req.session.user.userId;
    const userInfo = req.body;

    if (!userId) {
      return res.status(500).render("error", { error: "No user ID exists" });
    }

    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res.status(400).render("error", { error: "Bad Request" });
    }

    // Error checking
    // This is to display all the errors later
    let errorCollection = [];

    if (!userInfo.newPassword) {
      //errorCollection.push("Password is required.");
      throw "Password is required";
    }
    if (!userInfo.newPasswordCheck) {
      //errorCollection.push("Password confirmation is required");
      throw "Password confirmation is required";
    }

    // Change this to match this page
    //if (errorCollection.length > 0) {
    ////  return res.status(400).render('register', {
    //   title: "Register",
    //   error: errorCollection
    //});
    //}

    try {
      const newPassword = await userValidations.changePassword(
        userId,
        userInfo.newPassword
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

router.route("/favoriteDaycares").get(async (req, res) => {
  const userId = req.session.user.userId;

  if (!userId) {
    return res.status(500).render("error", { error: "No user ID exists" });
  }

  try {
    const user = await userValidations.getUserById(userId);

    // get favorite daycares
    const userFavorites = user.favorites || [];
    const favoriteDaycares = await Promise.all(
      userFavorites.map(async (daycareId) => {
        return await daycareValidations.getOrg(daycareId);
      })
    );

    return res.render("users/favoriteDaycares", {
      favorites: favoriteDaycares,
    });
  } catch (error) {
    res.status(500).render("error", { error: "Something went wrong." });
  }
});

router.route("/userReviews").get(async (req, res) => {
  const userId = req.session.user.userId;

  if (!userId) {
    return res.status(500).render("error", { error: "No user ID exists" });
  }

  try {
    const user = await userValidations.getUserById(userId);

    // get favorite daycares
    const userFavorites = user.favorites || [];
    const favoriteDaycares = await Promise.all(
      userFavorites.map(async (daycareId) => {
        return await daycareValidations.getOrg(daycareId);
      })
    );

    return res.render("users/userReviews", {
      favorites: favoriteDaycares,
    });
  } catch (error) {
    res.status(500).render("error", { error: "Something went wrong." });
  }
});

router
  .route("/deleteUser")
  .get(async (req, res) => {
    return res.render("users/deleteUser");
  })
  .delete(async (req, res) => {
    const userId = req.session.user.userId;

    if (!userId) {
      return res.status(500).render("error", { error: "No user ID exists" });
    }

    try {
      const deleteUser = await userValidations.deleteuser(userId);
      req.session.destroy();
      return res.redirect("/");
    } catch (error) {
      res.status(500).render("error", { error: "Something went wrong." });
    }
  });

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  return res.render("users/logout");
});

export default router;
