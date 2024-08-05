import {dbConnection, closeConnection} from './config/mongoConnection.js';
import {userData} from './data/index.js';
import {dayCareData} from './data/index.js'; 




const db = await dbConnection();
await db.dropDatabase();

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


//Daycares functions checking:
let testOne;
let testTwo;

//addDaycare works!
/*
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
*/

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

//3b. updateAvailability works!
let testB = await dayCareData.updateAvailability('66b04c56f099742d48e9c225','false');
console.log(testB);


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

await closeConnection();