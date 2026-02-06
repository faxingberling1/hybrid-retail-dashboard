// scripts/test-db-connection.ts
import { testSupabaseConnection } from '../lib/db'

async function main() {
  console.log('🔌 Testing Supabase Database Connection')
  console.log('='.repeat(50))
  
  const success = await testSupabaseConnection()
  
  if (success) {
    console.log('\n✅ Database connection is working correctly!')
    console.log('   You can now run: npm run dev')
  } else {
    console.log('\n❌ Database connection failed')
    console.log('\n🔧 Troubleshooting steps:')
    console.log('1. Check .env.local has correct DATABASE_URL')
    console.log('2. Ensure Supabase project is active')
    console.log('3. Verify password is correct')
    console.log('4. Try adding ?sslmode=require to DATABASE_URL')
  }
}

main().catch(console.error)