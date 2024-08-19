import daycareFun from "../data/daycares.js";
import userUtils from "../data/users.js";
import reviewUtils from "../data/reviews.js";
import xss from 'xss';
import {
  checkPassword,
  checkNumber,
  checkWebsite,
  checkPhone,
  checkEmail,
  checkZipcode,
  isString,
  isValidWebsite,
  isValidPassword,
  checkState,
  checkBusinessHour,
  checkBoolean,
  hasSpecialCharacters,
  checkRange
} from "../helpers.js";
import express from "express";
import { authMiddleware, passwordMatch } from "../auth/auth.js";
import calculator from "../data/costCalculator.js";

const router = express.Router();

router.route("/").get(async (req, res) => {
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
    let emailAddress = xss(req.body.emailAddress);
    let password = xss(req.body.password);

    try {
      if (!emailAddress || !password) {
        return res.status(500).render("daycares/login", {
          error: "Email and password are required",
        });
      }

      checkEmail(emailAddress);
      checkPassword(password, 'Password');

      const user = await daycareFun.loginDaycare(
        emailAddress,
        password
      );

      req.session.daycare = {
        _id: user._id,
        name: user.name,
        emailAddress: user.contactInfo.email,
        role: user.role,
      };

      res.render("daycares/welcome", { daycare: user });
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
        .status(500)
        .render("error", { error: "There are no fields in the request body" });
    }

    try {
      let {
        name,
        password,
        confirmPassword,
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
      } = {
        name: xss(req.body.name),
        password: xss(req.body.password),
        confirmPassword: xss(req.body.confirmPassword),
        introduction: xss(req.body.introduction),
        address: xss(req.body.address),
        town: xss(req.body.town),
        state: xss(req.body.state),
        zipcode: xss(req.body.zipcode),
        businessHours: xss(req.body.businessHours),
        email: xss(req.body.email),
        phone: xss(req.body.phone),
        website: xss(req.body.website),
        yearsInBusiness: xss(req.body.yearsInBusiness),
        availability: xss(req.body.availability),
        lunchChoices: xss(req.body.lunchChoices),
        duration: xss(req.body.duration),
        tuitionRange: xss(req.body.tuitionRange)
    };

      if (!name || !password || !confirmPassword || !introduction || !address || !town || !state || !zipcode || !businessHours || !email || !phone) {
        return res.status(400).render("daycares/addDayCare", { error: 'All fields are required' });
      }

      name = isString(name, 'Name');
      introduction = isString(introduction, 'Introduction');
      address = isString(address, 'Address');
      town = isString(town, 'Town');
      state = checkState(state);
      zipcode = checkZipcode(zipcode);
      businessHours = checkBusinessHour(businessHours);
      email = checkEmail(email);
      phone = checkPhone(phone);

      if (website) {
        isValidWebsite(website);
      } else {
        website = null;
      }
      
      if (yearsInBusiness) {
        yearsInBusiness = checkNumber(yearsInBusiness,"years in business");
      } else {
        yearsInBusiness = null;
      }
  
      if (availability) {
        availability = checkBoolean(availability,"availability");
      } else {
        availability = null;
      }
  
      if (lunchChoices) {
        lunchChoices = lunchChoices;
      } else {
        lunchChoices = null;
      }

      if (duration) {
        duration = duration;
      } else {
        duration = null;
      }
  
      if (tuitionRange) {
        tuitionRange = checkRange(tuitionRange);
      } else {
        tuitionRange = null;
      }

      if (password !== confirmPassword) {
        return res.status(400).render("daycares/addDayCare", { error: 'Passwords do not match' });
      }

      let newDaycare = await daycareFun.addDaycare(
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
      return res.status(500).json({ error: "An error occurred while adding the daycare" });
    }
  });

router.get("/dayCareList", async (req, res) => {
  if (!req.session.user) {
    try {
      const dayCares = await daycareFun.getAll();
      return res.render("daycares/daycareListGeneric", { dayCares });
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }
  }
  try {
    const userId = req.session.user["userId"];
    const userInfo = await userUtils.getUserById(userId);
    const userFavDaycares = userInfo["favorites"];
    const dayCares = await daycareFun.getAll();

    for (let daycare of dayCares) {
      const daycareId = daycare["_id"];
      for (let userFav of userFavDaycares) {
        const userFavId = userFav.toString();
        if (userFavId === daycareId) {
          daycare["isUserFav"] = true;
          break;
        } else {
          daycare["isUserFav"] = false;
        }
      }
    }
    return res.render("daycares/dayCareList", { dayCares });
  } catch (e) {
    return res.status(500).render("error", { error: e });
  }
});

router.get("/welcome", (req, res) => {
  return res.render("daycares/welcome", { name: req.session.daycare.name });
});

router.route("/error").get(async (req, res) => {
  return res.status(400).render("daycares/error", { error: "Error!" });
});

router.route("/logout").get(async (req, res) => {
  res.clearCookie("AuthCookie");
  req.session.destroy();
  return res.render("daycares/logout", { title: "Logout" });
});

router.route("/delete").get(async (req, res) => {
  if (!req.session.daycare || !req.session.daycare._id) {
    return res.status(500).render("error", {
      error: "You must be logged in to delete your daycare.",
    });
  }

  try {
    return res.render("daycares/delete", { id: req.session.daycare._id });
  } catch (e) {
    return res.status(500).render("daycares/error", { error: e });
  }
})
.post(authMiddleware, async (req, res) => {
  if (!req.session.daycare || !req.session.daycare._id) {
    return res.status(500).render("error", {
      error: "You must be logged in to delete your daycare.",
    });
  }
  const daycareId = req.session.daycare._id;
  try {
    await daycareFun.removeDaycare(daycareId);
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render("error", {
          err: "Failed to log out after deleting daycare",
        });
      }
      return res.redirect("/");
    });
  } catch (error) {
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

//update the daycare
router
  .route("/update")
  .get(async (req, res) => {
    if (!req.session.daycare || !req.session.daycare._id) {
      return res.status(403).render("daycares/error", {
        error: "Log in to update your daycare.",
      });
    }

    try {
      const daycare = await daycareFun.getOrg(req.session.daycare._id);
      res.render("daycares/updateDaycare", { daycare: daycare });
    } catch {
      res.status(500).render("daycares/error", { error: e });
    }
  })
  .put(async (req, res) => {
    const daycareData = req.body;
    if (!daycareData || Object.keys(daycareData).length === 0) {
      return res.redirect("/welcome");
    }

    try {
      const name = isString(daycareData.name, "Name");
      const introduction = isString(daycareData.introduction, "Introduction");
      const address = isString(daycareData.address, "Address");
      const town = isString(daycareData.town, "Town");
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
        availability = checkBoolean(daycareData.availability, "availability");
      } else {
        availability = null;
      }

      if (daycareData.lunchChoices) {
        lunchChoices = daycareData.lunchChoices;
      } else {
        lunchChoices = null;
      }

      if (daycareData.duration) {
        duration = daycareData.duration;
      } else {
        duration = null;
      }

      if (daycareData.tuitionRange) {
        tuitionRange = checkRange(daycareData.tuitionRange);
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
        duration,
      };

      const result = await daycareFun.updateDaycare(
        req.session.daycare._id,
        newDaycare
      );
      res.render("daycares/welcome", { daycare: result });
    } catch (e) {
      res.status(400).render("daycares/error", { error: e.message });
    }
  });

//Update the availability
router
  .route("/availability")
  .get(async (req, res) => {
    if (!req.session.daycare || !req.session.daycare._id) {
      return res.status(403).render("daycares/error", {
        error: "Log in to update your daycare.",
      });
    }
    try {
      const daycare = await daycareFun.getOrg(req.session.daycare._id);
      res.render("daycares/availability", {daycare: daycare});
    } catch (e) {
      res.status(500).render("daycares/error", { error: e });
    }
  })
  .patch(async (req, res) => {
    try {
      let availability = req.body.availability;
      availability = checkBoolean(availability, "Availability");
      const updated = await daycareFun.updateAvailability(
        req.session.daycare._id,
        availability
      );
      res.render("daycares/welcome", { daycare: updated }); //back to welcome page to show updated daycare
    } catch (e) {
      res.status(400).render("daycares/error", { error: e.message });
    }
  });

//Update the password:
router
  .route("/password")
  .get(async (req, res) => {
    if (!req.session.daycare || !req.session.daycare._id) {
      return res.status(403).render("daycares/error", {
        error: "Log in to update your daycare.",
      });
    }
    try {
      res.render("daycares/password");
    } catch (e) {
      res.status(500).render("daycares/error", { error: e });
    }
  })
  .patch(passwordMatch, async (req, res) => {
    try {
      let { newpassword } = req.body;
      newpassword = checkPassword(newpassword, 'Password');
      const updatedDaycare = await daycareFun.updatePassword(
        req.session.daycare._id,
        newpassword
      );
      res.render("daycares/welcome", { daycare: updatedDaycare });
    } catch (e) {
      res.status(500).render("daycares/password", { error: e });
    }
  });

router
  .route("/state")
  .get(async (req, res) => {
    try {
      res.render("daycares/list");
    } catch (e) {
      res.status(500).render("error", { error: e });
    }
  })
  .post(async (req, res) => {
    try {
      let state = xss(req.body.state);
      if (!state) {
        throw 'Provide state parameter';
      }
      state = checkState(state);
      const daycares = await daycareFun.getState(state);
      res.render('daycares/list', { state: state, daycares });
    } catch (e) {
      res.status(500).render('daycares/error', { error: e.message });
    }
  });
  

router.route("/daycareListFiltered").post(async (req, res) => {
  const userInput = req.body["user_input"];

  if (hasSpecialCharacters(userInput)) {
    return res.status(400).render("daycares/error", {
      error: "Search characters must only contain alphanumeric values!",
    });
  }

  if (userInput.trim().length === 0) {
    return res
      .status(400)
      .render("daycares/error", { error: "Cannot search on empty strings." });
  }
  try {
    let filteredDaycareList = [];
    const dayCares = await daycareFun.getAll();
    const searchField = req.body["select_options"];

    console.log(dayCares);
    if (searchField === "daycare_name") {
      // do daycare name search
      for (const daycare of dayCares) {
        let daycareName = daycare["name"].toLowerCase();
        if (daycareName.includes(userInput.toLowerCase())) {
          console.log("found a name match !");
          filteredDaycareList.push(daycare);
        }
      }
    } else if (searchField === "food_preference") {
      for (const daycare of dayCares) {
        let lunchChoices = daycare["lunchChoices"];
        for (const _choiceArr of lunchChoices) {
          for (const _choice of _choiceArr) {
            console.log(_choice);
            if (
              _choice
                .trim()
                .toLowerCase()
                .includes(userInput.trim().toLowerCase())
            ) {
              filteredDaycareList.push(daycare);
              break;
            }
          }
        }
      }
    } else if (searchField === "availability") {
      for (const daycare of dayCares) {
        let daycareAvailability = daycare["availability"].toLowerCase();
        if (daycareAvailability.includes(userInput.toLowerCase())) {
          filteredDaycareList.push(daycare);
        }
      }
    } else if (searchField === "duration") {
      for (const daycare of dayCares) {
        let daycareDuration = daycare["duration"];
        for (const avail of daycareDuration) {
          if (
            avail.trim().toLowerCase().includes(userInput.trim().toLowerCase())
          ) {
            filteredDaycareList.push(daycare);
            break;
          }
        }
      }
    } else if (searchField === "rating") {
      if (!/^\d+$/.test(userInput)) {
        return res
          .status(500)
          .render("error", { error: "input for rating must be an int." });
      }
      for (const daycare of dayCares) {
        let daycareRating = daycare["rating"];
        let daycareRatingNum = Number(userInput);
        if (daycareRating >= daycareRatingNum) {
          filteredDaycareList.push(daycare);
        }
      }
    }
    if (req.session.user) {
      const userId = req.session.user["userId"];
      const userInfo = await userUtils.getUserById(userId);
      const userFavDaycares = userInfo["favorites"];

      for (let daycare of filteredDaycareList) {
        const daycareId = daycare["_id"];
        for (let userFav of userFavDaycares) {
          const userFavId = userFav.toString();
          if (userFavId === daycareId) {
            daycare["isUserFav"] = true;
            break;
          } else {
            daycare["isUserFav"] = false;
          }
        }
      }
      return res.render("daycares/daycareList", {
        dayCares: filteredDaycareList,
      });
    } else {
      return res.render("daycares/daycareListGeneric", {
        dayCares: filteredDaycareList,
      });
    }
  } catch (e) {
    return res.status(500).render("error", { error: e });
  }
});

router
  .route("/calculator")
  .get(async (req, res) => {
    try {
      res.render("daycares/costCalculator");
    } catch (e) {
      res.status(500).render("error", { error: e });
    }
})
.post(async (req, res) => {
  try {
    let state = xss(req.body.state);
    let duration = xss(req.body.duration);
    let includeLunch = xss(req.body.includeLunch);
    let id = xss(req.body.id);
    if (!state) {
      throw 'Provide state input';
    }
    state = checkState(state);
    if (state && !id) {
      const daycares = await daycareFun.getState(state);
      if (!daycares || daycares.length === 0) {
        return res.status(500).render("error", { error: "No daycare for given state" });
      }
      res.render("daycares/costCalculator", { daycares, state });
      return;
    }
    const result = await calculator.calculateCost(state, duration, includeLunch, id);
    res.render("daycares/costCalculator", { result });
} catch (e) {
    res.status(500).render("error", { error: "Not able to calculate cost" });
}
});


router.route("/compare")
  .get(async (req, res) => {
    try {
      const daycares = await daycareFun.getAll(); 
      res.render("daycares/compare", { daycares });
    } catch (e) {
      res.status(500).render("error", { error: "Error try again" });
    }
})
.post(async (req, res) => {
  try {
      let name1 = xss(req.body.name1);
      let name2 = xss(req.body.name2);
      if (!name1 || !name2) {
          throw 'Provide names for daycare.';
      }
      name1 = isString(name1);
      name2 = isString(name2);
      const daycares = await daycareFun.getAll(); 
      let daycare1 = daycares.find(daycare => daycare.name === name1);
      let daycare2 = daycares.find(daycare => daycare.name === name2);
      if (!daycare1 || !daycare2) {
          throw 'Daycares could not be found.';
      }
      res.render("daycares/compareResults", { daycare1, daycare2 });
  } catch (e) {
      res.status(500).render("error", { error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const daycareId = req.params.id;

    if (!daycareId) {
      return res
        .status(400)
        .render("error", { error: "Invalid daycare ID." });
    }

    const daycare = await daycareFun.getOrg(daycareId);

    if (!daycare) {
      return res
        .status(404)
        .render("daycares/error", { error: "Daycare not found." });
    }

    res.render("daycares/details", { daycare });
  } catch (e) {
    console.error("Error fetching daycare details:", e);
    res
      .status(500)
      .render("daycares/error", { error: "Failed to load daycare details." });
  }
});

export default router;
