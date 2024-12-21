import express from 'express';
import auth from '../middleware/auth_middleware';
import {
  createProductController,
  getProductByIdController,
  getAllProductsController,
  updateProductController,
  deleteProductController,
  getProductsTableController,
} from '../controllers/product_controller';


const router = express.Router();


router.get('/table',auth, getProductsTableController);


router.post('/',auth, createProductController);
router.get('/',auth,getAllProductsController);
router.get('/:productId',auth, getProductByIdController);
router.put('/:productId',auth, updateProductController);
router.delete('/:productId',auth, deleteProductController);

export default router;
