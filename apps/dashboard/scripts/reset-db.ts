import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function resetDatabase() {
  console.log('🔄 Resetting database...')
  
  try {
    // 1. Run migration (drops and recreates table)
    console.log('📦 Running migration...')
    const { stdout: migrateOutput, stderr: migrateError } = await execAsync('npx tsx scripts/migrate.ts')
    console.log(migrateOutput)
    if (migrateError && !migrateError.includes('warning')) {
      console.error('Migration error:', migrateError)
    }
    
    // 2. Run seed
    console.log('\n🌱 Seeding database...')
    const { stdout: seedOutput, stderr: seedError } = await execAsync('npx tsx scripts/seed.ts')
    console.log(seedOutput)
    if (seedError && !seedError.includes('warning')) {
      console.error('Seeding error:', seedError)
    }
    
    // 3. Test connection
    console.log('\n🧪 Testing connection...')
    const { stdout: testOutput, stderr: testError } = await execAsync('npx tsx scripts/test-connection.ts')
    console.log(testOutput)
    if (testError && !testError.includes('warning')) {
      console.error('Test error:', testError)
    }
    
    console.log('\n🎉 Database reset completed successfully!')
    
  } catch (error: any) {
    console.error('❌ Database reset failed:', error.message)
    if (error.stderr) {
      console.error('Error output:', error.stderr)
    }
  }
}

resetDatabase()