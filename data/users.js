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
firstname = validation.checkString(firstname, 'First name');
lastname = validation.checkString(lastname, 'First name');

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

id = id.toString();
id = validation.checkId(id);

const userCollection = await users();
const deletion = await userCollection.findOneAndDelete({_id: new ObjectId(id)});

if (!deletion) {
    throw 'Could not delete user with specified ID.'
}

return `${deletion.firstName} has been successfully deleted!`;

},

// Change user information
async changeInfo (id, userInfo) {

id = validation.checkId(id);

if (userInfo.firstName) {
    userInfo.firstName = validation.checkString(
        userInfo.firstname, 'First name'
    )
}

if (userInfo.lastName) {
    userInfo.lastName = validation.checkString(
        userInfo.lastName, 'Last name'
    )
}

if (userInfo.email) {
    userInfo.email = validation.checkEmail(
        userInfo.email, 'Email'
    )
}

if (userInfo.password) {

}

// might need to do a deeper search?
if (userInfo.location.town) {
    userInfo.location.town = validation.checkString(
        userInfo.location.town, "Town"
    )
}

if (userInfo.location.zipcode) {
    userInfo.location.zipcode = validation.checkZipcode(
        userInfo.location.zipcode, "Zipcode"
    )

}

const userCollection = await users();
const updateInfo = await userCollection.findOneAndUpdate({_id: new ObjectId(id)});
if (!updateInfo) {
    throw 'Error: Update failed, could not find user with specified ID.'
}

return updateInfo;

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

const updateInfo = await usersCollection.updateOne({_id: new ObjectId(id)}, {$push: {kids: newKidInfo}});
if (updateInfo.modifiedCount === 0) {
    throw 'Could not add child.';
  }

return newKidInfo;


},

// If they want to remove a child
async removeChild (id, name) {

const userCollection = await users();
const byeChild = await userCollection.updateOne({_id: new ObjectId(id)}, {$pull: {kids: {firstName: name}}});

if (byeChild.modifiedCount === 0) {
    throw 'Child could not be found or removed'
 }

return `${byeChild.firstName} has been successfully deleted!`;

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