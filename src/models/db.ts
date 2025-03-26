
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: "localhost",
    port: 5433,
    user: "postgres",
    password: "postgres",
    database: "postgres",
});

export default pool;