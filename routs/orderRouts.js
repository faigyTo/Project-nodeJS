import express from 'express';
import { addOrder, deleteOrder, getAllOrders, getAllOrdersByInvitingCode, updateOrder } from '../controller/orderController.js';
import { auth, authAdmin } from '../middleware/auth.js';

let router=express.Router();

router.get('/',authAdmin,getAllOrders);
router.delete('/:id',auth,deleteOrder);
router.post('/',auth,addOrder);
router.get('/byInvitingCode',auth,getAllOrdersByInvitingCode);
router.put('/:id',authAdmin,updateOrder);


export default router;