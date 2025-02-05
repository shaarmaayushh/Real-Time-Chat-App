// import { error } from "console";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generatedTokenSetCookie } from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";


export const signup = async (req , res) => {
    try{
        const {fullname , email , password} = req.body;

        if (password.length < 6){
            return res.status(400).json({error : "Password must be atleast 6 character !"});
        }
        
        const user = await User.findOne({email});

        if(user) {
            return res.status(400).json({error : "Email is already Used !"});
        }

        // Hashed password 

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        const newUser = new User({
            fullname  :fullname,
            email : email,
            password : hashedPassword,
        })

        if (newUser){
            // Generate the jwt token!

            generatedTokenSetCookie(newUser._id , res);

            await newUser.save()

            res.status(201).json({
                _id : newUser._id,
                fullname : newUser.fullname,
                email : newUser.email,
                profilePic : newUser.profilePic
            })
        }else{
            res.status(400).json({error : "Invalid user details !"});
        }

    }catch(error){
        console.log("Error in the signup controller" , error.message);
        res.status(500).json({error : "Internal Server Error"})
    }
}

export const login = async (req , res) => {
    try {
        const {email , password} = req.body;

        const user = await User.findOne({email});
        const isPasswordCorrect = await bcrypt.compare(password , user?.password || "");

        if ( !user || !isPasswordCorrect){
            return res.status(400).json({error : "Invalid credentials"})
        }

        generatedTokenSetCookie(user._id , res);

        res.status(201).json({
            _id : user._id,
            fullname : user.fullname,
            email : user.email,
            profilePic: user.profilePic
        });
        
    } catch (error) {
        console.log("Error in the login controller" , error.message);
        res.status(500).json({error : "Internal Server Error"})
    }
}

export const logout = (req , res) => {
    try {
        res.cookie("jwt" , "" , {maxAge:  0});
        res.status(200).json({message : "Logout successfully"});
    } catch (error) {
        console.log("Error in the logout controller" , error.message);
        res.status(500).json({error : "Internal Server Error"})
    }
}

export const updateProfile = async (req , res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id        

        if(!profilePic){
            return res.status(400).json({message : "Profile Picture is Needed!"});
        }

        const uploadRes = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId , {profilePic : uploadRes.secure_url} , {new:true})
        
        res.status(200).json({
            updatedUser
        })
        
    } catch (error) {
        console.log("Error in the updateProfile controller" , error.message);
        res.status(500).json({error : "Internal Server Error"})
    }
}

export const checkAuth =  (req , res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in the checkAuth controller" , error.message);
        res.status(500).json({error : "Internal Server Error"})
    }
}