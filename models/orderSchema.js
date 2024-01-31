import Joi from "joi";
import mongoose from "mongoose";
import { ProductModel } from "./productSchema.js";

const minimalProduct=mongoose.Schema({
    productName:String,
    price:Number,
    imagePath:String,
    account:Number
})

const orderSchema=mongoose.Schema({
    orderDate:{type:Date,default:Date.now()},
    deadline:{type:Date,default:function() {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 3);
        return currentDate;
    }},
    orderAdress:String,    
    invitingCode:String,
    orderedProducts:[minimalProduct],
    orderInTheWay:{type:Boolean,default:false}
})



export const validatorOrder=(order)=>{
    const schema=Joi.object({
        orderAdress:Joi.string().min(2).required(),
        orderedProducts:Joi.array().required(),
        deadline:Joi.date().greater('now')
    })

    return schema.validate(order);
}

export const validatorMinimalProduct=async(prod)=>{
    const schema=Joi.object({
        productName:Joi.string().required(),
        price:Joi.number().min(250).max(2500),
        account:Joi.number().required(),
        imagePath:Joi.string()
    })
    
    return schema.validate(prod);
}



export const orderModel=mongoose.model('orders',orderSchema);