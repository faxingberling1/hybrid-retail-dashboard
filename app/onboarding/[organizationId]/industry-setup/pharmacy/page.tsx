'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Pill, 
  Shield, 
  FileText,
  AlertTriangle,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

export default function PharmacySetupPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.organizationId as string;
  
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    requirePrescription: true,
    enableExpiryAlerts: true,
    lowStockThreshold: 10,
    defaultCategories: ['OTC', 'Prescription', 'Medical Supplies'],
    complianceRules: ['HIPAA', 'FDA', 'State Regulations'],
    enablePatientHistory: true,
    prescriptionValidityDays: 30,
    enableAutoReorder: false,
    reorderThreshold: 5
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/organizations/${organizationId}/settings/pharmacy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Pharmacy settings saved');
        
        // Mark industry setup as complete
        await fetch(`/api/onboarding/${organizationId}/complete-step`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ step: 'industry-setup' })
        });
        
        router.push(`/onboarding/${organizationId}/invite-users`);
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Pill className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pharmacy Setup</h1>
            <p className="text-gray-600">
              Configure your pharmacy management system with industry-specific settings
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Compliance Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <CardTitle>Compliance & Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Prescription Verification</Label>
                  <p className="text-sm text-gray-500">
                    All prescriptions must be verified before dispensing
                  </p>
                </div>
                <Switch
                  checked={settings.requirePrescription}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, requirePrescription: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Patient History</Label>
                  <p className="text-sm text-gray-500">
                    Maintain complete patient medication history
                  </p>
                </div>
                <Switch
                  checked={settings.enablePatientHistory}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enablePatientHistory: checked })
                  }
                />
              </div>

              <div>
                <Label>Prescription Validity (Days)</Label>
                <Input
                  type="number"
                  value={settings.prescriptionValidityDays}
                  onChange={(e) =>
                    setSettings({ 
                      ...settings, 
                      prescriptionValidityDays: parseInt(e.target.value) 
                    })
                  }
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Inventory Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <CardTitle>Inventory Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Expiry Alerts</Label>
                  <p className="text-sm text-gray-500">
                    Get notified when medications are nearing expiry
                  </p>
                </div>
                <Switch
                  checked={settings.enableExpiryAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableExpiryAlerts: checked })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Low Stock Threshold</Label>
                  <Input
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) =>
                      setSettings({ 
                        ...settings, 
                        lowStockThreshold: parseInt(e.target.value) 
                      })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Auto-reorder Threshold</Label>
                  <Input
                    type="number"
                    value={settings.reorderThreshold}
                    onChange={(e) =>
                      setSettings({ 
                        ...settings, 
                        reorderThreshold: parseInt(e.target.value) 
                      })
                    }
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Auto-reorder</Label>
                  <p className="text-sm text-gray-500">
                    Automatically create purchase orders when stock is low
                  </p>
                </div>
                <Switch
                  checked={settings.enableAutoReorder}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableAutoReorder: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Medicine Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['OTC', 'Prescription', 'Medical Supplies', 'Wellness', 'Equipment'].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      checked={settings.defaultCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSettings({
                            ...settings,
                            defaultCategories: [...settings.defaultCategories, category]
                          });
                        } else {
                          setSettings({
                            ...settings,
                            defaultCategories: settings.defaultCategories.filter(c => c !== category)
                          });
                        }
                      }}
                    />
                    <Label>{category}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/onboarding/${organizationId}/import-medicines`)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Import Medicine List
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/onboarding/${organizationId}/setup-suppliers`)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Setup Suppliers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Save className="mr-2 h-5 w-5" />
            {loading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}