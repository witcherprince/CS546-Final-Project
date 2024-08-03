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

const firstDaycare = await dayCareData.addDaycare(
    'Happy Kids',
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
    ['Vegetarian', 'Non-Vegetarian'],
    ['Full day', 'Half day'],
    2000
  );

// It works!!
addFav = await userData.addFavDaycare(one._id, firstDaycare._id);
console.log(addFav);

let getFav = await userData.getFavDayCare(firstDaycare._id);
console.log(getFav);

let delFav = await userData.delFav(one._id, firstDaycare._id);
console.log(delFav);


await closeConnection();