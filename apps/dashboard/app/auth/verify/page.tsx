'use client';

import { Loader2 } from 'lucide-react';

export default function VerifyPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
                <h1 className="text-2xl font-semibold text-gray-900">Verifying your account...</h1>
                <p className="text-gray-600">Please wait while we verify your credentials.</p>
            </div>
        </div>
    );
}
