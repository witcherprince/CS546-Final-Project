import daycareFun from "../data/daycares.js";
import { checkPassword, checkNumber, checkWebsite, checkPhone, checkEmail, checkZipcode, isString, isValidString, isValidArray, isProperId, isValidWebsite, isValidBoolean, isValidDate, isValidObject, isValidNumber, isValidZip, isValidPhone, isValidEmail, isValidPassword, checkState, checkBusinessHour, checkBoolean} from '../helpers.js';
import express from "express";
import {authMiddleware, passwordMatch} from '../auth/auth.js';

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

      res.render('daycares/welcome', { daycare: user });
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
    } catch (e) {
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
  })
export default router;
