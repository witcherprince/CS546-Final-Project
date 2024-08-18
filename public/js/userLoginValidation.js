const checkString = (val, valName) => {
  if (!val) throw `You must provide a ${valName}`;
  if (typeof val !== "string") throw `${valName} must be a string`;
  val = val.trim();
  if (val.length === 0)
    throw `${valName} cannot be an empty string or just spaces`;
  if (!isNaN(val))
    throw `${val} is not a valid value for ${valName} as it only contains digits`;

  return val;
};

const checkNames = (val, valName) => {
  if (val.length < 2) throw `${valName} should be at least 2 characters long`;
  if (val.length > 25)
    throw `${valName} should not be greater than 25 characters long`;

  return val;
};

const checkPassword = (val, valName) => {
  if (!val) throw `You must provide a ${valName}`;
  if (typeof val !== "string") throw `${valName} must be a string`;
  val = val.trim();
  if (val.length === 0)
    throw `${valName} cannot be an empty string or just spaces`;
  if (val.length < 8) throw `${valName} should be at least 8 characters long.`;

  // Other types of checks
  if (!/[A-Z]/.test(val))
    throw `${valName} should have at least one uppercase letter.`;

  if (!/[0-9]/.test(val)) throw `${valName} should have at least one number.`;

  if (!/[^a-zA-Z0-9]/.test(val))
    throw `${valName} should have at least one special character.`;

  return val;
};

const checkEmail = (email) => {
  const emailForm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  email = email.trim();
  if (!emailForm.test(email)) {
    throw "Error: Not a valid email!";
  }
  return email;
};

const checkNumberZipcode = (zipcode) => {
  const zipcodeForm = /^\d{5}(-\d{4})?$/;
  zipcode = zipcode.toString().trim();
  if (!zipcodeForm.test(zipcode)) {
    throw "Error: Not a valid zip code!";
  }
  zipcode = Number(zipcode);
  return zipcode;
};

// Here we want to complete the DOM
const loginForm = document.getElementById("login");
const registerForm = document.getElementById("registration");

if (loginForm) {
  const emailInfo = document.getElementById("emailaddress");
  const passInfo = document.getElementById("passwordInput");
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const errorElem = document.querySelector(".error");
    if (errorElem) {
      errorElem.remove();
    }

    let isValid = true;

    try {
      // Get values
      let emailValue = emailInfo.value.trim();
      let passValue = passInfo.value.trim();

      if (emailValue) {
        // Check email
        emailValue = checkEmail(emailValue);
        emailValue = emailValue.toLowerCase();
      } else {
        throw "You need to provide an email address.";
      }

      if (passValue) {
        // Check password
        passValue = checkPassword(passValue, "Password");
      } else {
        throw "You need to provide a password.";
      }
    } catch (error) {
      isValid = false;
      const errorMsg = document.createElement("p");
      errorMsg.innerHTML = "";
      errorMsg.className = "error";
      errorMsg.textContent = error;
      loginForm.appendChild(errorMsg);
    }

    if (isValid) {
      loginForm.submit();
    }
  });
}

// Register form
// Create a function that will help with setting errors after the text field
function setError(element, message) {
  // Create error message
  const errorMsg = document.createElement("p");
  errorMsg.className = "error";
  errorMsg.textContent = message;

  // Remove any existing error message
  const existingError = element.nextElementSibling;
  if (existingError && existingError.className === "error") {
    existingError.remove();
  }

  // Insert the new error message after the input field
  element.parentNode.insertBefore(errorMsg, element.nextSibling);
}

if (registerForm) {
  const emailInfo = document.getElementById("emailaddress");
  const passInfo = document.getElementById("passwordInput");
  const confirmPass = document.getElementById("confirmPasswordInput");
  const nameFirst = document.getElementById("firstnameInput");
  const nameLast = document.getElementById("lastnameInput");
  const townInfo = document.getElementById("townInput");
  let zipcodeInfo = document.getElementById("zipcodeInput");
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    document
      .querySelectorAll(".error")
      .forEach((errorElem) => errorElem.remove());

    let isValid = true;

    // Get values
    const emailValue = emailInfo.value.trim();
    const passValue = passInfo.value.trim();
    const nameFirstVal = nameFirst.value.trim();
    const nameLastVal = nameLast.value.trim();
    const townValue = townInfo.value.trim();
    const zipcodeValue = zipcodeInfo.value.trim();
    const confirmPassVal = confirmPass.value.trim();

    try {
      // Check first name
      if (nameFirstVal) {
        if (nameFirstVal.length === 0) {
          setError(nameFirst, "Name cannot be an empty string or just spaces.");
          isValid = false;
        }

        if (!isNaN(nameFirstVal)) {
          setError(nameFirst, "Name is not valid as it only contains digits");
          isValid = false;
        }

        if (nameFirstVal.length <= 2) {
          setError(nameFirst, "Name must be greater than 2 characters.");
          isValid = false;
        }
        if (nameFirstVal.length > 25) {
          setError(
            nameFirst,
            "Name should not be greater than 25 characters long."
          );
          isValid = false;
        }
      } else {
        setError(nameFirst, "Please provide your first name.");
        isValid = false;
      }

      // Check last name
      if (nameLastVal) {
        if (nameLastVal.length === 0) {
          setError(nameLast, "Name cannot be an empty string or just spaces.");
          isValid = false;
        }

        if (!isNaN(nameLastVal)) {
          setError(nameLast, "Name is not valid as it only contains digits");
          isValid = false;
        }

        if (nameLastVal.length <= 2) {
          setError(nameLast, "Name must be greater than 2 characters.");
          isValid = false;
        }
        if (nameLastVal.length > 25) {
          setError(
            nameLast,
            "Name should not be greater than 25 characters long."
          );
          isValid = false;
        }
      } else {
        setError(nameLast, "Please provide your last name.");
        isValid = false;
      }

      // Check email
      if (emailValue) {
        const emailForm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailForm.test(emailValue)) {
          setError(
            emailInfo,
            "Email address needs to have an @ and end with .com."
          );
          isValid = false;
        }
      } else {
        setError(emailInfo, "You need to provide an email address.");
        isValid = false;
      }

      // Check password
      if (passValue) {
        if (passValue.length === 0) {
          setError(passInfo, "Password cannot be an empty or just spaces.");
          isValid = false;
        }
        if (passValue.length < 8) {
          setError(passInfo, "Password should be at least 8 characters long.");
          isValid = false;
        }

        if (!/[A-Z]/.test(passValue)) {
          setError(
            passInfo,
            "Password should have at least one uppercase letter."
          );
          isValid = false;
        }

        if (!/[0-9]/.test(passValue)) {
          setError(passInfo, "Password should have at least one number.");
          isValid = false;
        }

        if (!/[^a-zA-Z0-9]/.test(passValue)) {
          setError(
            passInfo,
            "Password should have at least one special character."
          );
          isValid = false;
        }
      } else {
        setError(passInfo, "You need to provide a password.");
        isValid = false;
      }

      // Check confirm password
      if (confirmPassVal) {
        if (passValue !== confirmPassVal) {
          setError(confirmPass, "Password does not match.");
          isValid = false;
        }
      } else {
        setError(confirmPass, "Please confirm your password.");
        isValid = false;
      }

      // Check town
      if (townValue) {
        if (townValue.length === 0) {
          setError(townInfo, "Town cannot be an empty string or just spaces.");
          isValid = false;
        }

        if (!isNaN(townValue)) {
          setError(townInfo, "Town is not valid as it only contains digits");
          isValid = false;
        }
        console.log("noice");
      } else {
        setError(townInfo, "Please provide a town.");
        isValid = false;
      }

      // Check zipcode
      if (zipcodeValue) {
        const zipcodeForm = /^\d{5}(-\d{4})?$/;
        if (!zipcodeForm.test(zipcodeValue)) {
          setError(
            zipcodeInfo,
            "Not a valid zip code. Should be five characters long."
          );
          isValid = false;
        }
        zipcodeInfo = Number(zipcodeInfo);
      } else {
        setError(zipcodeInfo, "Please provide a zipcode.");
        isValid = false;
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      isValid = false;
    }

    if (isValid) {
      registerForm.submit();
    }
  });
}
