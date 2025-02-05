import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("Connected to the DB");
    } catch (error) {
        console.log("Error while connecting to the db !" , error.message);  
    }
}

export default connection;