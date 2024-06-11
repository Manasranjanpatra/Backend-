const validator = (schema) => async (req, res, next) => {


    try {
        const logo=!!schema;
        console.log(logo);

        const parsebody = await schema.parseAsync(req.body);//is the frontend value(req.body) is same type as Zodschema
        req.body = parsebody;//then req.body=frontend value(req.body)
        next();

    } catch (error) {
        console.log(error);
        const status = 422;
        const message = "fill the input area";
        console.log(error);
        // const extradetails = error.errors[0].message;
      
        
        // res.status(422).json({  message,extradetails });
        const errorr={
            status,
            message,
            // extradetails
        };
        console.log(errorr);
        next(errorr);


    }

}
module.exports = validator;