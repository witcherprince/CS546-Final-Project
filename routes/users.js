import express from "express";
import userValidations from "../data/users.js";
import daycareValidations from "../data/daycares.js";
import reviewValidations from "../data/reviews.js ";
import validation from "../validation.js";

const router = express.Router();

router.route("/userPage").get(async (req, res) => {
  let userId = req.session.user.userId;

  if (!userId) {
    throw "No user with that ID exists";
  }

  const user = await userValidations.getUserById(userId);

  try {
    // Some of the typical checks
    userId = validation.checkId(userId);
    user.firstName = validation.checkString(user.firstName, "First name");
    user.lastName = validation.checkString(user.lastName, "Last name");
    user.firstName = validation.checkNames(user.firstName, "First name");
    user.lastName = validation.checkNames(user.lastName, "Last name");

    user.email = validation.checkEmail(user.email);

    user.location.town = validation.checkString(user.location.town, "Town");
    user.location.zipcode = validation.checkNumberZipcode(
      user.location.zipcode,
      "Zipcode"
    );
  } catch (error) {
    return res.status(400).render("error", { error: error });
  }

  try {
    return res.render("users/userPage", {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      town: user.location.town,
      zipcode: user.location.zipcode,
      kids: user.kids,
    });
  } catch (error) {
    return res.status(500).render("error", { error: "Something went wrong." });
  }
});

router
  .route("/addChildren")
  .get(async (req, res) => {
    return res.render("users/addChildren");
  })
  .post(async (req, res) => {
    let { firstnameInput, lastnameInput, ageInput } = req.body;

    try {
      // Some checks
      firstnameInput = validation.checkString(firstnameInput, "First Name");
      lastnameInput = validation.checkString(lastnameInput, "Last Name");
      firstnameInput = validation.checkNames(firstnameInput, "First Name");
      lastnameInput = validation.checkNames(lastnameInput, "Last Name");

      ageInput = Number(ageInput);
      ageInput = validation.checkChildAge(ageInput, "Age");
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }

    try {
      const newKid = await userValidations.addChild(
        req.session.user.userId,
        firstnameInput,
        lastnameInput,
        ageInput
      );
      return res.redirect("/users/userPage");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Something went wrong." });
    }
  });

// Need to make this work so when the user clicks delete child, they delete that specific child with their name
router.route("/deleteChild/:firstname").get(async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const firstName = req.params.firstname;

    if (!userId) {
      throw "No user ID exists";
    }

    const deleteChild = await userValidations.removeChild(userId, firstName);
    return res.redirect("/users/userPage");
  } catch (error) {
    return res.status(400).render("error", { error: error });
  }
});

router
  .route("/editUserPage")
  .get(async (req, res) => {
    return res.render("users/editUserPage");
  })
  .patch(async (req, res) => {
    let userData = req.body;
    const updatedFields = {};

    // Make sure the req.body is not empty -- checking if it's either undefined or if there isn't at least one key
    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).render("layouts/error", {
        error: "There are no fields in the request body.",
      });
    }

    try {
      if (userData.firstnameInput) {
        updatedFields.firstname = userData.firstnameInput;
        updatedFields.firstname = validation.checkString(
          updatedFields.firstname,
          "First Name"
        );
        updatedFields.firstname = validation.checkNames(
          updatedFields.firstname,
          "First Name"
        );
      }

      if (userData.lastnameInput) {
        updatedFields.lastname = userData.lastnameInput;
        updatedFields.lastname = validation.checkString(
          updatedFields.lastname,
          "Last Name"
        );
        updatedFields.lastname = validation.checkNames(
          updatedFields.lastname,
          "Last Name"
        );
      }

      if (userData.emailaddress) {
        updatedFields.email = userData.emailaddress;
        updatedFields.email = validation.checkEmail(updatedFields.email);
      }

      if (userData.townInput || userData.zipcodeInput) {
        updatedFields.location = updatedFields.location || {};

        if (userData.townInput) {
          updatedFields.location.town = userData.townInput;
          updatedFields.location.town = validation.checkString(
            updatedFields.location.town
          );
        }
        if (userData.zipcodeInput) {
          updatedFields.location.zipcode = userData.zipcodeInput;
          updatedFields.location.zipcode = Number(
            updatedFields.location.zipcode
          );
          updatedFields.location.zipcode = validation.checkNumberZipcode(
            updatedFields.location.zipcode
          );
        }
      }
    } catch (error) {
      return res.status(400).render("users/editUserPage", {
        error: error,
      });
    }

    try {
      let updateUser = await userValidations.changeInfo(
        req.session.user.userId,
        updatedFields
      );
      return res.redirect("/users/userPage");
    } catch (error) {
      console.log(error);
      return res.status(500).render("error", { error: error });
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

    try {
      if (!userId) {
        throw "No user ID exists.";
      }

      if (!userInfo || Object.keys(userInfo).length === 0) {
        throw "No data was entered.";
      }

      // Error checking
      // This is to display all the errors later
      let errorCollection = [];

      if (!userInfo.newPassword) {
        errorCollection.push("Password is required.");
      }
      if (!userInfo.newPasswordCheck) {
        errorCollection.push("Password confirmation is required");
      }

      // Change this to match this page
      if (errorCollection.length > 0) {
        return res.status(400).render("users/changePassword", {
          error: errorCollection,
        });
      }
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }

    try {
      const newPassword = await userValidations.changePassword(
        userId,
        userInfo.newPassword
      );

      return res.redirect("/users/userPage");
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .render("error", { error: "Something went wrong." });
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
    console.log(daycareId);
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

  try {
    if (!userId) {
      throw "No user ID exists.";
    }
    const favoritesId = await userValidations.getAllDaycares(userId);
    const favoriteDaycares = await Promise.all(
      favoritesId.map(async (daycareId) => {
        return await daycareValidations.getOrg(daycareId);
      })
    );

    return res.render("users/favoriteDaycares", {
      favorites: favoriteDaycares,
    });
  } catch (error) {
    return res.status(400).render("error", { error: error });
  }
});

router.route("/userRemoveFromFavorites/:daycareId").get(async (req, res) => {
  try {
    const daycareId = req.params["daycareId"];
    const userId = req.session.user["userId"];
    // check that current daycare isnt already in favorites
    console.log(daycareId);
    const removeDaycare = await userValidations.removeFavDaycare(
      userId,
      daycareId
    );

    return res.redirect("/users/favoriteDaycares");
  } catch (error) {
    return res.status(400).render("error", { error: error });
  }
});

router.route("/userReviews").get(async (req, res) => {
  const userId = req.session.user.userId;

  try {
    if (!userId) {
      throw "No user ID exists.";
    }

    const reviewsId = await reviewValidations.getAllReviews(userId);
    console.log(reviewsId);
    const theReview = await Promise.all(
      reviewsId.map(async (reviewId) => {
        return await reviewValidations.getReviewById(reviewId);
      })
    );

    return res.render("users/userReviews", {
      reviews: theReview,
    });
  } catch (error) {
    res.status(400).render("error", { error: error });
  }
});

// Get rid of a user review
router.route("/removeReview/:reviewId").get(async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    console.log(reviewId);
    const removeReview = await reviewValidations.removeReview(reviewId);

    return res.redirect("/users/userReviews");
  } catch (error) {
    return res.status(400).render("error", { error: error });
  }
});

router
  .route("/editReview/:reviewId")
  .get(async (req, res) => {
    const reviewId = req.params.reviewId;
    return res.render("users/editReview", { reviewId: reviewId });
  })
  .put(async (req, res) => {
    let reviewData = req.body;
    const reviewId = req.params.reviewId;
    const updatedFields = {};

    try {
      // Make sure the req.body is not empty -- checking if it's either undefined or if there isn't at least one key
      if (!reviewData || Object.keys(reviewData).length === 0) {
        throw "There are no fields in the request body.";
      }

      if (reviewData.reviewInput) {
        updatedFields.reviewComment = reviewData.reviewInput;
      }

      if (reviewData.ratingInput) {
        updatedFields.reviewRating = reviewData.ratingInput;
        updatedFields.reviewRating = validation.checkRating(
          updatedFields.reviewRating
        );
      }

      if (!reviewData.reviewInput || !reviewData.ratingInput) {
        throw "Please provide input for both.";
      }
    } catch (error) {
      return res.status(400).render("users/editReview", {
        error: error,
      });
    }

    try {
      let updateReview = await reviewValidations.updateReview(
        reviewId,
        updatedFields.reviewRating,
        updatedFields.reviewComment
      );
      return res.redirect("/users/userReviews");
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .render("error", { error: "Something went wrong." });
    }
  });

router
  .route("/deleteUser")
  .get(async (req, res) => {
    return res.render("users/deleteUser");
  })
  .delete(async (req, res) => {
    const userId = req.session.user.userId;

    try {
      if (!userId) {
        throw "No user ID exists.";
      }

      const deleteUser = await userValidations.deleteuser(userId);
      req.session.destroy();
      return res.redirect("/");
    } catch (error) {
      res.status(400).render("error", { error: error });
    }
  });

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  return res.render("users/logout");
});

export default router;
