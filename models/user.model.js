import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username:{
        type:String,
        required:[true, "Username is required"],
    },
    password:{
        type:String,
        required:[true, "Password is required"],
    },
    email:{
        type:String,
        required:[true, "Email is required"],
    },
    createDate:{
        type:Date,
        default:Date.now
    }
},
    {
        timestamps:true,
    }
)

const user = model("User", userSchema, "Users");
export default user;