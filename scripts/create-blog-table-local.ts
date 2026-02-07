import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

const sql = `
CREATE TABLE IF NOT EXISTS "blog_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "category" TEXT NOT NULL DEFAULT 'General',
    "author" TEXT NOT NULL,
    "authorId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "blog_posts_published_idx" ON "blog_posts"("published");
CREATE INDEX IF NOT EXISTS "blog_posts_slug_idx" ON "blog_posts"("slug");
CREATE INDEX IF NOT EXISTS "blog_posts_authorId_idx" ON "blog_posts"("authorId");
`;

async function main() {
  console.log('🚀 Creating blog_posts table on local database...');
  console.log('📡 Using URL:', process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@'));

  try {
    const start = Date.now();
    await pool.query(sql);
    console.log(`✅ table "blog_posts" created successfully! (${Date.now() - start}ms)`);
  } catch (error) {
    console.error('❌ Error creating table:', error);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
