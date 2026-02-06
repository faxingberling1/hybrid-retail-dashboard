'use client';

import { BookOpen, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useParams, useRouter } from 'next/navigation';

export default function EducationSetupPage() {
    const params = useParams();
    const router = useRouter();
    const organizationId = params.organizationId as string;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-yellow-100 rounded-lg">
                    <BookOpen className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Education Setup</h1>
                    <p className="text-gray-600">Configure your educational institution settings</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Institution Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Enable Student Management</Label>
                                <p className="text-sm text-gray-500">Track student enrollment and performance</p>
                            </div>
                            <Switch checked={true} />
                        </div>
                    </CardContent>
                </Card>

                <Button
                    onClick={() => router.push(`/onboarding/${organizationId}/invite-users`)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    <Save className="mr-2 h-5 w-5" />
                    Save & Continue
                </Button>
            </div>
        </div>
    );
}
