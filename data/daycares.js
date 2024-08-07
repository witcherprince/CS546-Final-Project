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
    availability, //not-Required, but recommend, string ('true' or 'false')
    lunchChoices, //not-Required, string, seperate all choices with ',' example: 'hot lunch, veggie-choice'
    duration, //not-Required, string, seperate with ','
    tuitionRange //not-Required, but recommend, string
)  {
    //input checking: ...
    name = validation.isString(name, 'name');
    password = validation.checkPassword(password, 'Password');
    const hashPassword = await bcryptjs.hash(password, 15);
    introduction = validation.checkIntroduction(introduction, 'introduction');
    address = validation.isString(address, 'Address');
    town = validation.isString(town, 'town');
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
      yearsInBusiness = validation.checkNumber(
        yearsInBusiness,
        "yearsInBusiness"
      );
    } else {
      yearsInBusiness = null;
    }

    if (availability) {
      availability = validation.checkBoolean(availability, "availability");
    } else {
      availability = null;
    }

    if (lunchChoices) {
      lunchChoices = validation.isString(lunchChoices, "lunch choices");
      lunchChoices = lunchChoices.split(",");
    } else {
      lunchChoices = [];
    }

    if (duration) {
      duration = validation.isString(duration, "duration");
      duration = duration.split(",");
    } else {
      duration = [];
    }

    if (tuitionRange) {
      tuitionRange = validation.isString(tuitionRange, "tuition range");
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
      throw "Could not add day care organization";
    }

    const newId = insertInfo.insertedId;
    const dayCare = await this.getOrg(newId);

    return dayCare;
  },

  //2. Deletion:
  async removeDaycare(id) {
    if (!(id instanceof ObjectId)) {
      id = validation.checkId(id);
      id = new ObjectId(id);
    }

    const dayCaresCollection = await daycares();
    const deletionInfo = await dayCaresCollection.findOneAndDelete({
      _id: id,
    });

    if (!deletionInfo) {
        throw 'The daycare is not fond!';
    }

    let name = deletionInfo.name;
    return name + ' has been successfully deleted!';
  },

  //3. Update:
  //a. update everything:
  async updateDaycare(id, updatedInfo) {
    //Data checking:
    if (!(id instanceof ObjectId)) {
      id = validation.checkId(id);
      id = new ObjectId(id);
    }
    let name = validation.isString(updatedInfo.name, "name");
    let introduction = validation.isString(
      updatedInfo.introduction,
      "introduction"
    );
    let address = validation.isString(
      updatedInfo.address,
      "Address"
    );
    let town = validation.isString(updatedInfo.town, "town");
    let state = validation.checkState(updatedInfo.state);
    let zipcode = validation.checkZipcode(updatedInfo.zipcode);
    let businessHours = validation.checkBusinessHour(
      updatedInfo.businessHours
    );
    let email = validation.checkEmail(updatedInfo.email);
    let phone = validation.checkPhone(updatedInfo.phone);
    let website;
    let yearsInBusiness;
    let availability;
    let lunchChoices;
    let duration;
    let tuitionRange;

    if (updatedInfo.website) {
      website = validation.checkWebsite(updatedInfo.website);
    } else {
      website = null;
    }

    if (updatedInfo.yearsInBusiness) {
      yearsInBusiness = validation.checkNumber(
        updatedInfo.yearsInBusiness,
        "yearsInBusiness"
      );
    } else {
      yearsInBusiness = null;
    }

    if (updatedInfo.availability) {
      availability = validation.checkBoolean(
        updatedInfo.availability,
        "availability"
      );
    } else {
      availability = null;
    }

    if (updatedInfo.lunchChoices) {
      lunchChoices = updatedInfo.lunchChoices
        .split(",")
        .map((choice) => validation.isString(choice.trim(), "lunch choice"));
    } else {
      lunchChoices = [];
    }

    if (updatedInfo.duration) {
      duration = updatedInfo.duration
        .split(",")
        .map((dur) => validation.isString(dur.trim(), "duration"));
    } else {
      duration = [];
    }

    if (updatedInfo.tuitionRange) {
      tuitionRange = validation.isString(
        updatedInfo.tuitionRange,
        "tuition range"
      );
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
      location: {
        address: address,
        town: town,
        state: state,
        zipcode: zipcode,
      },
      contactInfo: {
        email: email,
        phone: phone,
        website: website,
      },
      businessHours: businessHours,
      tuitionRange: tuitionRange,
      availability: availability,
      yearsInBusiness: yearsInBusiness,
      lunchChoices: [lunchChoices],
      duration: duration,
      rating: num,
      reviews: review,
    };
    const updateResult = await dayCaresCollection.updateOne(
      { _id: id },
      { $set: newDaycare }
    );

    if (updateResult.modifiedCount === 0) {
      throw "Could not update it.";
    }

    const dayCare = await this.getOrg(id);
    return dayCare;
  },

  // b. only update the availability:
  async updateAvailability(id, availability) {
    if (!(id instanceof ObjectId)) {
      id = validation.checkId(id);
      id = new ObjectId(id);
    }
    if (availability) {
      availability = validation.checkBoolean(availability, "availability");
    } else {
      throw "You must provide the availability.";
    }

    const dayCaresCollection = await daycares();
    const updateResult = await dayCaresCollection.updateOne(
      { _id: id },
      { $set: { availability: availability } }
    );

    if (updateResult.modifiedCount === 0) {
      throw "Could not update the availability. Please check if the provided ID is correct.";
    }

    const dayCare = await this.getOrg(id);
    return dayCare;
  },

  //c. Only update password // Need check
  async updatePassword(id, password) {
    if (!(id instanceof ObjectId)) {
      id = validation.checkId(id);
      id = new ObjectId(id);
    }
    password = validation.checkPassword(password, 'Password');
    const hashPassword = await bcryptjs.hash(password, 15);

    const dayCaresCollection = await daycares();
    const updateResult = await dayCaresCollection.updateOne(
      { _id: id },
      { $set: { password: hashPassword } }
    );

    if (updateResult.modifiedCount === 0) {
      throw "The new password must be different from the previous one.";
    }

    return "Password has been changed!";
  },

  // 4. Get all daycares from database
  async getAll() {
    const dayCaresCollection = await daycares();
    let dayCareList = await dayCaresCollection.find({}).toArray();

    if (!dayCareList) {
      throw "Could not get all daycares";
    }
    dayCareList = dayCareList.map((elem) => {
      elem._id = elem._id.toString();
      return elem;
    });

    return dayCareList;
  },

  // 5. Get daycare by name from database
  async getOrg(id) {
    if (!(id instanceof ObjectId)) {
      id = validation.checkId(id);
      id = new ObjectId(id);
    }
    const dayCaresCollection = await daycares();
    const dayCare = await dayCaresCollection.findOne(
      { _id: id },
      { projection: { password: 0 } }
    );

    if (dayCare === null) {
      throw "No daycare organization with that name";
    }

    return dayCare;
  },

  // 6. Get daycares by state
  async getState(state) {
    state = validation.checkState(state);


  },

  //7. log in function
  async loginDaycare(email, password) {

  }


};

export default exportedMethods;
