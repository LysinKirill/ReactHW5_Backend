import pool from './db';

export interface Product {
    id?: number;
    name: string;
    description: string;
    category_id: number;
    quantity: number;
    price: number;
    created_at?: Date;
    updated_at?: Date;
}

export const ProductModel = {
    async getAll(limit: number = 10, offset: number = 0): Promise<Product[]> {
        const query = 'SELECT * FROM products LIMIT $1 OFFSET $2';
        const result = await pool.query(query, [limit, offset]);
        return result.rows;
    },

    async getById(id: number): Promise<Product | null> {
        const query = 'SELECT * FROM products WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    async create(product: Product): Promise<Product> {
        const { name, description, category_id, quantity, price } = product;
        const query = `
      INSERT INTO products (name, description, category_id, quantity, price)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const result = await pool.query(query, [name, description, category_id, quantity, price]);
        return result.rows[0];
    },

    async update(id: number, product: Product): Promise<Product | null> {
        const { name, description, category_id, quantity, price } = product;
        const query = `
      UPDATE products
      SET name = $1, description = $2, category_id = $3, quantity = $4, price = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;
        const result = await pool.query(query, [name, description, category_id, quantity, price, id]);
        return result.rows[0] || null;
    },

    async delete(id: number): Promise<Product | null> {
        const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },
};