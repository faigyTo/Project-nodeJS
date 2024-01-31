import { addProducts, deleteProducts, getAllProducts, getProductById, updateProduct } from '../controller/productController.js';
import express from 'express';
import { authAdmin } from '../middleware/auth.js';

const router=express.Router();

router.get('/',getAllProducts);
router.get('/:id',getProductById);
router.post('/',authAdmin,addProducts);
router.delete('/:id',authAdmin,deleteProducts);
router.put('/:id',authAdmin,updateProduct);

export default router;