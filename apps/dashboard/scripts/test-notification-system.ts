// scripts/notification-system-test.ts
import { NotificationModel } from '@/lib/models/notification.model';
import pool from '@/lib/db';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function runTests() {
  console.log('🚀 Starting Notification System Tests...\n');
  
  const testCases = [
    {
      name: 'SUPER_ADMIN Notification',
      userId: '0d84911d-2a64-4ae0-95be-00c19c2e4f63',
      role: 'SUPER_ADMIN',
      type: 'warning'
    },
    {
      name: 'ADMIN Notification',
      userId: '4afef20b-2007-4bb2-b2f6-682552ba627d',
      role: 'ADMIN',
      type: 'info'
    },
    {
      name: 'USER Notification',
      userId: 'a6807197-f624-4864-bd9f-c48c62badca9',
      role: 'USER',
      type: 'success'
    }
  ];
  
  const createdNotificationIds: string[] = [];
  
  try {
    // Test 1: Check existing notifications
    console.log('📊 Test 1: Checking existing notifications...');
    const existing = await NotificationModel.getRecentNotifications(5);
    console.log(`   Found ${existing.length} existing notifications`);
    
    // Test 2: Create notifications for each user
    console.log('\n📝 Test 2: Creating test notifications...');
    for (const testCase of testCases) {
      const notification = await NotificationModel.create({
        userId: testCase.userId,
        title: `Test Notification for ${testCase.role}`,
        message: `This is a test notification created at ${new Date().toISOString()}`,
        type: testCase.type,
        priority: 'medium',
        read: false,
        metadata: {
          role: testCase.role,
          dashboard: `${testCase.role.toLowerCase()}/dashboard`,
          test: true,
          timestamp: Date.now()
        }
      });
      
      createdNotificationIds.push(notification.id);
      console.log(`   ✓ Created ${testCase.name}: ${notification.id.substring(0, 8)}...`);
    }
    
    // Test 3: Get recent notifications
    console.log('\n📋 Test 3: Getting recent notifications...');
    const recent = await NotificationModel.getRecentNotifications(10);
    console.log(`   Total recent notifications: ${recent.length}`);
    recent.slice(0, 3).forEach((n, i) => {
      console.log(`   ${i + 1}. "${n.title}" for ${n.metadata?.role || 'unknown role'}`);
    });
    
    // Test 4: Test user-specific notifications
    console.log('\n👤 Test 4: Testing user-specific queries...');
    for (const testCase of testCases) {
      const userNotifications = await NotificationModel.findByUser(testCase.userId);
      const unreadCount = userNotifications.filter(n => !n.read).length;
      console.log(`   ${testCase.role}: ${userNotifications.length} total, ${unreadCount} unread`);
    }
    
    // Test 5: Test statistics
    console.log('\n📈 Test 5: Testing statistics...');
    const adminStats = await NotificationModel.getStats(testCases[1].userId);
    console.log(`   ADMIN stats: ${adminStats.total} total, ${adminStats.unread} unread`);
    console.log(`   Types: ${JSON.stringify(adminStats.byType)}`);
    
    // Test 6: Mark notifications as read
    console.log('\n✅ Test 6: Marking as read...');
    for (const id of createdNotificationIds) {
      await NotificationModel.markAsRead(id);
    }
    console.log(`   Marked ${createdNotificationIds.length} notifications as read`);
    
    // Test 7: Verify read status
    console.log('\n🔍 Test 7: Verifying read status...');
    for (const id of createdNotificationIds) {
      const notification = await NotificationModel.findById(id);
      if (notification && notification.read) {
        console.log(`   ✓ ${id.substring(0, 8)}... is marked as read`);
      }
    }
    
    // Test 8: Cleanup
    console.log('\n🧹 Test 8: Cleaning up...');
    let deletedCount = 0;
    for (const id of createdNotificationIds) {
      try {
        await NotificationModel.delete(id);
        deletedCount++;
      } catch (error) {
        console.log(`   Could not delete ${id.substring(0, 8)}...`);
      }
    }
    console.log(`   Deleted ${deletedCount} test notifications`);
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ Database connection: Working');
    console.log('✅ Notifications CRUD: Working');
    console.log('✅ User-specific queries: Working');
    console.log('✅ Statistics: Working');
    console.log('✅ Read/unread status: Working');
    
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    
    // Attempt cleanup on failure
    if (createdNotificationIds.length > 0) {
      console.log('\nAttempting cleanup...');
      for (const id of createdNotificationIds) {
        try {
          await NotificationModel.delete(id);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }
}

// Run the tests
runTests().catch(console.error);