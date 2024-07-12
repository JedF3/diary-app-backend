import { cloudinary } from "../config/storage.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import entry from "../models/entries.model.js";
import mainTag from "../models/mainTags.model.js";


const createEntry = asyncHandler(async(req, res)=>{
    const {emotionID, subtags, entryTitle, entryContent, userID, ForDate}=req.body;
    const isDeleted = 0;
    const emotionObjectID = await mainTag.findOne({emotionID:emotionID});
    let newEntry;
    if(req.file){
        const {path, filename}=req.file;
        newEntry = new entry({
            mainTag:emotionObjectID,
            subtags,
            userID,
            entryTitle,
            entryContent,
            image:{path, filename},
            ForDate,
            isDeleted
        });
    }
    else{
        newEntry = new entry({
            mainTag:emotionObjectID,
            subtags,
            userID,
            entryTitle,
            entryContent,
            ForDate,
            isDeleted
        });
    }
    await newEntry.save();
    res.status(201).send({message:"New Entry Registered", data:newEntry});
});

const viewEntries = asyncHandler(async(req, res)=>{
    const allEntries = await entry.find({$and:[{userID:req.body.userID}, {isDeleted:{$lte:0}}]}).sort({ForDate:-1}).populate({path:"userID", select:"username"}).populate({path:"mainTag", select:["Feeling", "image"]});
    res.status(200).send({message:"retrieved all entries", data:allEntries});
})

const viewOneEntry = asyncHandler(async(req, res)=>{
    const selectedEntry=await entry.findOne({_id:req.params.id}).populate({path:"userID", select:"username"}).populate({path:"mainTag", select:["Feeling", "image", "emotionID"]});
    res.status(200).send({message:"retrieved selected entry", data:selectedEntry});
})

const viewLastEntry = asyncHandler(async(req, res)=>{
    const selectedEntry=await entry.find({$and:[{userID:req.body.userID}, {isDeleted:{$lte:0}}]}).sort({ForDate:-1}).limit(1).populate({path:"mainTag", select:["Feeling", "image"]});
    res.status(200).send({message:"retrieved selected entry", data:selectedEntry});
})

const viewPast7DaysEmotions= asyncHandler(async(req, res)=>{
    let minus7days = new Date(new Date().setDate(new Date().getDate()-6));
    const selectedEntries = await entry.find({$and:[{userID:req.body.userID},{ForDate:{$gte:new Date(minus7days)}}, {isDeleted:{$lte:0}}]}).sort({ForDate:-1}).populate({path:"mainTag", select:["Feeling", "image", "emotionID"]});
    res.status(200).send({message:"retrieved selected entry", data:selectedEntries});
})

const editEntries = asyncHandler(async(req, res)=>{
    const entryID = req.params.id;
    const isDeleted = 0;
    const target = await entry.findOne({_id:entryID});
    if(target){
        const {emotionID, subtags, entryTitle, entryContent, userID}=req.body;
        const emotionObjectID = await mainTag.findOne({emotionID:emotionID});
        let path, filename;
        if(req.file){
            path = req.file.path;
            filename=req.file.filename;
        }
        async function updateEntry(){
            await entry.updateOne({_id:entryID},{
                $set:{
                    mainTag:emotionObjectID,
                    subtags,
                    userID,
                    entryTitle,
                    entryContent,
                    image:{path, filename},
                    isDeleted
                }
            })
        }
        async function updateEntryRemoveImg(){
            await entry.updateOne({_id:entryID},{
                $set:{
                    mainTag:emotionObjectID,
                    subtags,
                    userID,
                    entryTitle,
                    entryContent,
                    isDeleted
                },
                $unset:{image:1}
            })
        }
        async function updateEntryNoImg(){
            await entry.updateOne({_id:entryID},{
                $set:{
                    mainTag:emotionObjectID,
                    subtags,
                    userID,
                    entryTitle,
                    entryContent,
                    isDeleted
                },
            })
        }
        if(target.image.path&&path){
            const cloudDelete = await cloudinary.uploader.destroy(target.image.filename);
            if(cloudDelete.result=='ok'){
                await updateEntry();
                res.status(200).send({message:"Updated selected entry", id:entryID});
            }
            else{
                console.log(cloudDelete);
                res.status(400).send({message:"Problem deleting original image"});
            }
        }
        if(!target.image.path&&path){
            await updateEntry();
            res.status(200).send({message:"Updated selected entry", id:entryID});
        }
        if(target.image.path&&!path){
            const cloudDelete = await cloudinary.uploader.destroy(target.image.filename);
            if(cloudDelete.result=='ok'){
                await updateEntryRemoveImg();
                res.status(200).send({message:"Updated selected entry", id:entryID});
            }
            else{
                console.log(cloudDelete);
                res.status(400).send({message:"Problem deleting original image"});
            }
        }
        if(!target.image.path&&!path){
            await updateEntryNoImg();
            res.status(200).send({message:"Updated selected entry", id:entryID});
        }
    }
    else{
        res.status(404).send({Message:"Target not found"});
    }
})

const deleteEntry = asyncHandler(async(req, res)=>{
    const isDeleted=1;
    await entry.updateOne({_id:req.params.id},{
        $set:{
            isDeleted
        }
    })
    res.status(204).send();
})

export {createEntry, viewEntries, viewOneEntry, viewLastEntry, viewPast7DaysEmotions, editEntries, deleteEntry};