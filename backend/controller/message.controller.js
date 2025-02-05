import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../model/message.js";
import User from "../model/user.model.js";
import cloudinary from "../utils/cloudinary.js";

export const sendMessage = async (req , res) => {
    try {
        const {text , image} = req.body;
        const {id : receiverId} = req.params;
        const senderId = req.user._id

        let imageUrl = "";

        if(image){
            const uploadRes = await cloudinary.uploader.upload(image)
            imageUrl = uploadRes.secure_url;
        }

        const newMessage = new Message({
            senderId : senderId,
            receiverId : receiverId,
            text: text,
            image : imageUrl,
        })

        await newMessage.save();

        // todo : realtime functionality goes here => socket.io and this is what i am talking about man.
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage" , newMessage)
        }

        res.status(201).json({
            newMessage
        })
    } catch (error) {
        console.log("Error in the sendMessage controller " , error.message);
        
        res.status(500).json({error : "Internel Server Error !"})
    }
}

export const getUserForSidebar = async (req , res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({_id : {$ne : loggedUserId}}).select("-password");

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in the message controller" , error.message);
        res.status(500).json({error : "Internal Server Error"}) 
    }
}

export const getMessages = async (req , res) => {
    try {
        const {id:userToChat} = req.params
        const senderId = req.user._id;

        const messages = await Message.find({
            $or : [
                {senderId : senderId , receiverId:userToChat},
                {senderId : userToChat , receiverId:senderId}
            ]
        })

        res.status(200).json(messages)

    } catch (error) {
        console.log("Error in the getMessages controller" , error.message);
        res.status(500).json({error : "Internal Server Error"});
        
    }
}