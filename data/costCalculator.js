import daycareFun from "../data/daycares.js";
import {ObjectId} from 'mongodb';

import {
  isValidString,
  isValidArray,
  checkState
} from "../helpers.js";

const exportedMethods = {
    async calculateCost (state, duration, includeLunch,daycareId) {

        state = checkState(state);
        duration = Array.isArray(duration) ? duration[0] : duration;
        duration = duration.trim().toLowerCase();
        includeLunch = includeLunch.toLowerCase();

        const validDurations = ['half day', 'full day'];
        if (!validDurations.includes(duration)) {
            throw new Error(`Invalid duration option: ${duration}. Valid options are 'Half Day' or 'Full Day'.`);
        }

        const daycares = await daycareFun.getState(state);
        console.log('Daycares:', daycares);

        if (!daycares || daycares.length === 0) {
            throw new Error('No daycares found in this state');
        }

        if (!daycareId) {
            return daycares;
        }

        const selectedDaycare = daycares.find(daycare => daycare._id.toString() === daycareId);

        if (!selectedDaycare) {
            throw new Error('Selected daycare not found');
        }

        console.log('Processing Daycare:', selectedDaycare);

        let daycareOrg = await daycareFun.getOrg(selectedDaycare._id.toString());
        console.log('DaycareOrg:', daycareOrg);

        const daycareName = daycareOrg.name;
        const tuitionRange = daycareOrg.tuitionRange;
        const [minTuition, maxTuition] = tuitionRange.split('-').map(Number);

        let cost;
        const availableDurations = daycareOrg.duration.map(d => d.trim().toLowerCase());

        if (!availableDurations.includes(duration)) {
            throw new Error(`${daycareName} does not offer ${duration.charAt(0).toUpperCase() + duration.slice(1)} options.`);
        }

        if (!daycareOrg.lunchChoices || daycareOrg.lunchChoices.length === 0) {
            throw new Error(`${daycareName} does not provide lunch information.`);
        }

        if (duration === 'half day' && includeLunch === 'no') {
            cost = minTuition;
        } else if (duration === 'half day') {
            cost = maxTuition * 0.7;
        } else if (duration === 'full day' && includeLunch === 'no') {
            cost = maxTuition * 0.9; 
        } else if (includeLunch === 'no') {
            cost = minTuition;
        } else if (duration === 'full day' && includeLunch === 'yes') {
            cost = maxTuition;
        } else {
            cost = maxTuition
        }

        return {
            daycareName,
            cost
        };
    }
};

export default exportedMethods;