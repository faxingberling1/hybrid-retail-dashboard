import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function initDatabase() {
  console.log('🚀 Initializing database...')
  
  try {
    // 1. Run setup database
    console.log('📦 Setting up database schema...')
    const { stdout: setupOutput, stderr: setupError } = await execAsync('npx tsx scripts/setup-db.ts')
    console.log(setupOutput)
    if (setupError) console.error(setupError)
    
    // 2. Test connection
    console.log('\n🧪 Testing database connection...')
    const { stdout: testOutput, stderr: testError } = await execAsync('npx tsx scripts/test-db.ts')
    console.log(testOutput)
    if (testError) console.error(testError)
    
    console.log('🎉 Database initialization completed!')
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
  }
}

initDatabase()