import { Pool, type QueryResult, type QueryResultRow } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Configure backend/.env before starting the server.');
}

const sslEnabled = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
});

export const query = async <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> => pool.query<T>(text, params);

export default pool;
