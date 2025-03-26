import pool from './db';
import {DatabaseError, handleDatabaseError} from '../utils/dbErrorHandler';

export interface Product {
    id?: number;
    name: string;
    description: string;
    category: string;
    quantity: number;
    price: number;
    created_at?: Date;
    updated_at?: Date;
}
export const ProductModel = {
    async getAll(limit: number = 10, offset: number = 0): Promise<Product[]> {
        const query = `
    SELECT 
        p.id as id,
        p."name" as name,
        p.description as description,
        p.quantity as quantity,
        p.price as price,
        p.created_at as createdAt,
        p.updated_at as updatedAt,
        c."name" as category
    FROM products p
    JOIN categories c
    on p.category_id = c.id
    LIMIT $1 OFFSET $2;
`;
        const result = await pool.query(query, [limit, offset]);
        return result.rows;
    },

    async getById(id: number): Promise<Product | null> {
        const query = 'SELECT * FROM products WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    async create(product: Product): Promise<Product> {
        try {
            const { name, description, category, quantity, price } = product;

            const categoryQuery = 'SELECT id FROM categories WHERE name = $1';
            const categoryResult = await pool.query(categoryQuery, [category]);

            if (categoryResult.rows.length === 0) {
                throw new DatabaseError('Category not found', 'CATEGORY_NOT_FOUND');
            }

            const category_id = categoryResult.rows[0].id;

            const query = `
                INSERT INTO products (name, description, category_id, quantity, price)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;
            const result = await pool.query(query, [name, description, category_id, quantity, price]);
            return result.rows[0];
        } catch (error) {
            handleDatabaseError(error);
            throw error;
        }
    },


    async update(id: number, product: Product): Promise<Product | null> {
        try {
            const { name, description, category, quantity, price } = product;

            const categoryQuery = 'SELECT id FROM categories WHERE name = $1';
            const categoryResult = await pool.query(categoryQuery, [category]);

            if (categoryResult.rows.length === 0) {
                throw new DatabaseError('Category not found', 'CATEGORY_NOT_FOUND');
            }

            const category_id = categoryResult.rows[0].id;

            const query = `
                UPDATE products
                SET name = $1, description = $2, category_id = $3, quantity = $4, price = $5, updated_at = NOW()
                WHERE id = $6
                RETURNING *
            `;
            const result = await pool.query(query, [name, description, category_id, quantity, price, id]);
            return result.rows[0] || null;
        } catch (error) {
            handleDatabaseError(error);
            throw error;
        }
    },

    async delete(id: number): Promise<Product | null> {
        try {
            const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            handleDatabaseError(error);
            throw error;
        }
    },
};