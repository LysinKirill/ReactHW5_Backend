import express from 'express';
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController';

import {
    createCategoryValidator,
    updateCategoryValidator,
    validate,
} from '../validators/categoryValidator';
import {authenticateJWT, checkGroupPermission} from "../middleware/authMiddleware";

const router = express.Router();
router.use(authenticateJWT);

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post(
    '/',
    authenticateJWT,
    checkGroupPermission(['admin']),
    createCategoryValidator,
    validate,
    createCategory
);
router.put(
    '/:id',
    authenticateJWT,
    checkGroupPermission(['admin']),
    updateCategoryValidator,
    validate,
    updateCategory
);
router.delete(
    '/:id',
    authenticateJWT,
    checkGroupPermission(['admin']),
    deleteCategory
);

export default router;