//From our database, the id of reviews will be added into users and daycares
//1. Add; 2. Get; 3. Update; 4. Remove

import { reviews, users } from '../config/mongoCollections.js';
import userData from './users.js';
import daycareData from './daycares.js';
import { ObjectId } from 'mongodb';
import validation from '../validation.js';

const exportedMethods = { 
//1. Add a review, updating 'review[]' of users and daycares
  async addReview (
    daycareId, //Required 
    userId, //Required  
    rating, //Required
    review, //Required
  ) { 
    if (!(daycareId instanceof ObjectId)) {
        daycareId = validation.checkId(daycareId);
        daycareId = new ObjectId(daycareId);
    }
    if (!(userId instanceof ObjectId)) {
        userId = validation.checkId(userId);
        userId = new ObjectId(userId);
    }
    rating = validation.checkRating(rating);
    review = validation.checkString(review, 'Review');

    //Adding this new review into database:
    const createdAt = new Date().toISOString();
    let newReview = {
        userId: userId,
        daycareId: daycareId,
        rating: rating,
        review: review,
        createAt: createdAt,
      };
    const reviewsCollection = await reviews();
    const insertInfo = await reviewsCollection.insertOne(newReview);
    const newReviewId = insertInfo.insertedId;
    if (!newReviewId) throw 'Error: Insert failed!';

    //Updating daycares and users database:
    //Update daycares.reviews and calculate daycares.rating first:
    const daycaresCollection = await daycareData.daycares();
    const daycare = await daycaresCollection.findOne({ _id: daycareId});
    if (!daycare) {throw`Can't find the daycare!`;} 

    if (daycare.rating === 0) {
        const updateReviews = await daycaresCollection.updateOne(
        { _id: daycareId },
        {
            $push: { reviews: newReviewId },
            $set: { rating: rating }
        }       
      );
        if (updateReviews.modifiedCount === 0) {throw 'Could not update daycare reviews';}
    } else {
        let sum = rating;
        for (let i = 0; i < daycare.reviews.length; i++) {
          let newReview = reviewsCollection.findOne(daycare.reviews[i])
          sum += newReview.rating;
        }
        let average = sum / updateDaycare.reviews.length;
        average = Number(average.toFixed(1));
        const updateReviews = await daycaresCollection.updateOne(
            { _id: daycareId },
            {
                $push: { reviews: newReviewId },
                $set: { rating: average }
            }       
          );
            if (updateReviews.modifiedCount === 0) {throw 'Could not update daycare reviews';}
    }
  
      //Update the users.reviews:
      const usersCollection = await userData.users();
      const user = await usersCollection.findOne({ _id: userId});
      if (!user) {throw`Can't find the user!`;} 
      const updateUser = await usersCollection.updateOne(
        { _id: userId },
        { $push: { reviews: newReviewId } }
      );
    if (updateUser.modifiedCount === 0) {throw 'Could not update user reviews';}

    return await reviewsCollection.findOne(newReviewId);
  },

//2. Search a review by review's id
  async getReviewById (id) {

  },

//3. Update a revew by review's id
  async updateReview () {

  },

//4. Remove a revew, also remove this review's id from users and daycares
  async removeReview () {

  }

};

export default exportedMethods;
