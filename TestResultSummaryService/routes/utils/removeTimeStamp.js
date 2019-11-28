function removeTimeStamp (inputText) {
    return inputText.replace(/\[\d{4}-\d{2}-\d{2}.*?\] /g, "");
}

module.exports.removeTimeStamp = removeTimeStamp;
