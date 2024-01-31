import mongoose from "mongoose";
import Joi from "joi";

const descriptionSchema=mongoose.Schema({
    color:String,
    taste:String,
    alcoholPercentage:Number
})

const productSchema=mongoose.Schema({
    productName:String,
    description:descriptionSchema,
    createDate:{type:Date,default:Date.now()},
    price:Number,
    imagePath:String
})

export const validatorProduct=(product)=>{
    const schema=Joi.object({
        price:Joi.number().min(250).max(2500).required(),
        productName:Joi.string().min(6).max(20).required(),
        description:Joi.object().required(),
        createDate:Joi.date().less('now'),
        imagePath:Joi.string()
    })

    return schema.validate(product);
}

export const validatorProductForUpdate=(product)=>{
    const schema=Joi.object({
        price:Joi.number().min(250).max(2500),
        productName:Joi.string().min(6).max(20),
        createDate:Joi.date().less('now'),
        imagePath:Joi.string()
    })

    return schema.validate(product);
}

export const validatorDescriptionProduct=(description)=>{
    const schema=Joi.object({
        alcoholPercentage:Joi.number().min(7).max(50).required(),
        color:Joi.string(),
        taste:Joi.string()
    });

    return schema.validate(description);
}



export const ProductModel=mongoose.model("products",productSchema);