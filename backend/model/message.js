import mongoose from "mongoose";

const messagingSchema = mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "User",
        required : true
    },
    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "User",
        required : true
    },
    text : {
        type: String 
    },
    image : {
        type: String,
        default : ""
    },
} , {timestamps : true});

const Message  = mongoose.model("Message" , messagingSchema);

export default Message;