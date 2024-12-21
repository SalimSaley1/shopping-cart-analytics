import express from 'express';
import auth from '../middleware/auth_middleware';
import {
    createSaleController,
    getSaleByIdController,
    getAllSalesController,
    updateSaleController,
    deleteSaleController,
    getTotalSalesController,
    getTotalSalesQuantityController,
    getTrendingProductsController,
    getCategorySalesController,
} from '../controllers/sale_controller';

const router = express.Router();


router.get('/total_sales',getTotalSalesController);
router.get('/trending_products', getTrendingProductsController);
router.get('/category_sales', getCategorySalesController);
router.get('/total_sales_quantity',getTotalSalesQuantityController);


router.post('/',auth, createSaleController);
router.get('/',auth,getAllSalesController);
router.get('/:saleId',auth, getSaleByIdController);
router.put('/:saleId',auth, updateSaleController);
router.delete('/:saleI',auth, deleteSaleController);

export default router;

