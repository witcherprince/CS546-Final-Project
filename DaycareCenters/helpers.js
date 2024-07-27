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
        throw 'provide input array'
    }

    if (arr.length === 0) {
        throw 'array must have at least one element'
    }

    let newArr = [];

    arr.forEach(elem => {if (typeof (elem) === 'string') {newArr.push(elem)}})
    if (arr.length !== newArr.length) {
        throw ' One of the elements in the array is not string'
    }

    for (let i = 0; i < arr.length; i++) {

        let elem = arr[i];
    
        let trimElem = elem.trim();
    
        if (trimElem.length === 0) {
          throw 'one of the elements in the array has empty spaces';
        }

        arr[i] = trimElem;
    }


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

