import {dbConnection, closeConnection} from './config/mongoConnection.js';
import users from './data/users.js';

const db = await dbConnection();
await db.dropDatabase();

let one;
let two;
let childOne;
let childTwo;

// create user works !!
one = await users.createUser("Katherine", "Rijo", 'loveGenshin@gmail.com', 'Ilikecheese1', 'queens', 1111);
console.log(one);

two = await users.createUser("Ren", "Kozaki", 'loserLuck@yahoo.com', 'bringMeHome@44449', 'manhattan', 1002);
console.log(two);

// Add child works !!
childOne = await users.addChild(one._id, "Lebron", "James", 5);
console.log(childOne);

// remove user works!!
//const removeOne = await users.deleteuser(one._id);
//console.log(removeOne);

childTwo = await users.addChild(one._id, "Cloud", "Strife", 2);
console.log(childTwo);

// remove child works!!
const removeChild = await users.removeChild(one._id, "Lebron");
console.log(removeChild);

await closeConnection();