import bcrypt from "bcrypt"
import user from "../models/user.model.js"
import { createAccessToken } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const signup=asyncHandler(async(req, res, next)=>{
    const {username, password, email}=req.body;
    if(username, password, email){
        const existingUser = await user.findOne({email});
        if(existingUser){
            res.status(400).send({Message:"User Exists"});
        }
        else{
        const crypt = await bcrypt.hash(password, 10);
        const newUser = new user({
            username,
            password:crypt,
            email,
        });
        await newUser.save();
        res.status(201).send({Message:"New user registered"});
        }
    }
    else{
        throw new Error("Please fill up required fields");
    }
});

const signin = asyncHandler(async(req, res, next)=>{
    const {username, password} = req.body;
    if(username&&password){
        const existingUser = await user.findOne({username});
        if(existingUser){
            const match = await bcrypt.compare(password, existingUser.password);
            if(match){
                res.status(200).send({message:"Login success", 
                    data:{
                        username:existingUser.username,
                        accessToken:createAccessToken(existingUser)
                    }

                })
            }
            else{
                res.status(400);
                throw new Error("Username/Password incorrect");
            }
        }
        else{
            res.status(404);
            throw new Error("User does not exist");
        }
    }
    else{
        throw new Error("Please fill up required fields")
    }
})

export {signup, signin};