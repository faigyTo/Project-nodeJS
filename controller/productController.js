import mongoose from "mongoose";
import { ProductModel, validatorDescriptionProduct, validatorProduct, validatorProductForUpdate } from "../models/productSchema.js";

const getAllProducts = async (req, res) => {
    let { searchProductName, searchPrice} = req.query;
    let perPage = req.query.perPage || 15;
    let page = req.query.page || 1;
    let expName = new RegExp(`${searchProductName}`);
    try {
        let filter = {};
        if (searchProductName)
            filter.productName = expName;
        if (searchPrice)
            filter.price=searchPrice;
        let allProducts = await ProductModel.find(filter).
            skip(perPage * (page - 1)).limit(perPage);
        res.json(allProducts);
    }

    catch (err) {
        res.status(400).json({ type: 'get error', message: 'cannot get all products' });
    }
}

const getProductById = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: 'not validate id', message: 'id is not valid' });
        let prod = await ProductModel.findById(id);
        if (!prod)
            return res.status(404).json({ type: 'not found', message: 'not found product with such id' });
        res.json(prod);
    }
    catch (err) {
        res.status(400).json({ type: 'get by id error', message: { err } })
    }
}

const addProducts = async (req, res) => {
    let validate = validatorProduct(req.body);
    if (validate.error)
        return res.status(400).json({ type: 'not valid body', message: validate.error.details[0].message });
    let validateDescription=validatorDescriptionProduct(req.body.description);
    if (validateDescription.error)
        return res.status(400).json({ type: 'not valid body', message: validateDescription.error.details[0].message });
    let { productName, createDate, description, price, imagePath } = req.body;
    // if (!productName || !price)
    //     return res.status(400).json({ type: 'missing paremeters', message: 'missing productName or price' });
    try {

        let sameProd = await ProductModel.findOne({ productName });
        if (sameProd)
            return res.status(409).json({ type: 'same product', message: 'there is aproduct with same details' });
        let newProd = await ProductModel.create({ productName, createDate, description, price, imagePath });
        res.json(newProd);
    }
    catch (err) {
        res.status(400).json({ type: 'post error', message: 'cannot add product' });

    }
}

const deleteProducts = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: 'not validate id', message: 'id is not valid' });
        let prodToDelete = await ProductModel.findById(id);
        if (!prodToDelete)
            return res.status(404).json({ type: 'not found', message: 'not found product to delete with such id' });
        let deleted = await ProductModel.findByIdAndDelete(id);
        res.json(deleted);
    }
    catch (err) {
        res.status(400).json({ type: 'delete error', message: 'cannot delete product' });
    }
}

const updateProduct = async (req, res) => {
    let { id } = req.params;
    let validate = validatorProductForUpdate(req.body);
    if (validate.error)
        return res.status(400).json({ type: 'not valid body', message: validate.error.details[0].message });
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ type: 'not validate id', message: 'id is not valid' });
    try {
        let productToUpdate = await ProductModel.findById(id);
        if (!productToUpdate)
            return res.status(404).json({ type: 'not found', message: 'not found product to delete with such id' });
        await ProductModel.findByIdAndUpdate(id,req.body);
        let updatedProd=await ProductModel.findById(id);
        res.json(updatedProd);
    }
    catch(err){
        res.status(400).json({ type: 'put error', message: 'cannot update product' });
    }
}

export { getAllProducts, getProductById, addProducts, deleteProducts,updateProduct }