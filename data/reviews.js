//The id of reviews will be added into users and daycares, and the rating field of daycares will be updated
//1. Add; 2. Get; 3. Update; 4. Remove

import { daycares, reviews, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../validation.js";

const exportedMethods = {
  //1. Add a review, updating 'review[]' of users and daycares
  async addReview(
    daycareId, //Required, objectId or string
    userId, //Required , objectId or string
    rating, //Required, number or string, like '4.5', or 5
    review //Required, string
  ) {
    if (!(daycareId instanceof ObjectId)) {
      daycareId = validation.checkId(daycareId);
      daycareId = new ObjectId(daycareId);
    }
    if (!(userId instanceof ObjectId)) {
      userId = validation.checkId(userId);
      userId = new ObjectId(userId);
    }
    const usersCollection = await users(); //If this user already rated this daycare, throw:
    const user = await usersCollection.findOne({ _id: userId });
    const reviewsCollection = await reviews();
    if (!user) {
      throw `Can't find the user!`;
    }
    if (user.reviews.length !== 0) {
      for (let j = 0; j < user.reviews.length; j++) {
        let userTemp = await reviewsCollection.findOne({
          _id: user.reviews[j],
        });
        console.log(userTemp.daycareId);
        if (userTemp.daycareId.equals(daycareId))
          throw "You have already rated this daycare!";
      }
    }
    rating = validation.checkRating(rating);
    review = validation.isString(review, "Review");

    //Adding this new review into database:
    const createdAt = new Date().toISOString();
    let newReview = {
      daycareId: daycareId,
      userId: userId,
      rating: rating,
      review: review,
      createdAt: createdAt,
    };
    const insertInfo = await reviewsCollection.insertOne(newReview);
    const newReviewId = insertInfo.insertedId;
    if (!newReviewId) throw "Error: Insert failed!";

    //Updating daycares and users database:
    //Update daycares.reviews and calculate daycares.rating first:
    const daycaresCollection = await daycares();
    const daycare = await daycaresCollection.findOne({ _id: daycareId });
    if (!daycare) {
      throw `Can't find the daycare!`;
    }

    if (daycare.rating == 0) {
      const updateReviews = await daycaresCollection.updateOne(
        { _id: daycareId },
        {
          $push: { reviews: newReviewId },
          $set: { rating: rating },
        }
      );
      if (updateReviews.modifiedCount === 0) {
        throw "Could not update daycare reviews";
      }
    } else {
      let sum = rating;
      console.log(sum + "\n");
      for (let i = 0; i < daycare.reviews.length; i++) {
        let newReview = await reviewsCollection.findOne({
          _id: daycare.reviews[i],
        });
        let tempNum = parseFloat(newReview.rating);
        sum += tempNum;
        console.log("for loop " + i + ": " + sum + ".\n");
      }
      let average = sum / (daycare.reviews.length + 1);
      average = Number(average.toFixed(1));
      console.log(average);
      const updateReviews = await daycaresCollection.updateOne(
        { _id: daycareId },
        {
          $push: { reviews: newReviewId },
          $set: { rating: average },
        }
      );
      if (updateReviews.modifiedCount === 0) {
        throw "Could not update daycare reviews";
      }
    }

    //Update the users.reviews:
    const updateUser = await usersCollection.updateOne(
      { _id: userId },
      { $push: { reviews: newReviewId } }
    );
    if (updateUser.modifiedCount === 0) {
      throw "Could not update user reviews";
    }

    return await reviewsCollection.findOne({ _id: newReviewId });
  },

  //2. Search a review by review's id
  async getReviewById(id) {
    if (!(id instanceof ObjectId)) {
      id = validation.checkId(id);
      id = new ObjectId(id);
    }

    const reviewsCollection = await reviews();
    const review = await reviewsCollection.findOne({ _id: id });
    const userId = review.userId;
    const usersCollection = await users(); //If this user already rated this daycare, throw:
    const userInfo = await usersCollection.findOne({ _id: userId });
    const userFirstName = userInfo["firstName"];
    console.log(userInfo);
    if (review == null) {
      throw "Error: No review is fond!";
    }

    const reviewContent = {
      rating: review.rating,
      review: review.review,
      createdAt: review.createdAt,
      userName: userFirstName,
    };

    return reviewContent;
  },

  //3. Update a revew by review's id
  async updateReview(reviewId, rating, review) {
    if (!(reviewId instanceof ObjectId)) {
      reviewId = validation.checkId(reviewId);
      reviewId = new ObjectId(reviewId);
    }
    rating = validation.checkRating(rating);
    review = validation.isString(review, "Review");

    const reviewsCollection = await reviews();
    const reviewInfo = await reviewsCollection.findOne({ _id: reviewId });
    if (!reviewInfo) {
      throw "Error: The updated review is not fond!";
    }

    //Calculate and update the new average rating if needed:
    let oldRating = parseFloat(reviewInfo.rating);
    let average = rating;
    if (oldRating != rating) {
      // Need to upadate the average rating:
      const daycaresCollection = await daycares();
      const daycare = await daycaresCollection.findOne({
        _id: reviewInfo.daycareId,
      });

      if (daycare.reviews.length > 1) {
        let sum = rating;
        for (let i = 0; i < daycare.reviews.length; i++) {
          let newReview = await reviewsCollection.findOne({
            _id: daycare.reviews[i],
          });
          let tempRate = parseFloat(newReview.rating);
          sum += tempRate;
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
          createdAt: new Date().toISOString(),
        },
      }
    );
    if (updateInfo.modifiedCount === 0) {
      throw "Error: Could not update the review!";
    }

    return await reviewsCollection.findOne({ _id: reviewId });
  },

  //4. Remove a revew, also remove this review's id from users and daycares
  async removeReview(id) {
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
    const usersCollection = await users();
    const removeUser = await usersCollection.updateOne(
      { _id: review.userId },
      { $pull: { reviews: id } }
    );
    if (removeUser.modifiedCount === 0) {
      throw "Error: Could not update user reviews!";
    }

    //Delete review from daycares and update the rating:
    const daycaresCollection = await daycares();
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
      if (updateInfo.modifiedCount === 0) {
        throw "Error: Could not update the rating!";
      }
    } else {
      let sum = 0;
      for (let i = 0; i < daycare.reviews.length; i++) {
        let newReview = await reviewsCollection.findOne({
          _id: daycare.reviews[i],
        });
        sum += newReview.rating;
      }
      let newRating = sum / daycare.reviews.length;
      const updateInfo = await daycaresCollection.updateOne(
        { _id: daycare._id },
        { $set: { rating: newRating } }
      );
      if (updateInfo.modifiedCount === 0) {
        throw "Error: Could not update the rating!";
      }
    }
    return { reviewId: id.toString(), deleted: true };
  },
};

export default exportedMethods;
