console.log('🔍 Debugging Environment Variables')
console.log('==================================')

// Check if dotenv is needed
try {
  require('dotenv').config({ path: '.env.local' })
  console.log('✅ Loaded .env.local with dotenv')
} catch (error) {
  console.log('⚠️  Could not load .env.local with dotenv')
}

console.log('\n📋 Current environment variables:')
console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST)
console.log('POSTGRES_PORT:', process.env.POSTGRES_PORT)
console.log('POSTGRES_DATABASE:', process.env.POSTGRES_DATABASE)
console.log('POSTGRES_USER:', process.env.POSTGRES_USER)
console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD ? '***' : '(empty)')

console.log('\n📁 Current directory:', process.cwd())
console.log('📁 __dirname:', __dirname)

// Try to read .env.local file directly
const fs = require('fs')
const path = require('path')
const envPath = path.join(process.cwd(), '.env.local')

console.log('\n📄 Checking .env.local file at:', envPath)

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists')
  const content = fs.readFileSync(envPath, 'utf8')
  console.log('\n📝 File content:')
  console.log(content)
} else {
  console.log('❌ .env.local file not found')
  
  // Check for other .env files
  const files = fs.readdirSync(process.cwd())
  const envFiles = files.filter((f: string) => f.startsWith('.env'))
  console.log('\n📁 Other .env files found:', envFiles)
}