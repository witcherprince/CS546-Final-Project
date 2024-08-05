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

//addDaycare, and getOrg works!

testOne = await dayCareData.addDaycare(
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
    true,
    'Vegetarian, Non-Vegetarian', //The function will convert it into an array
    'Full day, Half day',
    '$2000'
  );
console.log (testOne);

//2. removeDaycare
testTwo = await dayCareData.removeDaycare('66b037736157711d237f2fd7');
console.log(testTwo);

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