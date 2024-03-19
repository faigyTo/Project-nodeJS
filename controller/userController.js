import mongoose from "mongoose";
import { UserModel,validatorUserForLogin,validatorUser } from "../models/userSchema.js";
import { hash,compare } from "bcrypt";
import { generateToken } from "../config/generateToken.js";

const addUser=async(req,res)=>{
    let validate=validatorUser(req.body);
    if (validate.error)
        return res.status(400).json({type:'body is not valid',message:validate.error.details[0].message});
    let {userEmail,userName,userPassword,role,websiteRegistrationDate}=req.body;
    try{
        let sameUser = await UserModel.findOne(
            {$or:[{userName:userName},{userEmail:userEmail}]}
        );
        if (sameUser)
            return res.status(409).json({type:'same user',message:'there is user with same details'});
        let hashCode=await hash(userPassword,10);
        let newUser=await UserModel.create({userEmail,userName,userPassword:hashCode,role,websiteRegistrationDate});
        let {_id}=newUser;
        let token=generateToken(newUser);
        res.json({token,_id,userName,userEmail,role});
    }
    catch(err){
        res.status(400).json({ type: 'post error', message: 'cannot add user' });
    }
}

const login=async(req,res)=>{
    let validate=validatorUserForLogin(req.body);
    if (validate.error)
        return res.status(400).json({type:'body is not valid',message:validate.error.details[0].message});
    let {userEmail,userPassword}=req.body;
    try{
        let user=await UserModel.findOne({userEmail});
        let {userName,role,_id}=user;
        let isOk=await compare(userPassword,user.userPassword)
        if (!user || !isOk)
            return res.status(404).json({type:'no such user',message:'please sign up'});
        let token=generateToken(user);
        res.json({token,_id,userName,userEmail,role});
    }
    catch(err){
        res.status(400).json({ type: 'login error', message: 'cannot find user' });
    }
}

const getAllUsers=async(req,res)=>{
    try{
        let allUsers=await UserModel.find({},"-userPassword");
        res.json(allUsers)
    }
    catch(err){
        res.status(400).json({ type: 'get error', message: 'cannot get all users' });
    }
}

export {addUser,login,getAllUsers}