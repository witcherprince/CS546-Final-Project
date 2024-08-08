import {dbConnection, closeConnection} from './config/mongoConnection.js';
import {userData} from './data/index.js';
import {dayCareData} from './data/index.js'; 
import {reviewData} from './data/index.js';



const db = await dbConnection();
//await db.dropDatabase();
/*
let one;
let two;
let childOne;
let childTwo;
let addFav;


// create user works !!
one = await userData.createUser("Katherine", "Rijo", 'loveGenshin@gmail.com', 'Ilikecheese1', 'queens', 1111);
console.log(one);

two = await userData.createUser("Ren", "Kozaki", 'loserLuck@yahoo.com', 'bringMeHome@44449', 'manhattan', 1002);
console.log(two);
/*
// Add child works !!
childOne = await userData.addChild(one._id, "Lebron", "James", 5);
console.log(childOne);

// remove user works!!
//const removeOne = await users.deleteuser(one._id);
//console.log(removeOne);

childTwo = await userData.addChild(one._id, "Cloud", "Strife", 2);
console.log(childTwo);

// remove child works!!
//const removeChild = await users.removeChild(one._id, "Lebron");
//console.log(removeChild);

// It works!
try {
addFav = await userData.addFavDaycare(one._id, firstDaycare._id);
console.log(addFav);
}
catch (e) {
  console.log(e)
}

try {
let getFav = await userData.getFavDayCare(firstDaycare._id);
console.log(getFav);
}
catch (e) {
  console.log(e)
}

try {
let delFav = await userData.removeFavDaycare(one._id, firstDaycare._id);
console.log(delFav);
}
catch (e) {
  console.log(e)
}

addFav = await users.addFavDaycare(one._id, firstDaycare._id);
*/
/*
//Daycares functions checking:
let testOne;
let testTwo;

//1. addDaycare works!

testOne = await dayCareData.addDaycare(//inputs are all strings
    'Happy Kids',
    'thisCa72fe',
    'A great place for kids.',
    '123 Happy St',
    'Hppyville',
    'NY',
    '12345',
    '9am - 5pm',
    'contact@happykids.com',
    '123-456-7890',
    'https://www.happykids.com',
    '5',
    'true',
    'Vegetarian, Non-Vegetarian', //The function will convert it into an array
    'Full day, Half day',
    '$2000'
  );
console.log (testOne);


//2. removeDaycare works!
//testTwo = await dayCareData.removeDaycare('66b04b2910b0b62f1fe973cc');
//console.log(testTwo);

//3a. updateDaycare works!
/*
let updateDaycare = {
    name: 'Fun Kids',
    introduction: 'A new school for kids.',
    address: '10 Fun St',
    town: 'Hppyville',
    state: 'MA',
    zipcode: '54321',
    businessHours: '9am - 6pm',
    email: 'contact@funkids.com',
    phone: '123-456-7890',
    website: 'https://www.happykids.com',
    yearsInBusiness: '0',
    availability: 'true',
    lunchChoices: 'hot lunch, Non-Vegetarian', //The function will convert it into an array
    duration: 'Half day',
    tuitionRange: '$2000'
}
let testThree = await dayCareData.updateDaycare('66b04cc195f03a9741d8c710', updateDaycare);
console.log(testThree);
*/
/*
//3b. updateAvailability works!
let testB = await dayCareData.updateAvailability('66b04c56f099742d48e9c225','false');
console.log(testB);
*/
/*
//3c updatePassword works!
let testC = await dayCareData.updatePassword('66b0f2d0c2039b20c823fb73', 'updatePass*27');
console.log(testC);
*/
/*
//4. getAll() works!
let test4 = await dayCareData.getAll();
console.log(test4);

//5. getOrg() works!
let test5 = await dayCareData.getOrg('66b0f2d0c2039b20c823fb73');
console.log(test5);
*/
/*
//6. getState works!
let test6 = await dayCareData.getState('NY');
console.log(test6);
*/
/*
//7. loginDaycare works!
let test7 = await dayCareData.loginDaycare('contact@happykids.com', 'updatePass*27');
console.log(test7);
*/

//Reviews,js Checking:
//1. addReview works!
//let reviewAdd1 = await reviewData.addReview('66b0f2d0c2039b20c823fb73', '66b0f2c4c2039b20c823fb71', '4.6', 'Nice teachers');
//console.log(reviewAdd1);

//let reviewAdd2 = await reviewData.addReview('66b0f2d0c2039b20c823fb73', '66b0f2c4c2039b20c823fb71', 5, 'Nice place');
//console.log(reviewAdd2);

//2. getReviewById works!
//let reviewGet = await reviewData.getReviewById('66b0f4f6df5a0d42c6ede8cb');
//console.log(reviewGet);

//3. updateReview works!
//let reviewUpdate = await reviewData.updateReview('66b0f4f6df5a0d42c6ede8cb', '4', 'Not bad');
//console.log(reviewUpdate);

//4. removeReview works!
//let reviewRemove1 = await reviewData.removeReview('66b0f4f6df5a0d42c6ede8cb');
//console.log(reviewRemove1)

await closeConnection();