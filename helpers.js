// You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
export function isValidString(str) {
    if (typeof str != 'string') {
        throw 'provide input string'
    }

    if (str.trim().length == 0) {
        throw 'String should not have empty spaces'
    }
}


export function isValidArray(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('Provide input array');
    }

    if (arr.length === 0) {
        throw new Error('Array must have at least one element');
    }

    let newArr = arr.map(elem => {
        if (typeof elem !== 'string') {
            throw new Error('One of the elements in the array is not a string');
        }
        return elem.trim();
    });

    newArr.forEach(elem => {
        if (elem.length === 0) {
            throw new Error('One of the elements in the array has empty spaces');
        }
    });

    newArr.forEach(elem => {
        if (elem.includes(',')) {
            throw new Error('Elements should not contain commas');
        }
    });

    return newArr;
}


export function isProperId(id) {
    
    if (!id) throw 'Error: You must provide an id to search for';
    if (typeof id !== 'string') throw 'Error: id must be a string';
    id = id.trim();
    if (id.length === 0)
      throw 'Error: id cannot be an empty string or just spaces';
    if (!isNaN(id))
      throw `input is not a valid value`;

    return id;
}

export function isValidWebsite(website) {

    website = website.replace(/\s+/g, '');

    let intro = website.startsWith("http://www.");
    let end = website.endsWith(".com");

    if (!intro || !end) {
        throw 'provided website should start with http://www. and end with .com';
    }

}

export function isValidBoolean(input) {

    if (typeof input !== 'boolean') {
        throw 'provide input boolean'
    }
}

export function isValidDate(date) {

    const dateValidate = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;
    if (!dateValidate.test(date)) {
        throw 'date must be a valid date in mm/dd/yyyy format';
    }

}

export function isValidObject(obj) {

    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
        throw 'provide input object'
    }
}

export function isValidNumber(num) {

    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
        throw 'provide input number'
    }
}

export function isValidZip(num) {

    let zipcodeRegex = /^[0-9]{5}$/;

    if (!zipcodeRegex.test(location.zipcode)) {
        throw 'Zipcode must be a 5-digit number';
    }
}

export function isValidPhone(input) {
    let phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(input)) {
      throw 'Phone number must be a 10-digit number';
    }
};

export function isValidEmail(email) { //what if the email ends with .edu?

    let regex = /^[^\s@]+@[^\s@]+\.(com)$/;
    if (!regex.test(email)) {
        throw 'provide valid email';
    }
}

export function checkState(state) {
    const validState = new Set([
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY",
    ]);

    state = state.toUpperCase().trim();
    if (!validState.has(state)) {
      throw "Error: Not valid state!";
    }

    return state;
  }

  export function checkBusinessHour(time) {
    if (typeof time !== "string") {
      throw "Error: Business hours must be a string!";
    }

    // corrected timeForm to timeRangeRegex
    const timeRangeRegex =
      /^(1[0-2]|[1-9]):[0-5][0-9] (AM|PM) - (1[0-2]|[1-9]):[0-5][0-9] (AM|PM)$/;
    time = time.trim();
    if (timeRangeRegex.test(time)) {
      throw "Error: Not valid business hour!";
    }
    return time;
  }

  export function checkBoolean(input, inputName) {
    input = input.trim().toLowerCase();
    if (input !== "true" && input !== "false") {
      throw `${inputName} has to be true or false!`;
    }
    return input;
  }

  export function isValidPassword(input) {

    if (typeof input != 'string') {
        throw 'provide input string'
    }

    if (input.trim().length == 0) {
        throw 'string should not have empty spaces'
    }

    if (input.length < 8) {
        throw 'password should be at least 8 characters long'
    }

    let re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>?/\\|`~]).{8,}$/;
    if (!re.test(input)) {
        throw 'provide at least one uppercase case, number and special charachter'
    } 
}

//Check if input is a string:
export function isString(val, valName) {
    if (!val) throw `You must provide a ${valName}`;
    if (typeof val !== "string") throw `${valName} must be a string`;
    val = val.trim();
    if (val.length === 0)
      throw `${valName} cannot be an empty string or just spaces`;
    if (!isNaN(val))
      throw `${val} is not a valid value for ${valName} as it only contains digits`;

    return val;
  }

//Check if the input is 12345, or 12345-1234, return valid trim() zipcode
export function checkZipcode(zipcode) {
    const zipcodeForm = /^\d{5}(-\d{4})?$/;
    zipcode = zipcode.trim();
    if (!zipcodeForm.test(zipcode)) {
      throw "Error: Not a valid zip code!";
    }
    return zipcode;
  }

//Check and return a trim email
export function checkEmail(email) { 
    const emailForm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    email = email.trim();
    if (!emailForm.test(email)) {
      throw "Error: Not a valid email!";
    }
    return email;
  }

//Check if the phone is 1-123-456-7890 or 123-456-7890
export function checkPhone(num) {
    const phoneForm = /^(1-)?\d{3}-\d{3}-\d{4}$/;
    num = num.trim();
    if (!phoneForm.test(num)) {
      throw "Error: Not a valid phone number!";
    }
    return num;
  }

//Check and return a trim valid website
export function checkWebsite(web) {
    const webForm = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    web = web.trim();
    if (!webForm.test(web)) {
      throw "Error: Not a valid website!";
    }
    return web;
  }

//Check and return num
export function checkNumber(num, numName) {
    // num = num.trim(); cannot trim type of number
    let number = Number(num);
    if (!Number.isInteger(number) || number < 0) {
      throw `${numName} has to be a positive integer!`;
    }
    return num;
  }

export function checkPassword(val, valName) {
    if (!val) throw `You must provide a ${valName}`;
    if (typeof val !== "string") throw `${valName} must be a string`;
    val = val.trim();
    if (val.length === 0)
      throw `${valName} cannot be an empty string or just spaces`;
    if (val.length < 8)
      throw `${valName} should be at least 8 characters long.`;

    // Other types of checks
    if (!/[A-Z]/.test(val))
      throw `${valName} should have at least one uppercase letter.`;

    if (!/[0-9]/.test(val)) throw `${valName} should have at least one number.`;

    if (!/[^a-zA-Z0-9]/.test(val))
      throw `${valName} should have at least one special character.`;

    return val;
  }

