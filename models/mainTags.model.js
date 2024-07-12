import {Schema, model} from "mongoose";

const mainTagSchema = new Schema({
    _id:{
        type:Schema.Types.ObjectId,
        required:[true, "Object ID is required"]
    },
    emotionID:Number,
    Feeling:{
        type:String,
        required:[true, "Feeling is required"]
    },},
    {
        timestamps:true,
    }
);

const mainTag = model("MainTag", mainTagSchema, "MainTags");
export default mainTag;