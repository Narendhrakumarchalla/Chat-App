import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";



export const ChatContext = createContext();


const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [unseenMessages, setUnseenMessages] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);

    const {socket , axios} = useContext(AuthContext)

    const getAllUsers = async () => {
        try {
            const { data } = await axios.get('/api/message/users');
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            console.error("Error fetching users:", error);
        }
    }


        const getMessages = async (userId) => {
            try {
                const { data } = await axios.get(`/api/message/${userId}`);
                if (data.success) {
                    setMessages(data.messages);
                    const userObj = users.find(u => u._id === userId);
                    if (userObj) {
                        setSelectedUser(userObj);
                    }
                }
            } catch (error) {
                toast.error(error.response?.data?.message || error.message);
                console.error("Error fetching messages:", error);
            }
        }

    const sendMessage = async (message) => {
        if(!selectedUser._id) return null;
        try {
            const { data } = await axios.post(`/api/message/send/${selectedUser._id}`,  message);
            if (data.success) {
                setMessages(prev => [...prev, data.newMessage]);
            }
            else{
                toast.error(data.message || "Failed to send message");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            console.error("Error sending message:", error);
        }
    }

    //subscribe to socket events
    const subscribeToMessages = async() => {
        if (!socket) return;

        socket.on('newMessage', (newMessage) => {
            
            console.log("New message received:", newMessage);
            

            if(selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages(prev => [...prev, newMessage]);
                axios.put(`/api/message/mark`, {id: newMessage._id});
            }
            else{
                setUnseenMessages(prev => ({
                    ...prev,
                    [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1
                }));
            }
        });
    }

    //unsubscribe from socket events
    const unsubscribeFromMessages = async() => {
        if (!socket) return;

        socket.off('newMessage');
    }

    //useEffect to subscribe to messages when socket is connected
    useEffect(()=>{
        if(!socket) return
        subscribeToMessages()
        return ()=> unsubscribeFromMessages()
    },[socket, selectedUser,unseenMessages])

    const value = {
        messages, users, selectedUser, getAllUsers,getMessages, setMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages
    }
    return (
        <ChatContext.Provider value={value}>
        {children}
        </ChatContext.Provider>
    );
}

export default ChatProvider;
