const { z } = require('zod');





const login = z.object({
    email: z
        .string({ required_error: "email is required" })
        .trim()
        .email({ message: "invaid email" })
        .min(3, { message: "Email  must be have 7char" })
        .max(100, { message: "should be 15" }),

    password: z
        .string({ required_error: "pasword is required" })
        .trim()
        .min(3, { message: "password  must be have 4char" }),

});


module.exports =  login;