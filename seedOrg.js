import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { dayCareData } from '../data/index.js'; 
const db = await dbConnection();
await db.dropDatabase(); 

// Seed data for daycares
const firstDaycare = await dayCareData.addOrg(
  'Happy Kids',
  { address: '123 Happy St', town: 'Happyville', zipcode: '12345' },
  '9am - 5pm',
  { email: 'contact@happykids.com', phone: '123-456-7890', website: 'http://www.happykids.com' },
  5,
  4.5,
  true,
  ['Vegetarian', 'Non-Vegetarian'],
  'A great place for kids.',
  ['Full day', 'Half day'],
  ['Excellent service', 'Great staff'],
  2000
);

const secondDaycare = await dayCareData.addOrg(
  'Bright Future',
  { address: '456 Bright Rd', town: 'Sunnyvale', zipcode: '67890' },
  '8am - 4pm',
  { email: 'info@brightfuture.com', phone: '987-654-3210', website: 'http://www.brightfuture.com' },
  10,
  4.8,
  true,
  ['Vegetarian'],
  'Focused on early childhood development.',
  ['Full day'],
  ['Wonderful environment for children.'],
  2500
);

const thirdDaycare = await dayCareData.addOrg(
  'Little Learners',
  { address: '789 Little Lane', town: 'Springfield', zipcode: '54321' },
  '7am - 6pm',
  { email: 'contact@littlelearners.com', phone: '555-123-4567', website: 'http://www.littlelearners.com' },
  8,
  4.6,
  true,
  ['Non-Vegetarian', 'Gluten-Free'],
  'Learning through play in a safe environment.',
  ['Half day', 'Full day'],
  ['Amazing staff and care!'],
  2200
);

const fourthDaycare = await dayCareData.addOrg(
  'Sunshine Academy',
  { address: '101 Sunshine Blvd', town: 'Greenwich', zipcode: '11223' },
  '9am - 5pm',
  { email: 'support@sunshineacademy.com', phone: '444-555-6666', website: 'http://www.sunshineacademy.com' },
  7,
  4.7,
  false,
  ['Vegetarian', 'Non-Vegetarian', 'Allergy-Free'],
  'Where sunshine meets learning!',
  ['Full day'],
  ['Great place for my kids to grow.'],
  3000
);

const fifthDaycare = await dayCareData.addOrg(
  'Happy Feet',
  { address: '202 Happy St', town: 'Lakeside', zipcode: '67890' },
  '8am - 5pm',
  { email: 'contact@happyfeet.com', phone: '333-444-5555', website: 'http://www.happyfeet.com' },
  6,
  4.4,
  true,
  ['Vegetarian'],
  'Nurturing and fun environment for all kids.',
  ['Full day', 'Half day'],
  ['My kids love it here!'],
  2100
);

const sixthDaycare = await dayCareData.addOrg(
  'Rainbow Kids',
  { address: '303 Rainbow Ave', town: 'Pleasantville', zipcode: '98765' },
  '9am - 4pm',
  { email: 'info@rainbowkids.com', phone: '222-333-4444', website: 'http://www.rainbowkids.com' },
  9,
  4.9,
  true,
  ['Non-Vegetarian', 'Vegan'],
  'A vibrant place for early learning.',
  ['Half day'],
  ['Excellent care and facilities.'],
  2300
);

const seventhDaycare = await dayCareData.addOrg(
  'Early Steps',
  { address: '404 Early St', town: 'Brighton', zipcode: '34567' },
  '7:30am - 6:30pm',
  { email: 'contact@earlysteps.com', phone: '555-666-7777', website: 'http://www.earlysteps.com' },
  11,
  4.6,
  true,
  ['Vegetarian', 'Non-Vegetarian'],
  'Early steps to a bright future.',
  ['Full day', 'Half day'],
  ['Very satisfied with the care.'],
  2400
);

const eighthDaycare = await dayCareData.addOrg(
  'Learning Tree',
  { address: '505 Learning Rd', town: 'Mapleton', zipcode: '45678' },
  '8am - 4pm',
  { email: 'info@learningtree.com', phone: '666-777-8888', website: 'http://www.learningtree.com' },
  12,
  4.7,
  false,
  ['Vegetarian', 'Gluten-Free'],
  'Growing minds in a nurturing environment.',
  ['Full day'],
  ['Fantastic teachers and programs.'],
  2500
);

const ninthDaycare = await dayCareData.addOrg(
  'Kids Kingdom',
  { address: '606 Kingdom Blvd', town: 'Royal City', zipcode: '56789' },
  '9am - 5pm',
  { email: 'support@kidskingdom.com', phone: '777-888-9999', website: 'http://www.kidskingdom.com' },
  6,
  4.8,
  true,
  ['Vegetarian'],
  'A kingdom of fun and learning.',
  ['Half day', 'Full day'],
  ['Wonderful place for kids to grow.'],
  2600
);

const tenthDaycare = await dayCareData.addOrg(
  'Creative Minds',
  { address: '707 Creative Dr', town: 'Artville', zipcode: '67890' },
  '9am - 3pm',
  { email: 'info@creativeminds.com', phone: '888-999-0000', website: 'http://www.creativeminds.com' },
  7,
  4.6,
  true,
  ['Non-Vegetarian', 'Vegetarian'],
  'Fostering creativity and growth.',
  ['Full day'],
  ['Incredible programs and staff.'],
  2700
);


// const firstDaycare = await dayCareData.addOrg(
//   'Happy Kids',
//   ['123 Happy St','Happyville','12345'],
//   '9am - 5pm',
//   ['contact@happykids.com','123-456-7890', 'http://www.happykids.com'],
//   5,
//   4.5,
//   true,
//   ['Vegetarian', 'Non-Vegetarian'],
//   'A great place for kids.',
//   ['Full day', 'Half day'],
//   ['Excellent service', 'Great staff'],
//   2000
// );

// const secondDaycare = await dayCareData.addOrg(
//   'Bright Future',
//   ['456 Bright Rd','Brighttown','67890'],
//   '8am - 4pm',
//   ['info@brightfuture.com','987-654-3210','http://www.brightfuture.com'],
//   10,
//   4.8,
//   true,
//   ['Vegetarian'],
//   'Focused on early childhood development.',
//   ['Full day'],
//   ['Wonderful environment for children.'],
//   2500
// );

// const thirdDaycare = await dayCareData.addOrg(
//   'Little Learners',
//   ['789 Little Ln','Learnersville','54321'],
//   '7am - 6pm',
//   ['support@littlelearners.com','555-123-4567','http://www.littlelearners.com'],
//   7,
//   4.3,
//   true,
//   ['Non-Vegetarian'],
//   'Innovative learning environment for toddlers.',
//   ['Full day', 'Half day'],
//   ['Great staff and facilities.'],
//   1800
// );

// const fourthDaycare = await dayCareData.addOrg(
//   'Creative Minds',
//   ['321 Creative Ave','Creativecity','67890'],
//   '9am - 3pm',
//   ['contact@creativeminds.com','555-987-6543','http://www.creativeminds.com'],
//   12,
//   4.6,
//   false,
//   ['Vegetarian', 'Non-Vegetarian'],
//   'Where creativity and learning go hand in hand.',
//   ['Full day'],
//   ['Fantastic programs for kids.'],
//   2200
// );

// const fifthDaycare = await dayCareData.addOrg(
//   'Adventure Academy',
//   ['654 Adventure Rd','Adventuria','11223'],
//   '8am - 5pm',
//   ['info@adventureacademy.com','555-678-9012','http://www.adventureacademy.com'],
//   8,
//   4.7,
//   true,
//   ['Non-Vegetarian'],
//   'Exciting and educational experiences for children.',
//   ['Full day'],
//   ['Amazing learning environment.'],
//   2700
// );

// const sixthDaycare = await dayCareData.addOrg(
//   'Bright Horizons',
//   ['987 Horizon Blvd','Horizontown','22334'],
//   '7am - 7pm',
//   ['contact@brighthorizons.com','555-345-6789','http://www.brighthorizons.com'],
//   6,
//   4.4,
//   true,
//   ['Vegetarian', 'Non-Vegetarian'],
//   'Expanding horizons through quality education.',
//   ['Full day', 'Half day'],
//   ['Supportive and caring staff.'],
//   2100
// );

// const seventhDaycare = await dayCareData.addOrg(
//   'Future Stars',
//   ['852 Future Way','Futureville','33445'],
//   '9am - 5pm',
//   ['info@futurestars.com','555-123-4568','http://www.futurestars.com'],
//   4,
//   4.2,
//   true,
//   ['Vegetarian'],
//   'Preparing children for a bright future.',
//   ['Half day'],
//   ['Great place for early education.'],
//   1500
// );

// const eighthDaycare = await dayCareData.addOrg(
//   'Kiddos Corner',
//   ['741 Kiddos St','Kiddoville','44556'],
//   '8am - 4pm',
//   ['contact@kiddoscorner.com','555-654-3210','http://www.kiddoscorner.com'],
//   3,
//   4.1,
//   true,
//   ['Non-Vegetarian'],
//   'A fun and engaging environment for kids.',
//   ['Full day'],
//   ['Wonderful for children’s development.'],
//   1700
// );

// const ninthDaycare = await dayCareData.addOrg(
//   'Learning Tree',
//   ['963 Learning Ln','Treeville','55667'],
//   '7:30am - 6:30pm',
//   ['info@learningtree.com','555-321-4567','http://www.learningtree.com'],
//   9,
//   4.5,
//   true,
//   ['Vegetarian', 'Non-Vegetarian'],
//   'Nurturing learning and growth.',
//   ['Full day'],
//   ['Highly recommended for young learners.'],
//   2300
// );

// const tenthDaycare = await dayCareData.addOrg(
//   'Little Giants',
//   ['147 Giant Dr','Gianttown','66778'],
//   '8am - 5pm',
//   ['contact@littlegiants.com','555-432-1098','http://www.littlegiants.com'],
//   11,
//   4.6,
//   false,
//   ['Vegetarian'],
//   'Building strong foundations for the future.',
//   ['Half day'],
//   ['Excellent programs and staff.'],
//   2500
// );

console.log('Done seeding database');
await closeConnection();
