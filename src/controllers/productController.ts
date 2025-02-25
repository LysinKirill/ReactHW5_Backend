import {NextFunction, Request, Response} from 'express';
import {ProductModel} from "../models/product";


export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const { limit = '10', offset = '0' } = req.query;
        const products = await ProductModel.getAll(parseInt(limit as string), parseInt(offset as string));
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await ProductModel.getById(parseInt(req.params.id));
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
        }
        else res.json(product);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await ProductModel.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await ProductModel.update(parseInt(req.params.id), req.body);
        if (!product) res.status(404).json({ error: 'Product not found' });
        else res.json(product);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await ProductModel.delete(parseInt(req.params.id));
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
        }
        else res.json(product);
    } catch (error) {
        next(error);
    }
};