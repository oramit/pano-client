exports.isInputValid = (data) => {
    return Array.isArray(data);
};

exports.allInputsCalculated = (accumulatedRequests, totalInputsToCalc) => {
    return Object.values(accumulatedRequests)
        .filter(resEntry => resEntry && resEntry.result).length === totalInputsToCalc;
};

exports.parseFinalResults = (accumulatedRequests) => {
    return Object.values(accumulatedRequests).reduce((ret, curr) => {
        ret[curr.input] = curr.result;
        return ret;
    }, {});
};

