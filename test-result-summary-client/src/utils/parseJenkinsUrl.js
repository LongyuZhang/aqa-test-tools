export const parseJenkinsUrl = (jenkinsUrl, type) => {
    let parsedRes = { errorMsg: "",serverUrl: "", buildName: "", buildNum: ""};
    if (!jenkinsUrl) {
        parsedRes.errorMsg = "Please provide build URL."
        return parsedRes;
    }
    let parsedParams = jenkinsUrl.split("/");

    // Find the index for the top level "job" path in the Jenkins URLs given.
    // This is to support comparing the following equivalent Jenkins job URLs:
    // https://customJenkinsServer/view/PerfTests/job/Daily-Liberty-DayTrader3/155/
    // https://customJenkinsServer/job/Daily-Liberty-DayTrader3/155/
    try {
        parsedRes.serverUrl = parsedParams[0] + "//" + parsedParams[2];
        const jobPosInParsedParams = parsedParams.indexOf("job");
        if (jobPosInParsedParams > 0 && jobPosInParsedParams < parsedParams.length - 2) {
            parsedRes.buildName = parsedParams[jobPosInParsedParams + 1];
            parsedRes.buildNum = parsedParams[jobPosInParsedParams + 2];
        } else {
            throw new Error("error");
        }
    } catch(error) {
        parsedRes.errorMsg = "Invalid " + type + " Build URL."
    }
    return parsedRes;
};