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
import {authenticateJWT} from "../middleware/authMiddleware";

const router = express.Router();
router.use(authenticateJWT);

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategoryValidator, validate, createCategory);
router.put('/:id', updateCategoryValidator, validate, updateCategory);
router.delete('/:id', deleteCategory);

export default router;