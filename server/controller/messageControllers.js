import cloudinary from "../lib/cloudinary.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { io, userSocketMap } from "../server.js";



const getAllUsers = async (req , res) =>{
    try {

        const userId = req.user._id;
        const users = await User.find({ _id: { $ne: userId } }).select("-password");
        if(!userId){
            return res.status(400).json({
                success : false,
                message : "User not found"
            })
        }

        const unseenMessages={}
        const promises = users.map(async(user)=>{
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen:false})
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length
            }
        })

        await Promise.all(promises)
        res.status(200).json({
            success: true,
            users,
            unseenMessages
        });   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        }); 
    }
}

const getMessages = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUserId = req.user._id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId }
            ]
        }).sort({ createdAt: 1 });

        await Message.updateMany(
            { senderId: userId, receiverId: currentUserId},
            {seen: true}
        );

        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


const markMessageAsSeen = async (req, res) => {
    try {
        const messageId = req.body.id;
        const userId = req.user._id;

        if (!messageId) {
            return res.status(400).json({
                success: false,
                message: "Message ID is required"
            });
        }

        const message = await Message.findById(messageId);
        if (!message || message.receiverId.toString() !== userId.toString()) {
            return res.status(404).json({
                success: false,
                message: "Message not found or unauthorized"
            });
        }

        message.seen = true;
        await message.save();

        res.status(200).json({
            success: true,
            message: "Message marked as seen"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;  
        const receiverId = req.params.id;

        if (!text && !image) {
            return res.status(400).json({
                success: false,
                message: "Message text or image is required"
            });
        }
        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required"
            });
        }
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url; // Replace with actual upload logic if needed
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        }); 

        const savedMessage = await newMessage.save();

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", savedMessage);
        }

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            newMessage: savedMessage
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export {
    getAllUsers,
    getMessages,
    markMessageAsSeen,
    sendMessage
};