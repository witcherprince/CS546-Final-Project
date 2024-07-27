// TODO: Export and implement the following functions in ES6 format
import { isValidString, isValidArray, isValidObject, isValidNumber, isValidBoolean } from "../helpers.js";
import {ObjectId} from 'mongodb';
import {dayCareOrg} from '../config/mongoCollections.js';


export const addOrg = async (
  name,
  location, 
  businessHours,
  contactInfo, 
  yearsInBusiness,
  ranking,
  availability,
  lunchOptions,
  description,
  duration,
  parentReview,
  tuitionRange,
) => {

  if (!name || !location || !businessHours || !contactInfo || !yearsInBusiness || !ranking || availability === undefined || !lunchOptions || !description || !duration || !parentReview || !tuitionRange) {
    throw 'All fields need to have valid values'
  }

  isValidString(name);
  isValidObject(location);
  isValidString(businessHours);
  isValidObject(contactInfo);
  isValidNumber(yearsInBusiness);
  isValidNumber(ranking);
  isValidBoolean(availability);
  isValidArray(lunchOptions);
  isValidString(description);
  isValidArray(duration);
  isValidArray(parentReview);
  isValidNumber(tuitionRange);

  name = name.trim();
  businessHours = businessHours.trim();
  description = description.trim();

  let newOrg = {
    name : name,
    location: location,
    businessHours: businessHours,
    contactInfo: contactInfo,
    yearsInBusiness: yearsInBusiness,
    ranking: ranking,
    availability: availability,
    lunchOptions: lunchOptions,
    description: description,
    duration: duration,
    parentReview:parentReview,
    tuitionRange: tuitionRange
  }

  const dayCaresCollection = await dayCareOrg();

  const insertInfo = await dayCaresCollection.insertOne(newOrg);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add day care organization';
  }
  const newId = insertInfo.insertedId.toString();
  const dayCare = await getOrg(newId);
  dayCare._id = dayCare._id.toString();
  return dayCare;
};

export const getAll = async () => {

  const dayCaresCollection = await dayCareOrg();
  let dayCareList = await dayCaresCollection.find({}).toArray();

  if (!dayCareList) {
    throw 'Could not get all daycares';
  } 
  dayCareList = dayCareList.map((elem) => {
    elem._id = elem._id.toString();
    return elem;
    });

  return dayCareList;
};

export const getOrg = async (id) => {

  let x = new ObjectId();

  if (!id) {
    throw 'You must provide an id to search for'
  };

  if (typeof id !== 'string') {
    throw 'Id must be a string';
  } 

  if (id.trim().length === 0) {
    throw 'Id cannot be an empty string or just spaces';
  }

  id = id.trim();

  if (!ObjectId.isValid(id)) {
    throw 'invalid object ID';
  }

  const dayCaresCollection = await dayCareOrg();
  const dayCare = await dayCaresCollection.findOne({_id: new ObjectId(id)});

  if (dayCare === null) {
    throw 'No band with that id';
  }

  dayCare._id = dayCare._id.toString();

  return dayCare;

};

export const remove = async (id) => {

  if (!id) {
    throw 'You must provide an id to search for';
  }

  if (typeof id !== 'string') {
    throw 'Id must be a string';
  }

  if (id.trim().length === 0) {
    throw 'id cannot be an empty string or just spaces';
  }

  id = id.trim();
  if (!ObjectId.isValid(id)) {
    throw 'invalid object ID';
  } 

  const dayCaresCollection = await dayCareOrg();
  const deletionInfo = await dayCaresCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });

  if (!deletionInfo) {
    throw `Could not delete daycare organization with id of ${id}`;
  }

  return `${deletionInfo.name} has been successfully deleted!`;
};

export const rename = async (id, newName) => {

  if (!id) throw 'provide id for the search';
  if (typeof id !== 'string') throw 'provided id must be string';
  if (id.trim().length === 0) throw 'id cannot have empty spaces or empty string';
  id = id.trim();

  if (!ObjectId.isValid(id)) throw 'provided invalid object id';
  if (!newName) throw 'provide new name for the band';
  if (typeof newName !== 'string') throw 'provide input string';
  if (newName.trim().length === 0) throw 'new band name cannot have empty string or spaces';
  newName = newName.trim();

  const updatedBand = {
    name: newName,
  };

  const bandsCollection = await bands();
  const band = await bandsCollection.findOne({_id: new ObjectId(id)});

  if (!band) {
    throw 'No band with that id';
  }

  if (band.name === newName) {
    throw 'provided band name is the same';
  }

  const updatedInfo = await bandsCollection.findOneAndUpdate(
    {_id: new ObjectId(id)},
    {$set: updatedBand},
    {returnDocument: 'after'}
  );

  if (!updatedInfo) {
    throw 'could not update band successfully';
  }

  updatedInfo._id = updatedInfo._id.toString();
  return await get(id);
};

