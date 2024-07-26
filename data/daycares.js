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

    } else {
        yearsInBusiness = NULL;
    }

    if (availability) {

    } else {
        availability = NULL;
    }

    if (lunchChoices) {
        
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
