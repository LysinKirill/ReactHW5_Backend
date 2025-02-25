import pool from './db';

export interface Category {
    id?: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export const CategoryModel = {
    async getAll(): Promise<Category[]> {
        const query = 'SELECT * FROM categories';
        const result = await pool.query(query);
        return result.rows;
    },

    async getById(id: number): Promise<Category | null> {
        const query = 'SELECT * FROM categories WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    async create(category: Category): Promise<Category> {
        const { name } = category;
        const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
        const result = await pool.query(query, [name]);
        return result.rows[0];
    },

    async update(id: number, category: Category): Promise<Category | null> {
        const { name } = category;
        const query = `
      UPDATE categories
      SET name = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
        const result = await pool.query(query, [name, id]);
        return result.rows[0] || null;
    },

    async delete(id: number): Promise<Category | null> {
        const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },
};