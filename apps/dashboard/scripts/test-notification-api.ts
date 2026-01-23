// scripts/test-notification-api.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testNotificationAPI() {
  console.log('🌐 Testing Notification API Endpoints...\n');
  
  const baseURL = 'http://localhost:3001';
  
  const endpoints = [
    '/api/notifications',
    '/api/notifications?limit=5',
    '/api/notifications?type=info',
    '/api/notifications?unreadOnly=true'
  ];
  
  for (const endpoint of endpoints) {
    console.log(`Testing GET ${endpoint}...`);
    try {
      const response = await fetch(`${baseURL}${endpoint}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Status: ${response.status}`);
        console.log(`   Found: ${data.notifications?.length || 0} notifications`);
        console.log(`   Unread: ${data.unreadCount || 0}`);
      } else {
        console.log(`❌ Status: ${response.status} ${response.statusText}`);
        
        // If unauthorized, that's expected for now
        if (response.status === 401) {
          console.log('   ⚠️ Expected - Need authentication');
        }
      }
    } catch (error: any) {
      console.log(`❌ Failed: ${error.message}`);
    }
    console.log();
  }
  
  console.log('📋 API Test Notes:');
  console.log('1. Make sure your Next.js dev server is running: npm run dev');
  console.log('2. You need to be authenticated to access notifications');
  console.log('3. Visit http://localhost:3001/notifications to see the notifications page');
}

testNotificationAPI().catch(console.error);