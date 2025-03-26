import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/productController';
import { authenticateJWT } from '../middleware/authMiddleware';
import {
    createProductValidator,
    updateProductValidator,
    validate,
} from '../validators/productValidator';

const router = express.Router();
router.use(authenticateJWT);

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProductValidator, validate, createProduct);
router.put('/:id', updateProductValidator, validate, updateProduct);
router.delete('/:id', deleteProduct);

export default router;