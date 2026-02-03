// scripts/test-auth-api.ts
import fetch from 'node-fetch'

async function testAuthAPI() {
  console.log('🔐 Testing NextAuth API')
  console.log('='.repeat(40))
  
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'
  const testUsers = [
    { email: 'superadmin@hybridpos.pk', password: 'demo123', role: 'SUPER_ADMIN' },
    { email: 'admin@hybridpos.pk', password: 'demo123', role: 'ADMIN' },
    { email: 'user@hybridpos.pk', password: 'demo123', role: 'USER' }
  ]
  
  console.log('🌐 Base URL:', baseUrl)
  console.log('📡 Testing endpoint:', `${baseUrl}/api/auth/callback/credentials`)
  
  for (const user of testUsers) {
    console.log(`\n🔍 Testing: ${user.email} (${user.role})`)
    
    try {
      const response = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password
        })
      })
      
      console.log('   Status:', response.status, response.statusText)
      
      if (response.status === 200) {
        const data = await response.json()
        console.log('   ✅ Authentication SUCCESS!')
        console.log('   Response:', JSON.stringify(data, null, 2).substring(0, 200) + '...')
      } else {
        const text = await response.text()
        console.log('   ❌ Authentication FAILED')
        console.log('   Error:', text.substring(0, 100))
      }
      
    } catch (error: any) {
      console.log('   ❌ Request failed:', error.message)
    }
  }
  
  // Test session endpoint
  console.log('\n🔍 Testing session endpoint...')
  try {
    const sessionRes = await fetch(`${baseUrl}/api/auth/session`)
    console.log('   Session status:', sessionRes.status)
    const session = await sessionRes.json()
    console.log('   Session data:', JSON.stringify(session, null, 2))
  } catch (error: any) {
    console.log('   Session test failed:', error.message)
  }
}

testAuthAPI().catch(console.error)