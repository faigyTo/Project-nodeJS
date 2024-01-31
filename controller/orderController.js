import mongoose from "mongoose";
import { orderModel, validatorMinimalProduct, validatorOrder } from "../models/orderSchema.js";
import { ProductModel } from "../models/productSchema.js";

const getAllOrders = async (req, res) => {
    try {
        let allOrders = await orderModel.find({});
        res.json(allOrders)
    }
    catch (err) {
        res.status(400).json({ type: 'get error', message: 'cannot get all orders' });
    }
}

const deleteOrder = async (req, res) => {
    let { id } = req.params;
    let { _id } = req.user;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ type: 'not validate id', message: 'id is not valid' });
    try {
        let order = await orderModel.findById(id);
        if (!order)
            return res.status(404).json({ type: 'not found', message: 'not found order to delete with such id' });
        if (_id != order.invitingCode && req.user.role != 'ADMIN')
            return res.status(403).json({ type: 'No match', message: 'You are not allowed to delete an order that you did not make' });
        if (order.orderInTheWay)
            return res.status(400).json({ type: 'The order has gone out', message: 'The order has been sent, it cannot be deleted' });
        let deleted = await orderModel.findByIdAndDelete(id)
        res.json(deleted)
    }
    catch (err) {
        res.status(400).json({ type: 'delete error', message: 'cannot delete order' });
    }
}

const addOrder = async (req, res) => {
    let validate = validatorOrder(req.body);
    if (validate.error)
        return res.status(400).json({ type: 'not valid body', message: validate.error.details[0].message });
    for (const item of req.body.orderedProducts) {
        let validateProducts = await validatorMinimalProduct(item);
        if (validateProducts.error)
            return res.status(400).json({ type: 'not valid body', message: validateProducts.error.details[0].message });
        let productName = item.productName;
        let productToAdd = await ProductModel.findOne({ productName })
        if (!productToAdd)
            return res.status(404).json({ type: 'not found', message: 'there is no product with such name' });
    }

    let { deadline, orderAdress, orderInTheWay, orderedProducts } = req.body;
    try {
        let invitingCode = req.user._id;
        let newOrder = await orderModel.create({ deadline, orderAdress, orderInTheWay, orderedProducts, invitingCode });
        res.json(newOrder);
    }
    catch (err) {
        res.status(400).json({ type: 'post error', message: 'cannot add order' });
    }
}

const getAllOrdersByInvitingCode = async (req, res) => {
    let { _id,role } = req.user;
    if (role=='ADMIN'&&req.body.invitingCode)
        _id=req.body.invitingCode;
    try {
        let allOrdersByInvitingCode = await orderModel.find({invitingCode:_id});
        res.json(allOrdersByInvitingCode);
    }
    catch (err) {
        res.status(400).json({ type: 'get by inviting code error', message: 'cannot get order by inviting code' });
    }
}

const updateOrder = async (req, res) => {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ type: 'not validate id', message: 'id is not valid' });
    try {
        let order = await orderModel.findById(id);
        if (!order)
            return res.status(404).json({ type: 'not found', message: 'there is no order with such id' });
        await orderModel.findByIdAndUpdate(id, { orderInTheWay: true });
        let orderToUpdate = await orderModel.findById(id);
        res.json(orderToUpdate);
    }
    catch (err) {
        res.status(400).json({ type: 'update error', message: 'cannot update order' });
    }
}

export { getAllOrders, deleteOrder, addOrder, getAllOrdersByInvitingCode, updateOrder };