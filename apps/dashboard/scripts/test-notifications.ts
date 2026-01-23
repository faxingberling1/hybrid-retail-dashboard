// apps/dashboard/scripts/test-notifications.ts
import { NotificationModel } from '@/lib/models/notification.model';
import pool from '@/lib/db';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testNotificationSystem() {
  console.log('🔔 Testing Notification System\n');
  console.log('='.repeat(50));
  
  const existingUsers = [
    { id: '0d84911d-2a64-4ae0-95be-00c19c2e4f63', role: 'SUPER_ADMIN', email: 'superadmin@hybridpos.pk' },
    { id: '4afef20b-2007-4bb2-b2f6-682552ba627d', role: 'ADMIN', email: 'admin@hybridpos.pk' },
    { id: 'a6807197-f624-4864-bd9f-c48c62badca9', role: 'USER', email: 'user@hybridpos.pk' }
  ];
  
  const testNotifications = [];
  
  try {
    // Test 1: Check existing data
    console.log('\n📊 1. Checking existing notifications...');
    const recent = await NotificationModel.getRecentNotifications(5);
    console.log(`   Found ${recent.length} existing notifications`);
    
    // Test 2: Create notifications
    console.log('\n📝 2. Creating test notifications...');
    
    for (const user of existingUsers) {
      try {
        const notification = await NotificationModel.create({
          userId: user.id,
          title: `Test Notification for ${user.role}`,
          message: `This is a test notification created at ${new Date().toLocaleString()}`,
          type: 'info',
          priority: 'medium',
          read: false,
          metadata: {
            role: user.role,
            email: user.email,
            test: true,
            timestamp: Date.now()
          }
        });
        
        testNotifications.push({
          id: notification.id,
          userId: user.id,
          role: user.role
        });
        
        console.log(`   ✅ Created for ${user.role}: ${notification.id.substring(0, 8)}...`);
      } catch (error: any) {
        console.log(`   ❌ Failed for ${user.role}: ${error.message}`);
      }
    }
    
    // Test 3: Verify creation
    console.log('\n🔍 3. Verifying created notifications...');
    const updatedRecent = await NotificationModel.getRecentNotifications(10);
    console.log(`   Now have ${updatedRecent.length} total notifications`);
    
    // Find our test notifications
    const testCount = updatedRecent.filter(n => 
      n.metadata && (n.metadata as any).test === true
    ).length;
    console.log(`   Found ${testCount} test notifications`);
    
    // Test 4: Test findByUser
    console.log('\n👤 4. Testing user-specific queries...');
    for (const user of existingUsers) {
      const userNotifs = await NotificationModel.findByUser(user.id);
      console.log(`   ${user.role}: ${userNotifs.length} notifications`);
    }
    
    // Test 5: Mark one as read
    console.log('\n✅ 5. Testing mark as read...');
    if (testNotifications.length > 0) {
      const firstTest = testNotifications[0];
      await NotificationModel.markAsRead(firstTest.id);
      console.log(`   Marked notification ${firstTest.id.substring(0, 8)}... as read`);
      
      // Verify it's read
      const updated = await NotificationModel.findById(firstTest.id);
      if (updated) {
        console.log(`   Verified: read = ${updated.read}`);
      }
    }
    
    // Test 6: Get statistics
    console.log('\n📈 6. Testing statistics...');
    const adminUser = existingUsers[1]; // ADMIN user
    const stats = await NotificationModel.getStats(adminUser.id);
    console.log(`   Stats for ${adminUser.role}:`);
    console.log(`     Total: ${stats.total}`);
    console.log(`     Unread: ${stats.unread}`);
    console.log(`     By type: ${JSON.stringify(stats.byType)}`);
    
    // Test 7: Cleanup
    console.log('\n🧹 7. Cleaning up test data...');
    let deletedCount = 0;
    
    for (const testNotif of testNotifications) {
      try {
        await NotificationModel.delete(testNotif.id);
        deletedCount++;
        console.log(`   Deleted ${testNotif.id.substring(0, 8)}...`);
      } catch (error) {
        console.log(`   Could not delete ${testNotif.id.substring(0, 8)}...`);
      }
    }
    
    console.log(`\n✅ Deleted ${deletedCount} test notifications`);
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 NOTIFICATION SYSTEM TEST COMPLETE!');
    console.log('='.repeat(50));
    
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the test
testNotificationSystem().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});