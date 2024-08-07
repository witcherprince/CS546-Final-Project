// import { getAll, addDayCare, getOrg } from "../data/daycares.js";
import daycareFun from "../data/daycares.js";
import reviewUtils from "../data/reviews.js";
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
} from "../helpers.js";
import express from "express";

const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    res.render("daycares/home");
  } catch (e) {
    res.status(500).render("error", { error: e });
  }
});

router
  .get("/addDayCare", (req, res) => {
    res.render("daycares/addDayCare");
  })
  .post("/addDayCare", async (req, res) => {
    const dayCarePostData = req.body;
    if (!dayCarePostData || Object.keys(dayCarePostData).length === 0) {
      return res
        .status(400)
        .render("error", { error: "There are no fields in the request body" });
    }

    try {
      isValidString(dayCarePostData.name);
      isValidString(dayCarePostData.introduction);
      isValidString(dayCarePostData.address);
      isValidString(dayCarePostData.town);
      checkState(dayCarePostData.state);
      isValidZip(dayCarePostData.zipcode);
      checkBusinessHour(dayCarePostData.businessHours);
      isValidEmail(dayCarePostData.email);
      isValidPhone(dayCarePostData.phone);
      dayCarePostData.website = dayCarePostData.website
        ? isValidWebsite(dayCarePostData.website)
        : null;
      dayCarePostData.yearsInBusiness = dayCarePostData.yearsInBusiness
        ? isValidNumber(dayCarePostData.yearsInBusiness)
        : null;
      dayCarePostData.availability = dayCarePostData.availability
        ? checkBoolean(dayCarePostData.availability, "availability")
        : null;
      dayCarePostData.lunchOptions = dayCarePostData.lunchOptions
        ? isValidArray(dayCarePostData.lunchOptions)
        : null;
      dayCarePostData.duration = dayCarePostData.duration
        ? isValidArray(dayCarePostData.duration)
        : null;
      dayCarePostData.tuitionRange = dayCarePostData.tuitionRange
        ? isValidString(dayCarePostData.tuitionRange)
        : null;
    } catch (e) {
      return res.status(400).render("error", { error: e });
    }

    try {
      await daycareFun.addDaycare(
        dayCarePostData.name,
        dayCarePostData.introduction,
        dayCarePostData.address,
        dayCarePostData.town,
        dayCarePostData.state,
        dayCarePostData.zipcode,
        dayCarePostData.businessHours,
        dayCarePostData.email,
        dayCarePostData.phone,
        dayCarePostData.website,
        dayCarePostData.yearsInBusiness,
        dayCarePostData.availability,
        dayCarePostData.lunchOptions,
        dayCarePostData.duration,
        dayCarePostData.tuitionRange
      );
      res.redirect("/daycares");
    } catch (e) {
      res.status(500).render("error", { error: e });
    }
  });

router.get("/dayCareList", async (req, res) => {
  try {
    const dayCares = await daycareFun.getAll();
    res.render("daycares/dayCareList", { dayCares });
  } catch (e) {
    res.status(500).render("error", { error: e });
  }
});

router
  .route("/daycares/id")
  .get(async (req, res) => {
    const { name } = req.params;
    try {
      let validName = isValidString(id);
      validName = validName.trim();
      const dayCare = await daycareFun.getOrg(id);

      if (!dayCare) {
        return res.status(404).render("error", { error: "Daycare not found" });
      }

      res.render("dayCareDetail", { dayCare });
    } catch (e) {
      return res.status(400).render("error", { error: e.message });
    }
  })
  .delete(async (req, res) => {
    try {
      req.params.id = isProperId(req.params.id);
    } catch (e) {
      return res.status(400).render("error", { error: e.message });
    }

    try {
      await dayCareData.remove(req.params.id);
      res.redirect("/daycares");
    } catch (e) {
      res.status(500).render("error", { error: e });
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
    console.log(fullReview);
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
    const daycareId = req.params["id"];
    const daycareInfo = await daycareFun.getOrg(daycareId);
    const daycareName = daycareInfo["name"];
    console.log(daycareInfo);
    return res.render("daycares/addDaycareReview", {
      daycareId: daycareId,
      daycareName: daycareName,
    });
  })
  .post(async (req, res) => {
    const reviewMappings = {
      one_star: 1,
      two_star: 2,
      three_star: 3,
      four_star: 4,
      five_star: 5,
    };

    console.log(req.body);
    console.log(req.session);
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
      console.log(postReview);
      return res.json(
        `Review to be posted\nYou gave it ${reviewStarsToInt} stars\nComment: ${reviewComment}`
      );
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
  });

export default router;
