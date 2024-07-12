import {Schema, model} from "mongoose";

export const entrySchema = new Schema({
    mainTag:{
        type:Schema.Types.ObjectId,
        ref:"MainTag",
        required:[true, "Main tag is required"]
    },
    subtags:[String],
    entryTitle:{type:String, required:[true, "Entry Title is Required"]},
    entryContent:{
        type:String,
        required:[true, "Text content is required"]
    },
    userID:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: [true, "User ID is required."],
    },
    image:{
        path:{
            type:String,
        },
        filename:{
            type:String,
        }
    },
    ForDate:{
        type:Date,
        required:[true, "For Date is required"],
    },
    isDeleted:Number,
    },
    {
        timestamps:true,
    }
);

const entry = model("Entry", entrySchema, "Entries");
export default entry;