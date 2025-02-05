import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore.js"
import { MessageInput } from "./MessageInput.jsx";
import ChatHeader from "./ChatHeader.jsx";
import MessageSkeleton from "./skeleton/MessageSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import Avatar from "../img/avatar.png"
import Bg from "../img/backgrd.jpg"
import { formatMessageIime } from "../lib/utils.js";

export const ChatContainer = () => {
    const {messages , getMessages , isMessagesLoading , selectedUser , subscribeToMessages , unsubscribeFromMessages} = useChatStore();
    const {authUser} = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        getMessages(selectedUser._id)
        subscribeToMessages();

        console.log("hello");
        

        return () => {
            unsubscribeFromMessages();
        }
    } , [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
          messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [messages]);

    if(isMessagesLoading) {
        return(
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader/>
                <MessageSkeleton/>
                <MessageInput/>
            </div>
        )
    }
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="relative w-full h-[500px] overflow-auto bg-[url(Bg)] bg-cover bg-center bg-no-repeat">

            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px] scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">

                {console.log(messages)}
                
                {messages.map((message) => {
                    console.log(message.senderId)
                    
                    return (
                        <div 
                        
                        key={message._id} 
                        className={`chat ${ message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                        >
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img src={message.senderId === authUser._id ? authUser.profilePic || Avatar : selectedUser.profilePic || Avatar } alt="profile pic" />
                                </div>
                            </div>
                            <div className="chat-bubble flex flex-col">
                                {message.image && (
                                    <img src={message.image} alt="Attactment" className="sm:max-w-[200px] rounded-md mb-2" />
                                )}
                                {message.text && <p>{message.text}</p>}
                                &nbsp;
                                <div className="chat-header mb-1 absolute right-1 bottom-0">
                                <time className="text-xs opacity-50 ml-1">
                                    {formatMessageIime(message.createdAt)}
                                </time>
                            </div>
                            </div>
                        </div>
                    )
                })}  
            </div>
            </div>
            <MessageInput />
        </div>
    )
}