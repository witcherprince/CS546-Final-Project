import { getAll, addDayCare, getOrg } from '../data/daycares.js';
import { isProperId, isValidString, isValidObject, isValidBoolean, isValidNumber, isValidArray } from "../helpers.js";
import express from 'express';

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    try {
      res.render('daycares/home'); 
    } catch (e) {
      res.status(500).render('error', { error: e });
    }
  })

  router.get('/new', (req, res) => {
    res.render('daycares/newDayCare');
  })
  .post(async (req, res) => {
    const dayCarePostData = req.body;
    if (!dayCarePostData || Object.keys(dayCarePostData).length === 0) {
      return res.status(400).render('error', { error: 'There are no fields in the request body' });
    }

    try {
      isValidString(dayCarePostData.name);
      isValidString(dayCarePostData.introduction);
      isValidObject(dayCarePostData.location);
      isValidString(dayCarePostData.businessHours);
      isValidObject(dayCarePostData.contactInfo);
      isValidNumber(dayCarePostData.yearsInBusiness);
      isValidNumber(dayCarePostData.ranking);
      isValidBoolean(dayCarePostData.availability);
      isValidArray(dayCarePostData.lunchOptions);
      isValidArray(dayCarePostData.duration);
      isValidNumber(dayCarePostData.tuitionRange);
    } catch (e) {
      return res.status(400).render('error', { error: e });
    }

    try {
      await addDayCare(
        dayCarePostData.name,
        dayCarePostData.location,
        dayCarePostData.businessHours,
        dayCarePostData.contactInfo,
        dayCarePostData.yearsInBusiness,
        dayCarePostData.ranking,
        dayCarePostData.availability,
        dayCarePostData.lunchOptions,
        dayCarePostData.description,
        dayCarePostData.duration,
        dayCarePostData.parentReview,
        dayCarePostData.tuitionRange
      );
      res.redirect('/daycares/new');
    } catch (e) {
      res.status(500).render('error', { error: e });
    }
  });

router.get('/dayCareList', async (req, res) => {
    try {
      console.log('Fetching all daycares...');
      const dayCares = await getAll();
      console.log('Daycares fetched:', dayCares);
      res.render('daycares/dayCareList', { dayCares });
    } catch (e) {
      res.status(500).render('error', { error: e });
    }
});

router
  .route('/daycares/:name')
  .get(async (req, res) => {
    const { name } = req.params; 
    try {
      let validName = isValidString(name);  
      validName = validName.trim();
      const dayCare = await getOrg(validName);

      if (!dayCare) {
        return res.status(404).render('error', { error: 'Daycare not found' });
      }

      res.render('dayCareDetail', { dayCare });
    } catch (e) {
      return res.status(400).render('error', { error: e.message });
    }
  })
  .delete(async (req, res) => {
    try {
      req.params.id = isProperId(req.params.id);
    } catch (e) {
      return res.status(400).render('error', { error: e.message });
    }

    try {
      await dayCareData.remove(req.params.id);
      res.redirect('/daycares');
    } catch (e) {
      res.status(500).render('error', { error: e });
    }  
  });

export default router;
