import daycareFun from "../data/daycares.js";
import validation from '../validation.js';


const exportedMethods = {
    async calculateCost (state, duration, includeLunch,id) {
        let durations = ['half day', 'full day'];
        let cost;
        state = validation.checkState(state);
        if (Array.isArray(duration)) {
            duration = duration[0];
        }
        includeLunch = validation.checkString(includeLunch);
        duration = duration.trim().toLowerCase();
        includeLunch = includeLunch.trim().toLowerCase();
        if (!durations.includes(duration)) {
            throw 'Choose from Half Day or Full Day';
        }
        const daycares = await daycareFun.getState(state);
        if (!id) {
            return daycares;
        }
        if (!daycares || daycares.length === 0) {
            throw 'No daycares for given state';
        }
        const pickedOne = daycares.find(daycare => daycare._id.toString() === id);
        if (!pickedOne) {
            throw 'No daycare not found';
        }
        let daycareOrg = await daycareFun.getOrg(pickedOne._id.toString());
        const name = daycareOrg.name;
        const tuitionRange = daycareOrg.tuitionRange;
        const [minTuition, maxTuition] = tuitionRange.split('-').map(Number);
        const availableDurations = daycareOrg.duration.map(elem => elem.trim().toLowerCase());
        if (!availableDurations.includes(duration)) {
            throw 'No such duration for given daycare';
        }
        if (!daycareOrg.lunchChoices || daycareOrg.lunchChoices.length === 0) {
            throw 'No lunch info for given daycare';
        }
        
        if (duration === 'full day' && includeLunch === 'yes') {
            cost = maxTuition;
        } else if (duration === 'full day' && includeLunch === 'no') {
            cost = maxTuition * 0.9;
        } else if (duration === 'half day' && includeLunch === 'no') {
            cost = minTuition;
        } else if (duration === 'half day') {
            cost = maxTuition * 0.7;
        } else {
            cost = maxTuition;
        }
        return {
            name,
            cost
        };
    }
};

export default exportedMethods;