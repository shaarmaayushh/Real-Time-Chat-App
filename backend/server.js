import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import connection from "./db/mongo.js";
import cors from "cors"
import { app , server } from "./lib/socket.js"
import path from "path"

dotenv.config();

const PORT = process.env.PORT || 5000
const __dirname = path.resolve(); 

app.use(cors({
    origin : "http://localhost:5173",
    credentials  :true
}));
app.use(cookieParser());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/api/auth" , authRoutes)
app.use("/api/messages" , messageRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }

server.listen(PORT , () => {
    connection();
    console.log(`Server is Running on the ${PORT}`);  
})
