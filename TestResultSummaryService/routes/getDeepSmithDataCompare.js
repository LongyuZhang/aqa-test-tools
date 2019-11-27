// const { TestResultsDB, ObjectID } = require( '../Database' );
module.exports = async ( req, res ) => {
    // const query = req.body.query;
    // const specification = req.body.specification;
    // const db = new TestResultsDB();
    // const result = await db.getSpecificData( query, specification );
    console.log(req);
    // console.log(req.rawBody);
    // console.log(req.body);
    const result = "GREAT!\n";
    res.send( result );
} 