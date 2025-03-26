import bcrypt from 'bcrypt';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await knex('users').insert([
        {
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            group: 'admin',
            avatar_url: 'https://example.com/avatar.jpg'
        }
    ]);
}