// apps/dashboard/lib/middleware/database-permissions.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function checkDatabasePermissions(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { allowed: false, error: 'Unauthorized' };
  }
  
  // Only SUPER_ADMIN can access database management
  if (session.user.role !== 'SUPER_ADMIN') {
    return { allowed: false, error: 'Insufficient permissions' };
  }
  
  // Check for dangerous operations
  const body = await request.json().catch(() => ({}));
  const { action, query } = body;
  
  // Prevent dangerous operations
  if (action === 'execute_query') {
    const dangerousKeywords = ['DROP', 'TRUNCATE', 'ALTER', 'GRANT', 'REVOKE'];
    const hasDangerousKeyword = dangerousKeywords.some(keyword => 
      query.toUpperCase().includes(keyword)
    );
    
    if (hasDangerousKeyword) {
      return { allowed: false, error: 'Dangerous operations are not allowed' };
    }
  }
  
  return { allowed: true };
}