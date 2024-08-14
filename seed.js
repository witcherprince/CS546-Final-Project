import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import { userData } from "./data/index.js";

// Use this to populate some users

const db = await dbConnection();
await db.dropDatabase();

try {
  const one = await userData.createUser(
    "Katherine",
    "Rijo",
    "loveGenshin@gmail.com",
    "Ilikecheese1",
    "queens",
    1111
  );
  console.log(one);

  const two = await userData.createUser(
    "Ren",
    "Kozaki",
    "loserLuck@yahoo.com",
    "bringMeHome@44449",
    "manhattan",
    10022
  );

  const three = await userData.createUser(
    "Lian",
    "Jenova",
    "mymommyjenova@gmail.com",
    "welcomeTOtheclub44!",
    "gaia",
    45644
  );

  const four = await userData.createUser(
    "Tifa",
    "Lockhart",
    "puncHINGstuff555@aol.com",
    "babaBOOEY@@@1111",
    "thePlanet",
    12345
  );

  const five = await userData.createUser(
    "Hawkeye",
    "Lionheart",
    "dffrfvvf##221",
    "brooklyn",
    "55555"
  );
} catch (e) {
  console.log("Seeding users went wrong.");
}

console.log("Done seeding.");

await closeConnection();
