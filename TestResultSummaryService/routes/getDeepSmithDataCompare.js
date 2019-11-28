const JenkinsInfo = require( '../JenkinsInfo' );
const {removeTimeStamp} = require( './utils/removeTimeStamp' );
const {applyDeepSmithMatch} = require( './utils/applyDeepSmithMatch' );

module.exports = async ( req, res ) => {
    const { url, buildName1, buildNum1, buildName2, buildNum2 } = req.query;
    const jenkinsInfo = new JenkinsInfo();

    let consoleOutput1 = await jenkinsInfo.getBuildOutput(url, buildName1, buildNum1);
    let outputWithoutTimeStamp1 = removeTimeStamp(consoleOutput1);
    let outputWithApplyDeepSmithMatch1 = applyDeepSmithMatch(outputWithoutTimeStamp1);
    
    let consoleOutput2 = await jenkinsInfo.getBuildOutput(url, buildName2, buildNum2);
    let outputWithoutTimeStamp2 = removeTimeStamp(consoleOutput2);
    let outputWithApplyDeepSmithMatch2 = applyDeepSmithMatch(outputWithoutTimeStamp2);
    
    // compare two processed console outputs and send back to Jenkins
    const result = (outputWithApplyDeepSmithMatch1 === outputWithApplyDeepSmithMatch2); 
    res.send( { result } );
} 
