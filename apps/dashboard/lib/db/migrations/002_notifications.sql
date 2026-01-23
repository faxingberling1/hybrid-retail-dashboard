-- notifications/002_notifications.sql
-- Complete notification system migration with all indexes and optimizations

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'info',
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  action_url VARCHAR(500),
  action_label VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY,
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  desktop_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  mute_until TIMESTAMP WITH TIME ZONE,
  excluded_types VARCHAR(20)[] DEFAULT '{}',
  digest_frequency VARCHAR(20) NOT NULL DEFAULT 'realtime',
  role_specific_filters JSONB DEFAULT '{}',
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Basic indexes for common queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_read ON notifications(read) WHERE NOT read;
CREATE INDEX idx_notifications_expires_at ON notifications(expires_at) WHERE expires_at IS NOT NULL;

-- Indexes for role-based filtering
CREATE INDEX idx_notifications_metadata_role ON notifications ((metadata->>'role'));
CREATE INDEX idx_notifications_metadata_dashboard ON notifications ((metadata->>'dashboard'));
CREATE INDEX idx_notifications_metadata_entity_id ON notifications ((metadata->>'entityId'));
CREATE INDEX idx_notifications_metadata_entity_type ON notifications ((metadata->>'entityType'));

-- Indexes for type and priority filtering
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_priority ON notifications(priority);

-- Composite indexes for common query patterns
CREATE INDEX idx_notifications_user_read_created ON notifications(user_id, read, created_at DESC);
CREATE INDEX idx_notifications_user_type_created ON notifications(user_id, type, created_at DESC);
CREATE INDEX idx_notifications_user_priority_created ON notifications(user_id, priority, created_at DESC);

-- Partial index for unread high priority notifications (for real-time alerts)
CREATE INDEX idx_notifications_unread_high_priority ON notifications(user_id, created_at DESC) 
WHERE NOT read AND priority IN ('high', 'critical');

-- Index for metadata GIN (for advanced JSON queries)
CREATE INDEX idx_notifications_metadata_gin ON notifications USING GIN (metadata);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for auto-updating updated_at
CREATE TRIGGER update_notifications_updated_at 
  BEFORE UPDATE ON notifications 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Function to cleanup expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notifications 
  WHERE expires_at < NOW() 
  RETURNING id INTO deleted_count;
  
  RETURN deleted_count;
END;
$$ language 'plpgsql';

-- Function to mark old notifications as read (archive)
CREATE OR REPLACE FUNCTION archive_old_notifications(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE notifications 
  SET read = TRUE 
  WHERE created_at < NOW() - (days_old || ' days')::INTERVAL 
    AND read = FALSE
  RETURNING id INTO updated_count;
  
  RETURN updated_count;
END;
$$ language 'plpgsql';

-- Function to get notification statistics for a user
CREATE OR REPLACE FUNCTION get_user_notification_stats(user_uuid UUID)
RETURNS TABLE(
  total_count BIGINT,
  unread_count BIGINT,
  info_count BIGINT,
  success_count BIGINT,
  warning_count BIGINT,
  error_count BIGINT,
  low_count BIGINT,
  medium_count BIGINT,
  high_count BIGINT,
  critical_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE NOT read) as unread_count,
    COUNT(*) FILTER (WHERE type = 'info') as info_count,
    COUNT(*) FILTER (WHERE type = 'success') as success_count,
    COUNT(*) FILTER (WHERE type = 'warning') as warning_count,
    COUNT(*) FILTER (WHERE type = 'error') as error_count,
    COUNT(*) FILTER (WHERE priority = 'low') as low_count,
    COUNT(*) FILTER (WHERE priority = 'medium') as medium_count,
    COUNT(*) FILTER (WHERE priority = 'high') as high_count,
    COUNT(*) FILTER (WHERE priority = 'critical') as critical_count
  FROM notifications 
  WHERE user_id = user_uuid;
END;
$$ language 'plpgsql';

-- =============================================
-- VIEWS FOR REPORTING
-- =============================================

-- View for notification overview (for admin dashboards)
CREATE OR REPLACE VIEW notification_overview AS
SELECT 
  n.id,
  n.user_id,
  u.email as user_email,
  u.role as user_role,
  n.title,
  n.type,
  n.priority,
  n.read,
  n.created_at,
  n.metadata->>'role' as notification_role,
  n.metadata->>'dashboard' as dashboard,
  n.metadata->>'entityType' as entity_type,
  n.metadata->>'entityId' as entity_id
FROM notifications n
JOIN users u ON n.user_id = u.id;

-- View for unread notifications summary
CREATE OR REPLACE VIEW unread_notifications_summary AS
SELECT 
  u.role,
  COUNT(*) as total_unread,
  COUNT(*) FILTER (WHERE n.priority = 'critical') as critical_unread,
  COUNT(*) FILTER (WHERE n.priority = 'high') as high_unread,
  COUNT(*) FILTER (WHERE n.type = 'error') as error_unread
FROM notifications n
JOIN users u ON n.user_id = u.id
WHERE NOT n.read
GROUP BY u.role;

-- View for notification type distribution
CREATE OR REPLACE VIEW notification_type_distribution AS
SELECT 
  type,
  priority,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE NOT read) as unread_count,
  ROUND(AVG(EXTRACT(EPOCH FROM (NOW() - created_at))/3600)::NUMERIC, 2) as avg_hours_old
FROM notifications
GROUP BY type, priority
ORDER BY type, priority;

-- =============================================
-- SAMPLE DATA FOR DEVELOPMENT
-- =============================================

-- Insert sample notification preferences (optional - for development)
INSERT INTO notification_preferences (user_id, email_notifications, push_notifications, desktop_notifications, excluded_types, digest_frequency)
SELECT 
  id,
  TRUE,
  TRUE,
  TRUE,
  ARRAY['info']::VARCHAR(20)[],
  'realtime'
FROM users
WHERE NOT EXISTS (SELECT 1 FROM notification_preferences WHERE user_id = users.id);

-- Insert sample notifications for existing users (optional - for development)
INSERT INTO notifications (user_id, title, message, type, priority, read, metadata, action_url, action_label)
SELECT 
  u.id,
  CASE 
    WHEN u.role = 'SUPER_ADMIN' THEN 'System Health Report'
    WHEN u.role = 'ADMIN' THEN 'Daily Sales Summary'
    WHEN u.role = 'USER' THEN 'Task Assignment'
    ELSE 'Welcome Notification'
  END,
  CASE 
    WHEN u.role = 'SUPER_ADMIN' THEN 'All systems are operating normally. Last 24h uptime: 99.9%'
    WHEN u.role = 'ADMIN' THEN 'Your store processed 156 orders totaling $12,450 yesterday'
    WHEN u.role = 'USER' THEN 'You have been assigned 3 new tasks for today'
    ELSE 'Welcome to the platform! Get started by completing your profile.'
  END,
  CASE 
    WHEN u.role = 'SUPER_ADMIN' THEN 'info'
    WHEN u.role = 'ADMIN' THEN 'success'
    WHEN u.role = 'USER' THEN 'info'
    ELSE 'info'
  END,
  CASE 
    WHEN u.role = 'SUPER_ADMIN' THEN 'medium'
    WHEN u.role = 'ADMIN' THEN 'low'
    WHEN u.role = 'USER' THEN 'medium'
    ELSE 'low'
  END,
  FALSE,
  jsonb_build_object(
    'role', u.role,
    'dashboard', CASE 
      WHEN u.role = 'SUPER_ADMIN' THEN 'super-admin/system'
      WHEN u.role = 'ADMIN' THEN 'admin/dashboard'
      WHEN u.role = 'USER' THEN 'user/tasks'
      ELSE 'dashboard'
    END,
    'entityType', 'system',
    'timestamp', EXTRACT(EPOCH FROM NOW())
  ),
  CASE 
    WHEN u.role = 'SUPER_ADMIN' THEN '/super-admin/system'
    WHEN u.role = 'ADMIN' THEN '/admin/dashboard'
    WHEN u.role = 'USER' THEN '/user/tasks'
    ELSE '/dashboard'
  END,
  CASE 
    WHEN u.role = 'SUPER_ADMIN' THEN 'View System Dashboard'
    WHEN u.role = 'ADMIN' THEN 'Go to Dashboard'
    WHEN u.role = 'USER' THEN 'View Tasks'
    ELSE 'Get Started'
  END
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM notifications WHERE user_id = u.id AND title LIKE '%Welcome%'
)
LIMIT 50;

-- =============================================
-- COMMENT SECTION FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE notifications IS 'Stores all user notifications with metadata for role-based filtering';
COMMENT ON COLUMN notifications.metadata IS 'JSONB field for storing role, dashboard, entity info and custom metadata';
COMMENT ON COLUMN notifications.expires_at IS 'Optional expiration timestamp for auto-cleanup';
COMMENT ON COLUMN notification_preferences.role_specific_filters IS 'JSONB for role-specific notification filters and preferences';

COMMENT ON INDEX idx_notifications_metadata_role IS 'Optimizes queries filtering by role in metadata';
COMMENT ON INDEX idx_notifications_unread_high_priority IS 'Optimizes queries for real-time alerts (unread + high priority)';
COMMENT ON INDEX idx_notifications_metadata_gin IS 'GIN index for advanced JSON querying on metadata';

-- =============================================
-- CLEANUP SCHEDULE (Example - use pg_cron if available)
-- =============================================

-- Note: For production, consider setting up pg_cron or similar for:
-- 1. Daily cleanup of expired notifications
-- 2. Weekly archiving of old notifications
-- 3. Monthly statistics aggregation

-- Example pg_cron jobs (uncomment if pg_cron is installed):
-- SELECT cron.schedule('cleanup-expired-notifications', '0 2 * * *', 
--   $$DELETE FROM notifications WHERE expires_at < NOW()$$);
-- 
-- SELECT cron.schedule('archive-old-notifications', '0 3 * * 0', 
--   $$UPDATE notifications SET read = TRUE WHERE created_at < NOW() - INTERVAL '30 days' AND read = FALSE$$);

-- =============================================
-- MIGRATION NOTES
-- =============================================

/*
Migration Steps:
1. Run this SQL file to create tables and indexes
2. Update your NotificationModel.ts to use the new schema
3. Test with sample data
4. Deploy to production during low-traffic period

Performance Notes:
- Indexes are optimized for common query patterns
- GIN index on metadata allows flexible JSON queries
- Partial indexes reduce index size for common filters
- Composite indexes support efficient sorting and filtering

Security Notes:
- Foreign key constraints ensure data integrity
- ON DELETE CASCADE removes notifications when users are deleted
- JSONB fields are validated by the application layer
*/

-- End of migration