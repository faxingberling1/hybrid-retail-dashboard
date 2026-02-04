'use client';

import { Activity, Shield, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useParams, useRouter } from 'next/navigation';

export default function HealthcareSetupPage() {
    const params = useParams();
    const router = useRouter();
    const organizationId = params.organizationId as string;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-red-100 rounded-lg">
                    <Activity className="h-8 w-8 text-red-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Healthcare Setup</h1>
                    <p className="text-gray-600">Configure your medical management settings</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            <CardTitle>Compliance (HIPAA)</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Enable Data Encryption</Label>
                                <p className="text-sm text-gray-500">Encrypt all patient data at rest</p>
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
