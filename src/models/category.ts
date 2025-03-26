import pool from './db';
import { handleDatabaseError } from '../utils/dbErrorHandler';

export interface Category {
    id?: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
    allowed_groups: string[];
}

export const CategoryModel = {
    async getAll(): Promise<Category[]> {
        const query = 'SELECT * FROM categories';
        const result = await pool.query(query);
        return result.rows.map(cat => ({
            ...cat,
            allowed_groups: cat.allowed_groups || ['admin']
        }));
    },

    async getById(id: number): Promise<Category | null> {
        const query = 'SELECT * FROM categories WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    async create(category: Category): Promise<Category> {
        try {
            const { name, allowed_groups = ['admin'] } = category;
            const query = `
                INSERT INTO categories (name, allowed_groups) 
                VALUES ($1, $2) 
                RETURNING *
            `;
            const result = await pool.query(query, [name, JSON.stringify(allowed_groups)]);
            return {
                ...result.rows[0],
                allowed_groups: result.rows[0].allowed_groups || ['admin']
            };
        } catch (error) {
            handleDatabaseError(error);
            throw error;
        }
    },

    async update(id: number, category: Category): Promise<Category | null> {
        try {
            const { name, allowed_groups = ['admin'] } = category;
            const query = `
                UPDATE categories
                SET name = $1, 
                    allowed_groups = $2, 
                    updated_at = NOW()
                WHERE id = $3
                RETURNING *
            `;
            const result = await pool.query(query, [
                name,
                JSON.stringify(allowed_groups),
                id
            ]);
            const updated = result.rows[0];
            return updated ? {
                ...updated,
                allowed_groups: updated.allowed_groups || ['admin']
            } : null;
        } catch (error) {
            handleDatabaseError(error);
            throw error;
        }
    },

    async delete(id: number): Promise<Category | null> {
        try {
            const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            handleDatabaseError(error);
            throw error;
        }
    },
};