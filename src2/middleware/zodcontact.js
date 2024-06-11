const  z  = require('zod');





const contactform = z.object({
    Name: z
    .string({ required_error: "Nname is required" })
    .trim()
    .min(3, { message: "Nkame  must be have 3char" }),

    Email: z
        .string({ required_error: "enmail is required" })
        .trim()
        .email({ message: "invaid email" })
        .min(3, { message: "Email  must be have 7char" })
        .max(100, { message: "should be 15" }),

    Message: z
        .string({ required_error: "mnessage is required" })
        .trim()
        .min(3, { message: "message  must be have 4char" }),

});


module.exports =  contactform;