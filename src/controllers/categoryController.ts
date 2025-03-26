import {NextFunction, Request, Response} from 'express';
import {CategoryModel} from "../models/category";


export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await CategoryModel.getAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
};



export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const category = await CategoryModel.getById(parseInt(req.params.id));
        if (!category) res.status(404).json({ error: 'Category not found' });
        else res.json(category);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryData = {
            ...req.body,
            allowed_groups: req.body.allowed_groups || ['admin']
        };

        const category = await CategoryModel.create(categoryData);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await CategoryModel.update(parseInt(req.params.id), req.body);
        if (!category)  res.status(404).json({ error: 'Category not found' });
        else res.json(category);
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const category = await CategoryModel.delete(parseInt(req.params.id));
        if (!category) res.status(404).json({ error: 'Category not found' });
        else res.json(category);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
};