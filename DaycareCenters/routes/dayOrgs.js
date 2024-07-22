// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import {dayCareData} from '../data/index.js';
import { isProperId,isValidString,isValidWebsite,isValidArray,isValidBoolean,isValidDate, isValidObject } from "../helpers.js";
import express from 'express';

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    try {
      const dayCares = (await dayCareData.getAll());
      const dayCareList = dayCares.map(dayCare => ({
        _id: dayCare._id.toString(),
        dayCareName: dayCare.name
      }));
      return res.json(dayCareList);
    } catch (e) {
      return res.status(500).send(e);
    }


  })
  .post(async (req, res) => {
    //code here for POST
    const dayCarePostData = req.body;
    //make sure there is something present in the req.body
    if (!dayCarePostData || Object.keys(dayCarePostData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    //check all inputs, that should respond with a 400
    try {
      isValidString(dayCarePostData.name);
      isValidString(dayCarePostData.location);
      isValidString(dayCarePostData.businessHours);
      isValidString(dayCarePostData.contactInfo);
      isValidNumber(dayCarePostData.yearsInBusiness);
      isValidNumber(dayCarePostData.ranking);
      isValidBoolean(dayCarePostData.availability);
      isValidArray(dayCarePostData.lunchOptions);
      isValidString(dayCarePostData.description);
      isValidArray(dayCarePostData.duration);
      isValidArray(dayCarePostData.parentReview);
      isValidNumber(dayCarePostData.tuitionRange);

    } catch (e) {
      return res.status(400).json({error: e});
    }

    //insert the post
    try {
      const newDayOrg = await dayCareData.addOrg(dayCarePostData.name, dayCarePostData.location, dayCarePostData.businessHours, dayCarePostData.contactInfo, dayCarePostData.yearsInBusiness, dayCarePostData.ranking, dayCarePostData.availability, dayCarePostData.lunchOptions, dayCarePostData.description, dayCarePostData.duration, dayCarePostData.parentReview, dayCarePostData.tuitionRange);
      return res.status(200).json(newDayOrg);
    } catch (e) {
      return res.status(500).json({error: e});
    }
  });

router
  .route('/:id')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.id = isProperId(req.params.id);
    } catch (e) {
      return res.status(400).json({error: e.message});
    }
    try {
        const dayCare = (await dayCareData.getOrg(req.params.id));
        if (!dayCare) {
          return res.status(404).json({error: 'daycare not found'});
        }
        return res.status(200).json(product);
    } catch (e) {
        return res.status(500).json(e);
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    try {
      isProperId(req.params.id);
    } catch (e) {
      return res.status(400).json({error: e.message});
    }
    try {
      const deleteProduct = (await dayCareData.remove(req.params.id));
      if (!deleteProduct) {
        return res.status(404).json({error: 'daycare not found'});
      }
      return res.status(200).json({"_id": req.params.id, "deleted": true});
  } catch (e) {
      return res.status(500).json(e);
  }
  })
  .put(async (req, res) => {
    //code here for PUT
    try {
      req.params.id = isProperId(req.params.id);
    } catch (e) {
      return res.status(400).json({error: e.message});
    }

    const dayCarePutData = req.body;
    //make sure there is something present in the req.body
    if (!dayCarePutData || Object.keys(dayCarePutData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    //check all inputs, that should respond with a 400
    try {
      isValidString(dayCarePutData.name);
      isValidObject(dayCarePutData.location);
      isValidString(dayCarePutData.businessHours);
      isValidObject(dayCarePutData.contactInfo);
      isValidNumber(dayCarePutData.yearsInBusiness);
      isValidNumber(dayCarePutData.ranking);
      isValidBoolean(dayCarePutData.availability);
      isValidArray(dayCarePutData.lunchOptions);
      isValidString(dayCarePutData.description);
      isValidArray(dayCarePutData.duration);
      isValidArray(dayCarePutData.parentReview);
      isValidNumber(dayCarePutData.tuitionRange); 
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      await dayCareData.get(req.params.id);
    } catch (e) {
      res.status(404).json({ error: 'daycare not found' });
      return;
    }

    try {
      const updatedDayCare = await dayCareData.update(
        req.params.id,
        dayCarePutData.name,
        dayCarePutData.location,
        dayCarePutData.businessHours,
        dayCarePutData.contactInfo,
        dayCarePutData.yearsInBusiness,
        dayCarePutData.ranking,
        dayCarePutData.availability,
        dayCarePutData.lunchOptions,
        dayCarePutData.description,
        dayCarePutData.duration,
        dayCarePutData.tuitionRange
      );
      return res.status(200).json(updatedDayCare);
    } catch (e) {
      if (e.message === 'daycare not found') {
        return res.status(404).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }

  });

  export default router;
