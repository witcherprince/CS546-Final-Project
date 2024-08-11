import daycareFun from "../data/daycares.js";
import { checkPassword, checkNumber, checkWebsite, checkPhone, checkEmail, checkZipcode, isString, isValidString, isValidArray, isProperId, isValidWebsite, isValidBoolean, isValidDate, isValidObject, isValidNumber, isValidZip, isValidPhone, isValidEmail, isValidPassword, checkState, checkBusinessHour, checkBoolean} from '../helpers.js';
import express from "express";
import {authMiddleware, passwordMatch} from '../auth/auth.js';
import calculator from "../data/costCalculator.js";

const router = express.Router();
/*
function isAuthenticated(req, res, next) { //I don't know where to put middleware function
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
}
*/
//just for daycare role (update daycare, update available, update password, delete daycare)
// when user click a daycare, _id pass to this route and show details of clicked daycare.

router.route("/")
  .get(async (req, res) => { 
    try {
      res.render("daycares/home");
    } catch (e) {
      res.status(500).render("error", { error: e });
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
    let loginInfo = req.body;

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

      res.render('daycares/welcome', { daycare: user });

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

router.post('/delete', authMiddleware, async (req, res) => {
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

//Do we render the error to errorDaycare? so we can redirect in errorDaycare to give user the second chance
//update the daycare
router.route('/update')
  .get(async (req, res) =>{
    if (!req.session.daycare || !req.session.daycare._id) {
      return res.status(403).render('daycares/errorDaycare', { error: 'Log in to update your daycare.' });
    }
  
    try {
      const daycare = daycareFun.getOrg(req.session.daycare._id);
      res.render('daycares/updateDaycare', {daycare: daycare});      
    } catch {
      res.status(500).render('daycares/errorDaycare', { error: e });
    }
  })
  .post(async (req, res) => {
    const daycareData = req.body;
    if (!daycareData || Object.keys(daycareData).length === 0) {
      return res.redirect('/welcome'); 
    }

    try{
      const name = isString(daycareData.name, 'Name');
      const introduction = isString(daycareData.introduction, 'Introduction');
      const address = isString(daycareData.address, 'Address');
      const town = isString(daycareData.town, 'Town');
      const state = checkState(daycareData.state);
      const zipcode = checkZipcode(daycareData.zipcode);
      const businessHours = checkBusinessHour(daycareData.businessHours);
      const email = checkEmail(daycareData.email);
      const phone = checkPhone(daycareData.phone);
      let website;
      let yearsInBusiness;
      let availability;
      let lunchChoices;
      let duration;
      let tuitionRange;

      if (daycareData.website) {
        website = checkWebsite(daycareData.website);
      } else {
        website = null;
      }
  
      if (daycareData.yearsInBusiness) {
        yearsInBusiness = checkNumber(
          daycareData.yearsInBusiness,
          "years in business"
        );
      } else {
        yearsInBusiness = null;
      }
  
      if (daycareData.availability) {
        availability = checkBoolean(
          daycareData.availability,
          "availability"
        );
      } else {
        availability = null;
      }
  
      if (daycareData.lunchChoices) {
        lunchChoices = daycareData.lunchChoices
          .split(",")

          .map((choice) => isString(choice, "lunch choice"));

      } else {
        lunchChoices = [];
      }
  
      if (daycareData.duration) {
        duration = daycareData.duration
          .split(",")
          .map((dur) => isString(dur, "duration"));
      } else {
        duration = [];
      }
  
      if (daycareData.tuitionRange) {
        tuitionRange = isString(
          daycareData.tuitionRange,
          "tuition range"
        );
      } else {
        tuitionRange = null;
      }
      
      const newDaycare = {
        name,
        introduction,
        address,
        town,
        state,
        zipcode,
        email,
        phone,
        website,
        businessHours,
        tuitionRange,
        availability,
        yearsInBusiness,
        lunchChoices,
        duration
      };
      
      const result = await daycareFun.updateDaycare(req.session.daycare._id, newDaycare);
      res.render('daycares/welcome', { daycare: result });

    } catch (e) {
      res.status(400).render('daycares/error', { error: e.message });
    }

  })

//Update the availability
router.route('/availability')
  .get(async (req, res) => {
    if (!req.session.daycare || !req.session.daycare._id) {
      return res.status(403).render('daycares/errorDaycare', { error: 'Log in to update your daycare.' });
    }
    try {
      res.render('daycares/availability');
    } catch (e) {
      res.status(500).render('daycares/errorDaycare', { error: e });
    }
  })

  .post(async (req, res) => {
    try {
      const availability = req.body.availability;
      availability = checkBoolean(availability, 'Availability');
      const updated = await daycareFun.updateAvailability(req.session.daycare._id, availability);
      res.render('daycares/welcome', { daycare: updated }); //back to welcome page to show updated daycare
    } catch (e) {
      res.status(400).render('daycares/errorDaycare', { error: e.message });
    }

  })

//Update the password:
router.route('/password')
  .get(async (req, res) => {
    if (!req.session.daycare || !req.session.daycare._id) {
      return res.status(403).render('daycares/errorDaycare', { error: 'Log in to update your daycare.' });
    }
    try {
      res.render('daycares/password');
    } catch (e) {
      res.status(500).render('daycares/errorDaycare', { error: e });
    }
  })
  .post(passwordMatch, async (req, res) => {
    try {
      console.log("in .patch /password");
      let { newpassword } = req.body;
      newpassword = checkPassword(newpassword);
      const updatedDaycare = await updatePassword(req.session.daycare._id, newpassword);
      res.render('daycares/welcome', { daycare: updatedDaycare });
    } catch (e) {
      res.status(500).render('daycares/password', { error: e.message });
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

router.get('/calculator', async (req, res) => { 
  try {
    res.render("daycares/costCalculator");
  } catch (e) {
    res.status(500).render("error", { error: e });
  }
});


router.post('/calculator', async (req, res) => {
  try {
    let state = req.body.state;
    let duration = req.body.duration;
    let includeLunch = req.body.includeLunch;
    let selectedDaycareId = req.body.selectedDaycareId;

    if (state && !selectedDaycareId) {
        state = checkState(state);
        const daycares = await daycareFun.getState(state);
        
        if (!daycares || daycares.length === 0) {
            throw new Error('No daycares found in this state');
        }

        res.render("daycares/costCalculator", { daycares, state });
        return;
    }

    if (!state || !duration || !includeLunch || !selectedDaycareId) {
        throw new Error('Provide all inputs');
    }

    state = checkState(state);
    const result = await calculator.calculateCost(state, duration, includeLunch, selectedDaycareId);
    
    res.render("daycares/costCalculator", { result });
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
    res.status(500).render('daycares/error', { error: 'Failed to load daycare details.' });
  }
});


export default router;
