import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/login');
    }

    const role = (session.user.role as string)?.toUpperCase();

    // Redirection logic based on role
    if (role === 'SUPER_ADMIN' || role === 'SUPERADMIN') {
        redirect('/super-admin');
    } else if (role === 'ADMIN' || role === 'MANAGER') {
        redirect('/admin');
    } else {
        redirect('/user');
    }

    // Fallback if role is not recognized or something goes wrong
    return null;
}
