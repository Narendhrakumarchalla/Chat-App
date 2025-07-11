import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    fullName : {type : String, required : true},
    email : {type : String, required : true , unique : true},
    password : {type : String, required: true, minlength : 6 },
    profilePic: {type:String, default: ''},
    bio:{type: String}
})

const User = mongoose.model("user", userSchema);

export default User;