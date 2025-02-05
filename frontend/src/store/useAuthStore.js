import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const baseUrl = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/";

export const useAuthStore = create((set , get) => ({
    authUser: null,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,
    onlineUsers : [],
    isCheckingAuth : true,
    socket : null,

    checkAuth : async() => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({authUser:  response.data})
            get().connectSocket();
        } catch (error) {
            set({authUser : null});
        }finally{
            set({isCheckingAuth : false})
        }
    },

    signup : async (data) => {
        set({isSigningUp : true});
        try { 
            const res = await axiosInstance.post("/auth/signup" , data);
            set({authUser : res.data});
            toast.success("Account created suceessfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isSigningUp : false});
        }
    },

    logout : async () => {
        try {
            await axiosInstance.post("auth/logout")
            set({authUser : null})
            toast.success("Logout Successfully!");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    login : async (data) => {
        set({isLoggingIn : true})
        try {
            const res = await axiosInstance.post("/auth/login" , data);
            set({authUser : res.data });
            toast.success("Logged In Successfully!")
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isLoggingIn : false})
        }
    },

    updateProfile : async (data) => {
        set({isUpdatingProfile : true})
        try {
            const res = await axiosInstance.put("/auth/updateProfile" , data)
            res.data.updatedUser
            set({authUser : res.data.updatedUser});
            toast.success("Profile Picutre is Updated !")
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isUpdatingProfile : false})
        }
    } ,

    connectSocket : () => {
        const {authUser} = get();

        if(!authUser || get().socket?.connected){
            return;
        }

        const socket = io(baseUrl , {
            query: {
                userId : authUser._id
            },
        });
        socket.connect();

        socket.on("getOnlineUsers" , (userIds) => {
            set({onlineUsers : userIds})
        })

        set({socket : socket})
    },

    disconnectSocket : () => {
        if(get().socket?.connected){
            get().socket.disconnect();
        }
    }
}));