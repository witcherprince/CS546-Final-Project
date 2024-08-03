//database of daycares: insert, delete and update
import {daycares} from '../config/mongoCollections.js';
import userData from './users.js';
import {ObjectId} from 'mongodb';
import validation from '../validation.js';

//1. Insertion:
export const addDaycare = async(
    name, //Requied
    introduction, //requied
    address, //requied 
    town, //requied
    state, //I add the state, required. Possible to be the selections?
    zipcode, // requied
    businessHours, //requied
    email, //requied
    phone, //requied
    website, //not-requied
    yearsInBusiness, //not-requied
    availability, //not-requied, but recommend
    lunchChoices, //not-requied

    duration, //not-requied 
    tuitionRange //not-requied, but recommend
) => {
    //input checking: ...
    name = validation.checkString(name, 'name');
    introduction = validation.checkString(introduction, 'introduction');
    address = validation.checkString(validation, 'validation');
    town = validation.checkString(town, 'town').trim();
    state = validation.checkState(state);
    zipcode = validation.checkZipcode(zipcode);
    businessHours = validation.checkBusinessHour(businessHours);
    email = validation.checkEmail(email);
    phone = validation.checkPhone(phone);

    if (website) {
        website = validation.checkWebsite(website);
    } else {
        website = NULL;
    }

    if (yearsInBusiness) {
        yearsInBusiness = validation.checkNumber(yearsInBusiness, 'yearsInBusiness');
    } else {
        yearsInBusiness = NULL;
    }

    if (availability) {
        availability = validation.checkBoolean(availability, 'availability')
    } else {
        availability = NULL;
    }

    if (lunchChoices) {
        for (let i = 0; i < lunchChoices.length; i++) {
            lunchChoices[i] = validation.checkString(lunchChoices[i], 'lunchChoices');
        }
    } else {
        lunchChoices = NULL;
    }

    //Adding the daycare:
    let newDaycare = {
        name: name,
        introduction: introduction,
        location:{
            address: address,
            town: town,
            state: state,
            zipcode: zipcode
        },
        contactInfo: {
            email: email,
            phone: phone,
            website: website
        },
        businessHours: businessHours,
        tuitionRange: tuitionRange,
        availability: availability,
        yearsInBusiness: yearsInBusiness,
        lunchChoices: [lunchChoices],
        duration: duration
    }

    // Inserting daycare into database
    const dayCaresCollection = await daycares();

    const insertInfo = await dayCaresCollection.insertOne(newDaycare);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not add day care organization';
    }

    const newId = insertInfo.insertedId.toString();
    const dayCare = await getOrg(newId);
    dayCare._id = dayCare._id.toString();
    return dayCare;

}

//2. Deletion:
export const removeDaycare = async(
    name,
    introduction,
    address,
    town,
    state, //I add the state
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
) => {
    
}

//3. Update:
export const updateDaycare = async() => {
    
}

// 4. Get all daycares from database
export const getAll = async () => {

    const dayCaresCollection = await daycares();
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

// 5. Get daycare by name from database
export const getOrg = async (id) => {

    if (!id) {
      throw 'You must provide id of day organization to search for'
    };
  
    if (typeof id !== 'string') {
      throw 'Id must be a string';
    } 
  
    if (id.trim().length === 0) {
      throw 'Name of day organization cannot be an empty string or just spaces';
    }
  
    id = id.trim();
  
    const dayCaresCollection = await daycares();
    const dayCare = await dayCaresCollection.findOne({ _id: new ObjectId(id) });
  
    if (dayCare === null) {
      throw 'No day organization with that name';
    }
  
    dayCare._id = dayCare._id.toString();
  
    return dayCare;
  
  };

// modified add daycare function
export const addDayCare = async(
    name, //Requied
    introduction, //requied
    location, //required
    contactInfo, //required
    businessHours, //requied
    tuitionRange, //not-requied, but recommend
    availability, //not-requied, but recommend
    yearsInBusiness, //not-requied
    lunchChoices, //not-requied
    duration //not-requied 
) => {
    //input checking: ...
    name = validation.checkString(name, 'name');
    introduction = validation.checkString(introduction, 'introduction');
    location = validation.isValidObject(location, 'location');
    businessHours = validation.checkBusinessHour(businessHours);
    contactInfo = validation.isValidObject(contactInfo, 'contactInfo');

    let address = location.address;
    let town = location.town;
    let state = location.state;
    let zipcode = location.zipcode;
    let email = contactInfo.email;
    let phone = contactInfo.phone;
    let website = contactInfo.website;

    if (!address || !town || !state || !zipcode) {
        throw 'Location must have address, town, state and zipcode';
    }

    address = validation.checkString(address, 'address');
    town = validation.checkString(town, 'town')
    state = validation.checkState(state);
    zipcode = validation.checkZipcode(zipcode);
    email = validation.checkEmail(email);
    phone = validation.checkPhone(phone);


    if (website) {
        website = validation.checkWebsite(website);
    } else {
        website = NULL;
    }

    if (yearsInBusiness) {
        yearsInBusiness = validation.checkNumber(yearsInBusiness, 'yearsInBusiness');
    } else {
        yearsInBusiness = NULL;
    }

    if (availability) {
        availability = validation.checkBoolean(availability, 'availability')
    } else {
        availability = NULL;
    }

    if (lunchChoices) {
        for (let i = 0; i < lunchChoices.length; i++) {
            lunchChoices[i] = validation.checkString(lunchChoices[i], 'lunchChoices');
        }
    } else {
        lunchChoices = NULL;
    }

    //Adding the daycare:
    let newDaycare = {
        name: name,
        introduction: introduction,
        location:{
            address: address,
            town: town,
            state: state,
            zipcode: zipcode
        },
        contactInfo: {
            email: email,
            phone: phone,
            website: website
        },
        businessHours: businessHours,
        tuitionRange: tuitionRange,
        availability: availability,
        yearsInBusiness: yearsInBusiness,
        lunchChoices: [lunchChoices],
        duration: duration
    }

    // Inserting daycare into database
    const dayCaresCollection = await daycares();

    const insertInfo = await dayCaresCollection.insertOne(newDaycare);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not add day care organization';
    }

    const newId = insertInfo.insertedId.toString();
    const dayCare = await getOrg(newId);
    dayCare._id = dayCare._id.toString();
    return dayCare;

}

  