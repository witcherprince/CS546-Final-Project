//The id of reviews will be added into users and daycares, and the rating field of daycares will be updated
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
        createdAt: createdAt,
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
          let newReview = await reviewsCollection.findOne({ _id: daycare.reviews[i]})
          sum += newReview.rating;
        }
        let average = sum / (daycare.reviews.length + 1);
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

    return await reviewsCollection.findOne({ _id: newReviewId});
  },

//2. Search a review by review's id
  async getReviewById (id) {
    if (!(id instanceof ObjectId)) {
        id = validation.checkId(id);
        id = new ObjectId(id);
    }

    const reviewsCollection = await reviews();
    const review = await reviewsCollection.findOne({ _id: id });

    if (review == null) {
        throw "Error: No review is fond!";
      }
      
    const reviewContent = {
        rating: review.rating,
        review: review.review,
        createdAt: review.createdAt
    };

    return reviewContent;
  },

//3. Update a revew by review's id
  async updateReview (
    reviewId,
    rating, 
    review
  ) {
    if (!(reviewId instanceof ObjectId)) {
        reviewId = validation.checkId(reviewId);
        reviewId = new ObjectId(reviewId);
    }
    rating = validation.checkRating(rating);
    review = validation.checkString(review, 'Review');

    const reviewsCollection = await reviews();
    const review = await reviewsCollection.findOne({ _id: reviewId });  
    if (!review) {throw 'Error: The updated review is not fond!';} 
    
    //Calculate and update the new average rating if needed:
    let oldRating = review.rating;
    let average = rating;
    if (oldRating != rating) {// Need to upadate the average rating:
        const daycaresCollection = await daycareData.daycares();
        const daycare = await daycaresCollection.findOne({ _id: review.daycareId});

        if (daycare.reviews.length > 1) {
            let sum = rating;
            for (let i = 0; i < daycare.reviews.length; i++) {
              let newReview = await reviewsCollection.findOne({ _id: daycare.reviews[i]})
              sum += newReview.rating;
            }
            sum = sum - oldRating;
            average = sum / daycare.reviews.length;
            average = Number(average.toFixed(1));
            }
        
        const updateInfo = await daycaresCollection.updateOne(
            { _id: daycare._id },
            { $set: { rating: average } }
        );

        if (updateInfo.modifiedCount === 0) {
            throw "Error: Could not update daycare rating!";
        }
    }

    //Update the review
    const updateInfo = await reviewsCollection.updateOne(
        { _id: reviewId },
        {
            $set: {
                rating: rating,
                review: review,
                createdAt: new Date().toISOString()
            }
        }
    );
    if (updateInfo.modifiedCount === 0) {
        throw "Error: Could not update the review!";
    }

    return await reviewsCollection.findOne({ _id: reviewId });
  },

//4. Remove a revew, also remove this review's id from users and daycares
  async removeReview (id) {
    if (!(id instanceof ObjectId)) {
        id = validation.checkId(id);
        id = new ObjectId(id);
    }
    const reviewsCollection = await reviews();
    const review = await reviewsCollection.findOne({ _id: id });
    if (!review) {
        throw "Error: No review is found!";
    }

    const removeInfo = await reviewsCollection.deleteOne({ _id: id });
    if (removeInfo.deletedCount === 0) {
        throw "Error: Could not delete the review!";
    }

    //Delete review from users:
    const usersCollection = await userData.users();
    const removeUser = await usersCollection.updateOne(
        { _id: review.userId },
        { $pull: { reviews: id } }
    );
    if (removeUser.modifiedCount === 0) {
        throw "Error: Could not update user reviews!";
    } 

    //Delete review from daycares and update the rating:
    const daycaresCollection = await daycareData.daycares();
    const removeDaycare = await daycaresCollection.updateOne(
        { _id: review.daycareId },
        { $pull: { reviews: id } }
    );
    if (removeDaycare.modifiedCount === 0) {
        throw "Error: Could not update daycare reviews!";
    }

    const daycare = await daycaresCollection.findOne({ _id: review.daycareId });
    if (daycare.reviews.length === 0) {
        const updateInfo = await daycaresCollection.updateOne(
            { _id: daycare._id },
            { $set: { rating: 0 } }
        );
        if (updateInfo.modifiedCount === 0) { throw "Error: Could not update the rating!";}
    } else {
        let sum = 0;
        for (let i = 0; i < daycare.reviews.length; i++) {
            let newReview = await reviewsCollection.findOne({ _id: daycare.reviews[i]})
            sum += newReview.rating;
          }
        let newRating = sum / daycare.reviews.length;
        const updateInfo = await daycaresCollection.updateOne(
            { _id: daycare._id },
            { $set: { rating: newRating } }
        );
        if (updateInfo.modifiedCount === 0) { throw "Error: Could not update the rating!";}  
    }    
    return { reviewId: id.toString(), deleted: true };
  }

};

export default exportedMethods;
