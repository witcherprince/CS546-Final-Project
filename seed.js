import {dbConnection, closeConnection} from './config/mongoConnection.js';
import users from './data/users.js';

const db = await dbConnection();
await db.dropDatabase();

let one;
let childOne;

one = await users.createUser("Katherine", "Rijo", 'loveGenshin@gmail.com', 'Ilikecheese1', 'queens', 1111);
console.log(one);

childOne = await users.addChild(one._id, "Lebron", "James", 5);
console.log(childOne);

await closeConnection();