
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    image:{
        type:String,
    },
    seen : {
        type:Boolean,
        default:false
    }
}, {timestamps: true});

const Message = mongoose.model("message", messageSchema);

export default Message