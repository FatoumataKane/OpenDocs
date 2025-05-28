import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

interface DB {
  users: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    password: string | null;
    image: string | null;
  };

  files: {
    id: string;
    user_id: string;
    name: string;
    original_name: string;
    created_at: Date;
  };
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});

export const db = new Kysely<DB>({ dialect });
