const {removeTimeStamp} = require( './utils/removeTimeStamp' );
const {applyDeepSmithMatch} = require( './utils/applyDeepSmithMatch' );

module.exports = async ( req, res ) => {
    // const query = req.body.query;
    // const specification = req.body.specification;
    // const db = new TestResultsDB();
    // const result = await db.getSpecificData( query, specification );
    outputWithoutTimeStamp = removeTimeStamp(req.body);
    outputWithApplyDeepSmithMatch = applyDeepSmithMatch(outputWithoutTimeStamp);
    console.log(outputWithApplyDeepSmithMatch);
    // console.log(req.rawBody);
    // console.log(req.body);
    const result = "GREAT!\n";
    res.send( result );
} 