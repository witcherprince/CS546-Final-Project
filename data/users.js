import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js';
import validation from '../validation.js'
import bcrypt from 'bcrypt';

// First, we want to create a user
const exportMethod = {
async createUser (firstname,
                lastname,
                email,
                password,
                town,
                zipcode
) {

// Checking
firstname = validation.checkString(firstname);
lastname = validation.checkString(lastname);

// Lets hash the password entered
const hash = await bcrypt.hash(password, 10);

const userCollection = await users();

// Create new user
const newUser = {
    firstName: firstname,
    lastName: lastname,
    email: email,
    password: hash,
    location: {town: town, zipcode: zipcode},
    kids: [],
    favorites: [],
    reviews: []
}

// Insert info into db
const insertInfo = await userCollection.insertOne(newUser);
if (!insertInfo.acknowledged || !insertInfo.insertedId) {
  throw 'Could not add the product.';
}

const newId = insertInfo.insertedId.toString();
const prod = await this.getUserById(newId);

return prod;

},

// Delete user

async deleteuser (id) {

},

// Change user information
async changeInfo () {

},

// Get user by their username
async getUser (username) {

},

// Get user by their ID
async getUserById (id) {

id = validation.checkId(id);

const usersCollection = await users();
const user = await usersCollection.findOne({_id: new ObjectId(id)});
    
if (!user) {
    throw 'Error: User not found.';
    }

return user;

},

// If they want to add a child
async addChild (id,
                firstname,
                lastname,
                age
) {

id = id.toString();

// Check ID
id = validation.checkId(id);

const usersCollection = await users();
    
const newKidInfo = {
    firstName: firstname,
    lastName: lastname,
    age: age
}

let kidArray = [];

kidArray.push(newKidInfo);

const newKid = {
    kids: kidArray
}

const updateInfo = await usersCollection.updateOne({_id: new ObjectId(id)}, {$set: newKid});
if (updateInfo.modifiedCount === 0) {
    throw 'Could not add child.';
  }

return newKid;


},

// If they want to remove a child
async removeChild (name) {

},

// Add favorite daycare
async addFavDaycare () {

},

async removeFavDaycare () {

},

// Add review
async addReview () {

},

// Delete review
async deleteReview () {

}

}

export default exportMethod;