import jwt from "jsonwebtoken";

export const generatedTokenSetCookie = (userId , res) => {
    const token = jwt.sign({userId} , process.env.JWT_SECRET , {
        expiresIn : "1d",
    });

    res.cookie("jwt" , token , {
        maxAge : 1 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevent from the XSS attacks
        sameSite: "strict", // CSRF attacks protection 
        secure: process.env.NODE_ENV !== "development"
    })
}