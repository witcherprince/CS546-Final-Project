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
import authMiddleware from '../auth/auth.js';

const router = express.Router();

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

router.route('/login')
  .get(async (req, res) => { 
    try {
      res.render('daycares/login'); 
    } catch (e) {
      res.status(500).render('daycares/error', { error: e });
    }
  })
  .post(async (req, res) => {
    let loginInfo = req.body;

    try {
      if (!loginInfo.emailAddress || !loginInfo.password) {
        return res.status(400).render('daycares/login', { error: 'Email and password are required' });
      }

      isValidEmail(loginInfo.emailAddress);
      isValidPassword(loginInfo.password);

      const user = await daycareFun.loginDaycare(loginInfo.emailAddress, loginInfo.password);

      req.session.daycare = {
        _id: user._id,
        name: user.name,
        emailAddress: user.contactInfo.email,
        role: user.role
      };

      res.render('daycares/welcome', { name: user.name });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).render('daycares/login', { error: 'Invalid email or password' });
    }
  });

router.route('/addDaycare')
  .get(async (req, res) => {
    res.render('daycares/addDayCare');
  })
  .post(async (req, res) => {
    const dayCarePostData = req.body;
    if (!dayCarePostData || Object.keys(dayCarePostData).length === 0) {
      return res.status(400).render("error", { error: "There are no fields in the request body" });
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
        tuitionRange
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
  
      res.redirect('/daycares/welcome');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while adding the daycare' });
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

router.get('/welcome', authMiddleware, (req, res) => {
  res.render('daycares/welcome', { name: req.session.daycare.name }); 
});

router.route('/error').get(async (req, res) => {
  res.status(400).render('daycares/error', { errorMessage: 'Error!',});
});

router.route('/logout').get(async (req, res) => {
  res.clearCookie("AuthCookie");
  req.session.destroy();
  res.render('daycares/logout', { title: "Logout" });
});

router.get('/delete', async (req, res) => {
  if (!req.session.daycare || !req.session.daycare._id) {
    return res.status(403).render('daycares/error', { error: 'You must be logged in to delete your daycare.' });
  }

  try {
    res.render('daycares/delete', { id: req.session.daycare._id });
  } catch (e) {
    res.status(500).render('daycares/error', { error: e });
  }
});

router.post('/delete', authMiddleware, async (req, res) => {
  if (!req.session.daycare || !req.session.daycare._id) {
    return res.status(403).render('daycares/error', { error: 'You must be logged in to delete your daycare.' });
  }

  const daycareId = req.session.daycare._id;

  try {
    await daycareFun.removeDaycare(daycareId);
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render('daycares/error', { error: 'Failed to log out after deleting daycare' });
      }
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error deleting daycare:', error);
    res.status(500).render('daycares/delete', { error: 'Could not delete daycare.', id: daycareId });
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
