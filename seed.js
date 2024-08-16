import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import { userData } from "./data/index.js";
import { dayCareData } from "./data/index.js";

// Use this to populate some users

const db = await dbConnection();
await db.dropDatabase();

try {
  const one = await userData.createUser(
    "Katherine",
    "Rijo",
    "loveGenshin@gmail.com",
    "Ilikecheese1@",
    "queens",
    1111
  );

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
    "hhlookies411@yahoo.com",
    "dffrfvF##221",
    "brooklyn",
    55555
  );

  // Seed data
  const firstDaycare = await dayCareData.addDaycare(
    "Happy Kids", // name
    "HorsePull748*% ", // password
    "A great place for kids.", // introduction
    "123 Happy St", // address
    "Happyville", // town
    "NY", // state
    "12345", // zipcode
    "9am - 5pm", // businessHours
    "contact@happykids.com", // email
    "1-123-456-7890", // phone
    "http://www.happykids.com", // website (optional, can be null or undefined if not provided)
    "5", // yearsInBusiness (string)
    "true", // availability (optional, can be null or undefined if not provided)
    "Vegetarian, Non-Vegetarian", // lunchChoices (string, comma-separated)
    "Full day, Half day", // duration (string, comma-separated)
    "2000-2500" // tuitionRange (optional, can be null or undefined if not provided)
  );

  const secondDaycare = await dayCareData.addDaycare(
    "Bright Future",
    "HorsePull748*%",
    "Focused on early childhood development.",
    "456 Bright Rd",
    "Sunnyvale",
    "CA",
    "67890",
    "8am - 4pm",
    "info@brightfuture.com",
    "1-987-654-3210",
    "http://www.brightfuture.com",
    "10",
    "true",
    "Vegetarian",
    "Full day",
    "2500-3000"
  );

  const thirdDaycare = await dayCareData.addDaycare(
    "Little Learners",
    "SecurePass1!",
    "A safe environment where learning happens through play.",
    "789 Little Lane",
    "Springfield",
    "IL",
    "54321",
    "7am - 6pm",
    "contact@littlelearners.com",
    "1-555-123-4567",
    "http://www.littlelearners.com",
    "8",
    "true",
    "Non-Vegetarian, Gluten-Free",
    "Half day, Full day",
    "2200-2750"
  );

  const fourthDaycare = await dayCareData.addDaycare(
    "Sunshine Academy",
    "BrightDay2@",
    "Where sunshine meets learning!",
    "101 Sunshine Blvd",
    "Greenwich",
    "CT",
    "11223",
    "9am - 5pm",
    "support@sunshineacademy.com",
    "1-444-555-6666",
    "http://www.sunshineacademy.com",
    "7",
    "false",
    "Vegetarian, Non-Vegetarian, Allergy-Free",
    "Full day",
    "3000-3200"
  );

  const fifthDaycare = await dayCareData.addDaycare(
    "Happy Feet",
    "HappyKids3#",
    "Nurturing and fun environment for all kids.",
    "202 Happy St",
    "Lakeside",
    "NV",
    "67890",
    "8am - 5pm",
    "contact@happyfeet.com",
    "1-333-444-5555",
    "http://www.happyfeet.com",
    "6",
    "true",
    "Vegetarian",
    "Full day, Half day",
    "2100-2300"
  );
} catch (e) {
  console.log("Seeding users went wrong. " + e);
}

console.log("Done seeding.");

//Part two: daycare organization
try {
  const daycare1 = await dayCareData.addDaycare(
    'Happy kids',
    'dayCare1@test1',
    'A safe place for kids to learn, to explore, to play and more!',
    '35 Kids Ave',
    'Kidstown',
    'MA',
    '01234',
    '7:30 - 5:30',
    'happyinfo@happy.com',
    '123-456-7890',
    'www.happykids.com',
    '8',
    'true',
    'hot-lunch, veggie',
    'half day, full day',
    '$2200'
  );
  console.log(daycare1);

  const daycare2 = await dayCareData.addDaycare(
    'Bright babies',
    'dayCare2@test2',
    'Our fabulous faculty will provide a lovely learning enviroment for your baby!',
    '27 Sun Rd',
    'babyvell',
    'NY',
    '21354',
    '7:30 - 6:00',
    'bright@babies.com',
    '098-765-4321',
    'www.brightbabies.com',
    '',
    'true',
    '',
    'half day, full day',
    '$2500'
  );
  console.log(daycare2);
  
  const daycare3 = await dayCareData.addDaycare(
    'Love Center',
    'dayCare3@test3',
    'Love, enjoy and respect is our goal for teaching. Check out our center, a warm place for your little one to dream.',
    '6 Children Rd',
    'midtwon',
    'MA',
    '78904',
    '7:00 - 14:00',
    'loveinfo@center.com',
    '1-123-234-3456',
    'www.lovecenter.com',
    '4',
    'false',
    'purchase-lunch, veggie',
    'half day',
    '$1600'
  );
  console.log(daycare3);

  const daycare4 = await dayCareData.addDaycare(
    'Future Kids Home',
    'dayCare4@test4',
    'A unique place for your unique little one.',
    '2nd floor, 78 Center Ave',
    'kidborough',
    'MA',
    '98765',
    '7:00 - 6:00',
    'furure@home.edu',
    '1-987-456-1234',
    'www.futurehome.com',
    '',
    'true',
    '',
    '',
    '$1800'
  );
  console.log(daycare4);

  const daycare5 = await dayCareData.addDaycare(
    'Magical School',
    'dayCare5@test5',
    'A magical place for kids to learn and build their imagination!',
    '2 new Rd',
    'kidton',
    'NY',
    '25347',
    '8:30 - 6:30',
    'magical@school.com',
    '123-678-6352',
    'www.magical.edu',
    '15',
    'true',
    '',
    '',
    '$2000'
  );
  console.log(daycare5);

} catch (e) {
  console.log('Daycare organization went wrong.');
  console.log(e);
}

console.log("Done seeding.");

await closeConnection();
