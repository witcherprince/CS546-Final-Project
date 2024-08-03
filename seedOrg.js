import { dbConnection, closeConnection } from './config/mongoConnection.js';
import * as dayCareData from './data/daycares.js'; 
const db = await dbConnection();
await db.dropDatabase(); 

try {
  console.log('Seeding database...');

  // Seed data
  const firstDaycare = await dayCareData.addDayCare(
    'Happy Kids',
    'A great place for kids.',
    { address: '123 Happy St', town: 'Happyville', state: 'NY', zipcode: '12345' },
    { email: 'contact@happykids.com', phone: '1-123-456-7890', website: 'http://www.happykids.com' },
    '9am - 5pm',
    '2000-2500',
    'true',
    5,
    ['Vegetarian', 'Non-Vegetarian'],
    ['Full day', 'Half day']
  );
  console.log('First daycare added:', firstDaycare);

  const secondDaycare = await dayCareData.addDayCare(
    'Bright Future',
    'Focused on early childhood development.',
    { address: '456 Bright Rd', town: 'Sunnyvale', state: 'CA', zipcode: '67890' },
    { email: 'info@brightfuture.com', phone: '1-987-654-3210', website: 'http://www.brightfuture.com' },
    '8am - 4pm',
    '2500-3000',
    'true',
    10,
    ['Vegetarian'],
    ['Full day']
  );
  console.log('Second daycare added:', secondDaycare);

  const thirdDaycare = await dayCareData.addDayCare(
    'Little Learners',
    'Learning through play in a safe environment.',
    { address: '789 Little Lane', town: 'Springfield', state: 'IL', zipcode: '54321' },
    { email: 'contact@littlelearners.com', phone: '1-555-123-4567', website: 'http://www.littlelearners.com' },
    '7am - 6pm',
    '2200-2750',
    'true',
    8,
    ['Non-Vegetarian', 'Gluten-Free'],
    ['Half day', 'Full day']
  );
  console.log('Third daycare added:', thirdDaycare);

  const fourthDaycare = await dayCareData.addDayCare(
    'Sunshine Academy',
    'Where sunshine meets learning!',
    { address: '101 Sunshine Blvd', town: 'Greenwich', state: 'CT', zipcode: '11223' },
    { email: 'support@sunshineacademy.com', phone: '1-444-555-6666', website: 'http://www.sunshineacademy.com' },
    '9am - 5pm',
    '3000-3200',
    'false',
    7,
    ['Vegetarian', 'Non-Vegetarian', 'Allergy-Free'],
    ['Full day']
  );
  console.log('Fourth daycare added:', fourthDaycare);

  const fifthDaycare = await dayCareData.addDayCare(
    'Happy Feet',
    'Nurturing and fun environment for all kids.',
    { address: '202 Happy St', town: 'Lakeside', state: 'NV', zipcode: '67890' },
    { email: 'contact@happyfeet.com', phone: '1-333-444-5555', website: 'http://www.happyfeet.com' },
    '8am - 5pm',
    '2100-2300',
    'true',
    6,
    ['Vegetarian'],
    ['Full day', 'Half day']
  );
  console.log('Fifth daycare added:', fifthDaycare);

  console.log('Done seeding database');
} catch (error) {
  console.error('Error during seeding:', error);
} finally {
  await closeConnection();
}
