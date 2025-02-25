import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5433,
      user: 'postgres',
      password: 'postgres',
      database: 'postgres',
    },
    migrations: {
      directory: './src/migrations',
      extension: 'ts',
    },
  },
};

export default config;