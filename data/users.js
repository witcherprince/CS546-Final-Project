import {ObjectId} from 'mongodb';
import validation from '../validation.js'

// First, we want to create a user
const exportMethod = {
async createUser (firstname,
                lastname,
                email,
                password,
                town,
                zipcode
) {

const newUswr = {
    firstName: firstname,
    lastName: lastname,
    email: email,
    password: password,
    location: {town: town, zipcode: zipcode},
    kids: [],
    favorite: [],
    reviews: []
}

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

},

// If they want to add a child
async addChild (firstname,
                lastname,
                age
) {

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