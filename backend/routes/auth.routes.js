import express from "express"
import { login, logout, signup, updateProfile , checkAuth } from "../controller/auth.controllers.js";
import protectRoute from "../middleware/protectRoute.js";


const router = express.Router();

router.post("/signup" ,signup)
router.post("/login" , login)
router.post("/logout" , logout)

router.put("/updateProfile" , protectRoute , updateProfile)

router.get("/check" , protectRoute , checkAuth)

export default router