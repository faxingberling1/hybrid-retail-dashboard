'use client';

import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function OnboardingCompletePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-xl shadow-lg">
                <div className="flex justify-center">
                    <div className="p-3 bg-green-100 rounded-full">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Setup Complete!</h1>
                <p className="text-gray-600">
                    Your organization has been successfully configured. You're now ready to start managing your business.
                </p>
                <Button
                    onClick={() => router.push('/dashboard')}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-11"
                >
                    Go to Dashboard
                </Button>
            </div>
        </div>
    );
}
