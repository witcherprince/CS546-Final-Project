//database of daycares: insert, delete and update
import {daycares} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcryptjs from 'bcryptjs';
import validation from '../validation.js';

//1. Insertion:
const exportedMethods = {
  async addDaycare (
    name, //Required, string
    password, //Required, string
    introduction, //Required, string
    address, //Required, street & apt number, string
    town, //Required, string
    state, //required. two letters string
    zipcode, // Required, string
    businessHours, //Required, string
    email, //Required, string
    phone, //Required, string
    website, //not-Required, string
    yearsInBusiness, //not-Required, string
    availability, //not-Required, but recommend, boolean
    lunchChoices, //not-Required, string, seperate all choices with ',' example: 'hot lunch, veggie-choice'
    duration, //not-Required, string, seperate with ','
    tuitionRange //not-Required, but recommend, string
)  {
    //input checking: ...
    name = validation.checkString(name, 'name');
    password = validation.checkPassword(password, 'Password');
    const hashPassword = await bcryptjs.hash(password, 15);
    introduction = validation.checkIntroduction(introduction, 'introduction');
    address = validation.checkString(address, 'Address');
    town = validation.checkString(town, 'town');
    state = validation.checkState(state);
    zipcode = validation.checkZipcode(zipcode);
    businessHours = validation.checkBusinessHour(businessHours);
    email = validation.checkEmail(email);
    phone = validation.checkPhone(phone);

    if (website) {
        website = validation.checkWebsite(website);
    } else {
        website = null;
    }

    if (yearsInBusiness) {
        yearsInBusiness = validation.checkNumber(yearsInBusiness, 'yearsInBusiness');
    } else {
        yearsInBusiness = null;
    }

    if (availability) {
        availability = validation.checkBoolean(availability, 'availability')
    } else {
        availability = null;
    }

    if (lunchChoices) {
        lunchChoices = validation.checkString(lunchChoices, 'lunch choices');
        lunchChoices =  lunchChoices.split(',');
    } else {
        lunchChoices = [];
    }

    if (duration) {
        duration = validation.checkString(duration, 'duration');
        duration =  duration.split(',');
    } else {
        duration = [];
    }

    if (tuitionRange) {
        tuitionRange = validation.checkString(tuitionRange, 'tuition range');
    } else {
        tuitionRange = null;
    }
    //Adding the daycare:
    let newDaycare = {
        name: name,
        password: hashPassword,
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
        duration: duration,
        rating: 0,
        reviews: [],
        role: 'daycare'
    } //revews to store review's id, and rating is the average rating

    // Inserting daycare into database
    const dayCaresCollection = await daycares();

    const insertInfo = await dayCaresCollection.insertOne(newDaycare);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not add day care organization';
    }

    const newId = insertInfo.insertedId;
    //const dayCare = await getOrg(newId);
    const dayCare = await this.getOrg(name);
    dayCare._id = dayCare._id.toString();
    return dayCare;
  },

//2. Deletion:
  async removeDaycare (id)  {
    if (!(id instanceof ObjectId)) {
        id = validation.checkId(id);
        id = new ObjectId(id);
    }
    
    const dayCaresCollection = await daycares();
    const deletionInfo = await dayCaresCollection.findOneAndDelete({
      _id: id
    })

    if (deletionInfo.value === null) {
        throw 'The daycare is not fond!';
    }

    return {...deletionInfo.value, deleted: true};
  },

//3. Update:
//a. update everything:
  async updateDaycare (id, updatedInfor) {
    //Data checking:
    if (!(id instanceof ObjectId)) {
        id = validation.checkId(id);
        id = new ObjectId(id);
    }
    let name = validation.checkString(updatedInfor.name, 'name');
    let introduction = validation.checkString(updatedInfor.introduction, 'introduction');
    let address = validation.checkString(updatedInfor.location.adress, 'Address');
    let town = validation.checkString(updatedInfor.location.town, 'town');
    let state = validation.checkState(updatedInfor.location.state);
    let zipcode = validation.checkZipcode(updatedInfor.location.zipcode);
    let businessHours = validation.checkBusinessHour(updatedInfor.businessHours);
    let email = validation.checkEmail(updatedInfor.contactInfo.email);
    let phone = validation.checkPhone(updatedInfor.contactInfo.phone);
    let website;
    let yearsInBusiness;
    let availability;
    let lunchChoices;
    let duration;
    let tuitionRange;

    if (updatedInfor.contactInfo.website) {
        website = validation.checkWebsite(updatedInfor.contactInfo.website);
    } else {
        website = null;
    }

    if (updatedInfor.yearsInBusiness) {
        yearsInBusiness = validation.checkNumber(updatedInfor.yearsInBusiness, 'yearsInBusiness');
    } else {
        yearsInBusiness = null;
    }

    if (updatedInfor.availability) {
        availability = validation.checkBoolean(updatedInfor.availability, 'availability')
    } else {
        availability = null;
    }

    if (updatedInfor.lunchChoices) {
        lunchChoices = updatedInfor.lunchChoices
          .split(',')
          .map(choice => validation.checkString(choice.trim(), 'lunch choice'));
    } else {
        lunchChoices = [];
    }

    if (updatedInfor.duration) {
        duration = updatedInfor.duration
          .split(',')
          .map(dur => validation.checkString(dur.trim(), 'duration'));
    } else {
        duration = [];
    }

    if (updatedInfor.tuitionRange) {
        tuitionRange = validation.checkString(updatedInfor.tuitionRange, 'tuition range');
    } else {
        tuitionRange = null;
    }

    //Updating all fields except reviews and rating:
    const dayCaresCollection = await daycares();
    const daycare = await dayCaresCollection.findOne({ _id: id });
    if (!daycare) {
      throw `Daycare is not found`;
    }
    let review = daycare.reviews;
    let num = daycare.averageRating;
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
        duration: duration,
        rating: num,
        reviews: review
    } 
    const updateResult = await dayCaresCollection.updateOne(
      { _id: id },
      { $set: newDaycare }
    );

    if (updateResult.modifiedCount === 0) {
      throw 'Could not update it.';
    }

    return await dayCaresCollection.findOne({ _id: id });
  },

// b. only update the availability:
  async updateAvailability (id, availability) {
    if (!(id instanceof ObjectId)) {
        id = validation.checkId(id);
        id = new ObjectId(id);
    }
    if (availability) {
        availability = validation.checkBoolean(availability, 'availability')
    } else {
        throw 'You must provide the availability.'
    }

    const dayCaresCollection = await daycares();
    const updateResult = await dayCaresCollection.updateOne(
        { _id: id },
        { $set: { availability: availability } }
    );

    if (updateResult.modifiedCount === 0) {
        throw 'Could not update the availability. Please check if the provided ID is correct.';
    }

    return await dayCaresCollection.findOne({ _id: id });
  },

// 4. Get all daycares from database
  async getAll() {

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
  },

// 5. Get daycare by name from database
  async getOrg(name) {

    if (!name) {
      throw 'You must provide an name of day organization to search for'
    };
  
    if (typeof name !== 'string') {
      throw 'Id must be a string';
    } 
  
    if (name.trim().length === 0) {
      throw 'Name of day organization cannot be an empty string or just spaces';
    }
  
    name = name.trim();
  
    const dayCaresCollection = await daycares();
    const dayCare = await dayCaresCollection.findOne({ name: name });
  
    if (dayCare === null) {
      throw 'No daycare organization with that name';
    }
  
    dayCare._id = dayCare._id.toString();
  
    return dayCare;
  
  }

}; 
export default exportedMethods;
