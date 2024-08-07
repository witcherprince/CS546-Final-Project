import daycareFun from "../data/daycares.js";
import helpers from '../helpers.js';
import express from "express";

const router = express.Router();

router.route('/').get(async (req, res) => {
  
  let timeStamp = new Date().toUTCString();
  let reqMethod = req.method;
  let reqRoute = req.originalUrl;
  
  let userAuthenticated;

  if (req.session.user) {
    userAuthenticated = 'Authenticated User';
  } else {
    userAuthenticated = 'Non-Authenticated User';
  }

  console.log(`[${timeStamp}]: ${reqMethod} ${reqRoute} (${userAuthenticated})`);

  if (req.session.user) {
    return res.redirect('daycareLogin');
  } else {
    return res.redirect('daycareLogin');
  }
});

router
  .route('/addDaycare')
  .get(async (req, res) => {
    
    if (req.session.user) {
      res.render('register');
    } else {
      res.status(500).render('register', { error: 'Internal Server Error. User could not be registered.' });
    }
  })
  .post(async (req, res) => {
    
    let userInfo = req.body;

    if (!userInfo.firstName || !userInfo.lastName || !userInfo.emailAddress || !userInfo.password || !userInfo.role) {
      return res.status(400).render('register', { error: 'All fields are required' });
    }

    try {
      isValidString(userInfo.firstName);
      isValidString(userInfo.lastName);
      isValidEmail(userInfo.emailAddress);
      isValidPassword(userInfo.password);
      isValidRole(userInfo.role);

      if (userInfo.password !== userInfo.confirmPassword) {
        return res.status(400).render('register', { error: 'Passwords do not match' });
      }

      const user = await registerUser(userInfo.firstName, userInfo.lastName, userInfo.emailAddress, userInfo.password, userInfo.role);

      if (user.insertedUser) {
        res.redirect('/login');
      } else {
        res.status(500).render('register', { error: 'Internal Server Error. User could not be registered.' });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).render('register', { error: 'Internal Server Error. Please try again later.' });
    }
  });

router
  .route('/login')
  .get(async (req, res) => {
    //code here for GET
    if (req.session && req.session.user) {
      return res.redirect(req.session.user.role === 'admin' ? '/admin' : '/protected');
    }
    
    res.render('login', { error: 'Invalid email or password.'});
  })
  .post(async (req, res) => {
    //code here for POST
    let loginInfo = req.body;

    try {
      if (!loginInfo.emailAddress || !loginInfo.password) {
        return res.status(400).render('login', { error: 'Email and password are required' });
      }

      isValidEmail(loginInfo.emailAddress);
      isValidPassword(loginInfo.password);

      const user = await loginUser(loginInfo.emailAddress, loginInfo.password);

      req.session.user = {
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        role: user.role
      };

      res.redirect('/');
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).render('login', { error: 'Invalid email or password' });
    }
  });

router.route('/protected').get(async (req, res) => {
  //code here for GET
  const { firstName, lastName, role } = req.session.user;
  const currentTime = new Date().toLocaleString();
  
  try {
    res.render('protected', {
      firstName,
      lastName,
      currentTime,
      role,
      isAdmin: role === 'admin',
    })
  } catch (e) {
    res.status(400);
  }
});

router.route('/admin').get(async (req, res) => {
  //code here for GET
  const { firstName, lastName } = req.session.user;
  const currentTime = new Date().toLocaleString();

  res.render('admin', {
    firstName,
    lastName,
    currentTime
  });
});

router.route('/error').get(async (req, res) => {
  //code here for GET
  res.status(400).render('error', {
    errorMessage: 'Error!',
  });

});

router.route('/logout').get(async (req, res) => {
  //code here for GET
  res.clearCookie("AuthCookie");
  req.session.destroy();
  res.render('logout', { title: "Logout" })
});

















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
    console.log("Request Body:", req.body);
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
      dayCarePostData.website = dayCarePostData.website ? isValidWebsite(dayCarePostData.website) : null;
      dayCarePostData.yearsInBusiness = dayCarePostData.yearsInBusiness ? isValidNumber(dayCarePostData.yearsInBusiness) : null;
      dayCarePostData.availability = dayCarePostData.availability ? checkBoolean(dayCarePostData.availability, "availability") : null;
      dayCarePostData.lunchOptions = dayCarePostData.lunchOptions ? isValidArray(dayCarePostData.lunchOptions) : null;
      dayCarePostData.duration = dayCarePostData.duration ? isValidArray(dayCarePostData.duration) : null;
      dayCarePostData.tuitionRange = dayCarePostData.tuitionRange ? isValidString(dayCarePostData.tuitionRange) : null;
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
    console.log("Fetching all daycares...");
    const dayCares = await daycareFun.getAll();
    console.log("Daycares fetched:", dayCares);
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

export default router;
