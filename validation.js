import {ObjectId} from 'mongodb';

const exportedMethods = {

// Check ID
checkId(id) {
    if (!id) throw 'You must provide an id';
    if (typeof id !== 'string') throw 'ID must be a string';
    id = id.trim();
    if (id.length === 0) {
        throw 'Id cannot be an empty string or just spaces';
    }
    if (!ObjectId.isValid(id)) throw `Invalid object ID`;
    return id;
},

// Check String
checkString(val, valName) {
    if (!val) throw `You must provide a ${valName}`;
    if (typeof val !== 'string') throw `${valName} must be a string`;
    val = val.trim();
    if (val.length === 0) throw `${valName} cannot be an empty string or just spaces`;
    if (!isNaN(val)) throw `${val} is not a valid value for ${valName} as it only contains digits`

    return val;

},

// Check if email is valid
checkEmail(val, valName) {

}

}

export default exportedMethods;