import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import { daycares } from "../config/mongoCollections.js";
import { reviews } from "../config/mongoCollections.js";
import validation from "../validation.js";
import bcryptjs from "bcryptjs";

//1. Create a user
const exportMethod = {
  async createUser(firstname, lastname, email, password, town, zipcode) {
    // Checking
    firstname = validation.checkString(firstname, "First name");
    lastname = validation.checkString(lastname, "Last name");
    firstname = validation.checkNames(firstname, "First name");
    lastname = validation.checkNames(lastname, "Last name");

    // Check password and then hash it
    password = validation.checkPassword(password, "Password");
    const hash = await bcryptjs.hash(password, 16);

    // Check email
    email = validation.checkEmail(email, "Email");
    email = email.toLowerCase();

    // Check town and zipcode
    town = validation.checkString(town, "Town");
    zipcode = validation.checkNumberZipcode(zipcode);

    const userCollection = await users();

    // Want to make sure we stop a user from creating an account if the email exists already
    const existingUser = await userCollection.findOne({ email: email });
    if (existingUser) {
      throw "User already exists";
    }

    // Create new user
    const newUser = {
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: hash,
      location: { town: town, zipcode: zipcode },
      kids: [],
      favorites: [],
      reviews: [],
      role: "user",
    };

    // Insert info into db
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "Could not add the product.";
    }

    const newId = insertInfo.insertedId.toString();
    const user = await this.getUserById(newId);

    return user;
  },

  //2. Change some user information
  async changeInfo(id, userInfo) {
    id = id.toString();

    // Checking stuff
    id = validation.checkId(id);
    userInfo = validation.isValidObject(userInfo);

    // Fetch current user data
    const userCollection = await users();
    const currentUser = await userCollection.findOne({ _id: new ObjectId(id) });

    const updateUser = {};

    if (userInfo.firstname) {
      updateUser.firstName = validation.checkString(
        userInfo.firstname,
        "First name"
      );
    }

    if (userInfo.lastname) {
      updateUser.lastName = validation.checkString(
        userInfo.lastname,
        "Last name"
      );
    }

    if (userInfo.email) {
      updateUser.email = validation.checkEmail(userInfo.email, "Email");
    }

    if (userInfo.location) {
      updateUser.location = currentUser.location || {};
      if (userInfo.location.town) {
        updateUser.location.town = validation.checkString(
          userInfo.location.town,
          "Town"
        );
      }

      if (userInfo.location.zipcode) {
        updateUser.location.zipcode = validation.checkNumberZipcode(
          userInfo.location.zipcode,
          "Zipcode"
        );
      }
    }

    const updateInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateUser },
      { returnOriginal: false }
    );

    return updateInfo.value;
  },

  //3. Delete user using ID
  async deleteuser(id) {
    // Some checks
    id = id.toString();
    id = validation.checkId(id);

    const userCollection = await users();
    const deletion = await userCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (!deletion) {
      throw "Could not delete user with specified ID.";
    }

    return `${deletion.firstName} has been successfully deleted!`;
  },

  //4. Allow user to change their password
  async changePassword(id, password) {
    // Check ID
    id = id.toString();
    id = validation.checkId(id);

    // Check Password
    password = validation.checkPassword(password, "Password");

    const userCollection = await users();
    const currentUser = await userCollection.findOne({ _id: new ObjectId(id) });

    let comparing = await bcryptjs.compare(password, currentUser.password);

    // Want to throw if the password already exists
    if (comparing) {
      throw "This password is already in use. Please input something else.";
    }

    // Now, if the new password is indeed different, we can change it here
    const hash = await bcryptjs.hash(password, 16);

    const newPass = {
      password: hash,
    };

    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: newPass }
    );

    return "Your password has been successfully changed.";
  },

  //5. Get user by their ID
  async getUserById(id) {
    // Check ID
    id = id.toString();
    id = validation.checkId(id);

    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw "Error: User not found.";
    }

    return user;
  },

  //6. Allow user to add children
  async addChild(id, firstname, lastname, age) {
    // Check ID
    id = id.toString();
    id = validation.checkId(id);

    // Some checks
    firstname = validation.checkString(firstname, "First name");
    lastname = validation.checkString(lastname, "Last name");
    firstname = validation.checkNames(firstname, "First name");
    lastname = validation.checkNames(lastname, "Last name");
    age = validation.checkChildAge(age, "Age");

    const usersCollection = await users();

    const newKidInfo = {
      firstName: firstname,
      lastName: lastname,
      age: age,
    };

    const updateInfo = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { kids: newKidInfo } }
    );
    if (updateInfo.modifiedCount === 0) {
      throw "Could not add child.";
    }

    return newKidInfo;
  },

  //7. Remove a child
  async removeChild(id, name) {
    // Some checks
    id = validation.checkId(id);
    name = validation.checkString(name, "Name");
    name = validation.checkNames(name, "Name");

    const userCollection = await users();
    const byeChild = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { kids: { firstName: name } } }
    );

    if (byeChild.modifiedCount === 0) {
      throw "Child could not be found or removed";
    }

    return `${byeChild.firstName} has been successfully deleted!`;
  },

  //8. Add favorite daycare. When a user clicks on the heart on the daycare page, they will automatically have the daycare's id added to their favorite list
  async addFavDaycare(userId, daycareId) {
    userId = userId.toString();
    daycareId - daycareId.toString();

    // Check IDs
    userId = validation.checkId(userId);
    daycareId = validation.checkId(daycareId);

    const userCollection = await users();
    const daycareCollection = await daycares();

    // First, lets find the user who is doing the search
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw "User not found.";
    }

    // Now we want to search for the daycare id to see if it even exists
    const daycare = await daycareCollection.findOne({
      _id: new ObjectId(daycareId),
    });
    if (!daycare) {
      throw "Daycare not found.";
    }

    // Now, lets check if this user already has this daycare in their favorites list. If not, it will be added
    const isFavorite = await userCollection.findOne({ favorites: daycare });
    if (isFavorite) {
      throw "Daycare already exists in user's favorites list";
    }

    // If we got to this point, user does not have daycare in their list. Now we can add it
    const addFavorite = userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { favorites: new ObjectId(daycareId) } }
    );
    if (addFavorite.modifiedCount === 0) {
      throw "Daycare could not be found or removed";
    }

    // The below is causing some type of race condition when you try to favorite and unfavorite a few times
    // Given that nothing depends on the return for this, I think it can be removed since commenting it out fixes the issue

    // const newId = daycareId.toString();
    // const favDaycare = await this.getFavDayCare(newId);

    return "daycare successfully added to favorites!";
  },

  //9. Get favorite daycares of user
  async getFavDayCare(id) {
    // Check ID
    id = id.toString();
    id = validation.checkId(id);

    // Find the daycare through given ID
    const usersCollection = await users();
    const favDaycare = await usersCollection.findOne({
      favorites: new ObjectId(id),
    });

    if (!favDaycare) {
      throw "Error: Daycare not found.";
    }

    return favDaycare;
  },

  //10. Getting all the daycares !!
  async getAllDaycares(userId) {
    // check ID
    userId = userId.toString();
    userId = validation.checkId(userId);

    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    return user.favorites;
  },

  //11. Remove daycare
  async removeFavDaycare(userId, daycareId) {
    userId = userId.toString();
    daycareId = daycareId.toString();

    // Check ID
    userId = validation.checkId(userId);
    daycareId = validation.checkId(daycareId);

    // Time to remove
    const usersCollection = await users();
    const delDaycare = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { favorites: new ObjectId(daycareId) } }
    );

    if (delDaycare.modifiedCount === 0) {
      throw "Error: Could not remove daycare from favorites.";
    }

    return "Successfully deleted daycare!!";
  },

  //12. Logging in user verification
  async loginUser(email, password) {
    if (!email) {
      throw new Error("Must provide an email.");
    }
    if (!password) {
      throw new Error("Must provide a password.");
    }
    if (!validation.validateEmail(email)) {
      throw new Error("Invalid email provided.");
    }

    const formattedEmail = email.trim().toLowerCase();
    const userCollection = await users();
    const resp = await userCollection.findOne({ email: formattedEmail });

    if (!resp) {
      throw new Error("Either the email address or password is invalid");
    } else {
      const dbPassword = resp["password"];

      let passwordCompare = false;

      passwordCompare = await bcryptjs.compare(password, dbPassword);

      if (passwordCompare) {
        const respObj = {};
        respObj["id"] = resp["_id"];
        respObj["firstName"] = resp["firstName"];
        respObj["lastName"] = resp["lastName"];
        respObj["emailAddress"] = resp["emailAddress"];
        respObj["role"] = resp["role"];
        return respObj;
      } else {
        throw new Error("Either the email address or password is invalid");
      }
    }
  },
};

export default exportMethod;
