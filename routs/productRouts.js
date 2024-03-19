import { addProducts, deleteProducts, getAllProducts, getCountProduct, getProductById, updateProduct,getCountProductByCategury } from '../controller/productController.js';
import express from 'express';
import { authAdmin } from '../middleware/auth.js';

const router=express.Router();

router.get('/',getAllProducts);
router.get('/countCategury',getCountProductByCategury);
router.get('/count',getCountProduct);
router.get('/:id',getProductById);
router.post('/',authAdmin,addProducts);
router.delete('/:id',authAdmin,deleteProducts);
router.put('/:id',authAdmin,updateProduct);


export default router;