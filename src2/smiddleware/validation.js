const validatorr = (schemaa) => async (req, res, next) => {
    try {
        console.log("CONATCT");
        const parsebody =await schemaa.parseAsync(req.body);
        req.body=parsebody;
        next();
        
    } catch (err) {
        console.log(err);
        const status = 422;
        const message = "fill the input area";
        const extradetails = err.errors[0].message;

        const errorr={
            status,
            message,
            extradetails
        };
        console.log(errorr);
        next(errorr);


        
    }
};
module.exports=validatorr;