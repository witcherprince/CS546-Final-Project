import daycareFun from "../data/daycares.js";
import reviewUtils from "../data/reviews.js";
import userUtils from "../data/users.js";
import {
  isProperId,
  isValidString,
  isValidNumber,
  isValidArray,
  checkState,
  isValidZip,
  isValidEmail,
  isValidPhone,
  isValidWebsite,
  checkBusinessHour,
  checkBoolean,
  isValidPassword,
} from "../helpers.js";
import express from "express";

const router = express.Router();

//just for daycare role (update daycare, update available, update password)

router.route("/").get(async (req, res) => {
  try {
    return res.render("daycares/home");
  } catch (e) {
    return res.status(500).render("error", { error: e });
  }
});

router
  .route("/login")
  .get(async (req, res) => {
    try {
      return res.render("daycares/login");
    } catch (e) {
      return res.status(500).render("daycares/error", { error: e });
    }
  })
  .post(async (req, res) => {
    const loginInfo = req.body;
    try {
      if (!loginInfo.emailAddress || !loginInfo.password) {
        return res.status(400).render("daycares/login", {
          error: "Email and password are required",
        });
      }

      isValidEmail(loginInfo.emailAddress);
      isValidPassword(loginInfo.password);

      const user = await daycareFun.loginDaycare(
        loginInfo.emailAddress,
        loginInfo.password
      );

      req.session.daycare = {
        _id: user._id,
        name: user.name,
        emailAddress: user.contactInfo.email,
        role: user.role,
      };

      return res.render("daycares/welcome", { name: user.name });
    } catch (error) {
      console.error("Error during login:", error);
      return res
        .status(500)
        .render("daycares/login", { error: "Invalid email or password" });
    }
  });

router
  .route("/addDaycare")
  .get(async (req, res) => {
    return res.render("daycares/addDayCare");
  })
  .post(async (req, res) => {
    const dayCarePostData = req.body;
    if (!dayCarePostData || Object.keys(dayCarePostData).length === 0) {
      return res
        .status(400)
        .render("error", { error: "There are no fields in the request body" });
    }

    try {
      const {
        name,
        password,
        introduction,
        address,
        town,
        state,
        zipcode,
        businessHours,
        email,
        phone,
        website,
        yearsInBusiness,
        availability,
        lunchChoices,
        duration,
        tuitionRange,
      } = req.body;

      const newDaycare = await daycareFun.addDaycare(
        name,
        password,
        introduction,
        address,
        town,
        state,
        zipcode,
        businessHours,
        email,
        phone,
        website,
        yearsInBusiness,
        availability,
        lunchChoices,
        duration,
        tuitionRange
      );

      return res.redirect("/daycares/welcome");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while adding the daycare" });
    }
  });

router.get("/dayCareList", async (req, res) => {
  try {
    const dayCares = await daycareFun.getAll();
    return res.render("daycares/dayCareList", { dayCares });
  } catch (e) {
    return res.status(500).render("error", { error: e });
  }
});

router.get("/welcome", (req, res) => {
  return res.render("daycares/welcome", { name: req.session.daycare.name });
});

router.route("/error").get(async (req, res) => {
  return res.status(400).render("daycares/error", { errorMessage: "Error!" });
});

router.route("/logout").get(async (req, res) => {
  res.clearCookie("AuthCookie");
  req.session.destroy();
  return res.render("daycares/logout", { title: "Logout" });
});

router.get("/delete", async (req, res) => {
  if (!req.session.daycare || !req.session.daycare._id) {
    return res.status(403).render("daycares/error", {
      error: "You must be logged in to delete your daycare.",
    });
  }

  try {
    return res.render("daycares/delete", { id: req.session.daycare._id });
  } catch (e) {
    return res.status(500).render("daycares/error", { error: e });
  }
});

router.post("/delete", async (req, res) => {
  if (!req.session.daycare || !req.session.daycare._id) {
    return res.status(403).render("daycares/error", {
      error: "You must be logged in to delete your daycare.",
    });
  }

  const daycareId = req.session.daycare._id;

  try {
    await daycareFun.removeDaycare(daycareId);
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render("daycares/error", {
          error: "Failed to log out after deleting daycare",
        });
      }
      return res.redirect("/");
    });
  } catch (error) {
    console.error("Error deleting daycare:", error);
    return res.status(500).render("daycares/delete", {
      error: "Could not delete daycare.",
      id: daycareId,
    });
  }
});

router.route("/daycareReviews/:id").get(async (req, res) => {
  const daycareId = req.params["id"];
  const daycareInfo = await daycareFun.getOrg(daycareId);
  const daycareName = daycareInfo["name"];
  const daycareReviews = daycareInfo["reviews"];
  const reviewsList = [];

  for (const reviewId of daycareReviews) {
    const fullReview = await reviewUtils.getReviewById(reviewId);
    reviewsList.push(fullReview);
  }
  return res.render("daycares/daycareReviews", {
    daycareId: daycareId,
    daycareName: daycareName,
    daycareReviews: reviewsList,
  });
});


router
  .route("/addDaycareReview/:id")
  .get(async (req, res) => {
    try {
      const daycareId = req.params["id"];
      const daycareInfo = await daycareFun.getOrg(daycareId);
      const daycareName = daycareInfo["name"];
      const daycareReviews = daycareInfo["reviews"];
      const currentUserId = req.session.user["userId"];
      const reviewsList = [];

      for (const reviewId of daycareReviews) {
        const fullReview = await reviewUtils.getReviewById(reviewId);
        const userThatReviewedId = fullReview["userId"].toString();
        if (userThatReviewedId === currentUserId) {
          return res.status(400).render("daycares/addDaycareReviewError", {
            reviewError: "You have already left a review for this daycare.",
            daycareId: daycareId,
          });
        }
        reviewsList.push(fullReview);
      }
      return res.render("daycares/addDaycareReview", {
        daycareId: daycareId,
        daycareName: daycareName,
      });
    } catch (error) {
      return res
        .status(400)
        .render("daycares/addDaycareReviewError", { reviewError: error });
    }
  })
  .post(async (req, res) => {
    const reviewMappings = {
      one_star: 1,
      two_star: 2,
      three_star: 3,
      four_star: 4,
      five_star: 5,
    };
    const daycareId = req.params["id"];
    const userId = req.session.user["userId"];
    const reviewStars = req.body["star"];
    const reviewComment = req.body["review_comment"];
    const reviewStarsToInt = reviewMappings[reviewStars];

    try {
      const postReview = await reviewUtils.addReview(
        daycareId,
        userId,
        reviewStarsToInt,
        reviewComment
      );
      return res.redirect(`/daycares/daycareReviews/${daycareId}`);
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
  });

router
  .route("/updateDaycareReview/:id")
  .get(async (req, res) => {
    try {
      const daycareId = req.params["id"];
      const daycareInfo = await daycareFun.getOrg(daycareId);
      const daycareName = daycareInfo["name"];
      const daycareReviews = daycareInfo["reviews"];
      const currentUserId = req.session.user["userId"];
      let foundExistingReview = false;

      for (const reviewId of daycareReviews) {
        const fullReview = await reviewUtils.getReviewById(reviewId);
        const userThatReviewedId = fullReview["userId"].toString();
        if (userThatReviewedId === currentUserId) {
          foundExistingReview = true;
          break;
        }
      }

      if (!foundExistingReview) {
        return res.status(400).render("daycares/updateDaycareReviewError", {
          reviewError: "You have already left a review for this daycare.",
        });
      }
      return res.render("daycares/updateDaycareReview", {
        daycareId: daycareId,
        daycareName: daycareName,
      });
    } catch (error) {
      return res
        .status(400)
        .render("daycares/addDaycareReviewError", { reviewError: error });
    }
  })
  .post(async (req, res) => {
    const reviewMappings = {
      one_star: 1,
      two_star: 2,
      three_star: 3,
      four_star: 4,
      five_star: 5,
    };
    const daycareId = req.params["id"];
    const daycareInfo = await daycareFun.getOrg(daycareId);
    const currentUserId = req.session.user["userId"];
    const daycareReviews = daycareInfo["reviews"];
    const reviewStars = req.body["star"];
    const reviewComment = req.body["review_comment"];
    const reviewStarsToInt = reviewMappings[reviewStars];

    // need to get the existing review Id from user
    try {
      let reviewIdToUpdate = null;
      for (const reviewId of daycareReviews) {
        const fullReview = await reviewUtils.getReviewById(reviewId);
        const userThatReviewedId = fullReview["userId"].toString();
        if (userThatReviewedId === currentUserId) {
          reviewIdToUpdate = reviewId;
          break;
        }
      }

      if (!reviewIdToUpdate) {
        return res.status(400).render("daycares/updateDaycareReviewError", {
          reviewError: "No existing review found for this daycare.",
        });
      }

      //reviewId, rating, review
      const updatedReview = await reviewUtils.updateReview(
        reviewIdToUpdate,
        reviewStarsToInt,
        reviewComment
      );
      console.log("review has been successfully updated to:}");
      console.log(updatedReview);
      return res.redirect(`/daycares/daycareReviews/${daycareId}`);
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
  });

router.route("/state")
  .get(async (req, res) => { 
    try {
      res.render("daycares/list");
    } catch (e) {
      res.status(500).render("error", { error: e });
    }
})
.post(async (req, res) => {
  try {
    let state = req.body.state;

    if (!state) {
      throw new Error('Provide state parameter');
    }

    state = checkState(state);

    const daycares = await daycareFun.getState(state);

    res.render('daycares/list', { state: state, daycares });
  } catch (e) {
    res.status(400).render('daycares/error', { error: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const daycareId = req.params.id;

    if (!daycareId) {
      return res.status(400).render('daycares/error', { error: 'Invalid daycare ID.' });
    }

    const daycare = await daycareFun.getOrg(daycareId);

    if (!daycare) {
      return res.status(404).render('daycares/error', { error: 'Daycare not found.' });
    }

    res.render('daycares/details', { daycare });
  } catch (e) {
    console.error('Error fetching daycare details:', e);
    res.status(500).render('daycares/error', { error: 'Failed to load daycare details.' });
  }
});


export default router;
