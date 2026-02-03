'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Settings, 
  Users, 
  Database,
  BarChart3,
  Mail,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

const ONBOARDING_STEPS = [
  { id: 'industry-setup', name: 'Industry Setup', icon: Settings, description: 'Configure industry-specific settings' },
  { id: 'invite-users', name: 'Invite Team', icon: Users, description: 'Add team members to your organization' },
  { id: 'data-import', name: 'Import Data', icon: Database, description: 'Import your existing data' },
  { id: 'integrations', name: 'Connect Tools', icon: BarChart3, description: 'Connect third-party integrations' },
  { id: 'notifications', name: 'Notifications', icon: Mail, description: 'Set up alerts and notifications' }
];

export default function OnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.organizationId as string;
  
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('industry-setup');
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);

  useEffect(() => {
    fetchOrganizationData();
    fetchOnboardingProgress();
  }, [organizationId]);

  const fetchOrganizationData = async () => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}`);
      const data = await response.json();
      setOrganization(data);
    } catch (error) {
      toast.error('Failed to load organization data');
    } finally {
      setLoading(false);
    }
  };

  const fetchOnboardingProgress = async () => {
    try {
      const response = await fetch(`/api/onboarding/${organizationId}/progress`);
      const data = await response.json();
      setCompletedSteps(data.completedSteps || []);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  };

  const completeStep = async (stepId: string) => {
    try {
      await fetch(`/api/onboarding/${organizationId}/complete-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: stepId })
      });
      
      setCompletedSteps(prev => [...prev, stepId]);
      toast.success(`Completed ${stepId.replace('-', ' ')}`);
      
      // Move to next step
      const currentIndex = ONBOARDING_STEPS.findIndex(s => s.id === stepId);
      if (currentIndex < ONBOARDING_STEPS.length - 1) {
        setCurrentStep(ONBOARDING_STEPS[currentIndex + 1].id);
      }
    } catch (error) {
      toast.error('Failed to mark step as complete');
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      await fetch(`/api/onboarding/${organizationId}/complete`, {
        method: 'POST'
      });
      
      toast.success('Onboarding completed! Redirecting to dashboard...');
      setTimeout(() => {
        router.push(`/dashboard`);
      }, 1500);
    } catch (error) {
      toast.error('Failed to complete onboarding');
    }
  };

  const progress = (completedSteps.length / ONBOARDING_STEPS.length) * 100;
  const isComplete = completedSteps.length === ONBOARDING_STEPS.length;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to {organization?.business_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Let's set up your {organization?.industry} dashboard. Complete these steps to get started.
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Setup Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {isComplete && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <CheckCircle className="text-green-500 mr-3 h-5 w-5" />
                <div>
                  <p className="font-medium text-green-800">All steps completed!</p>
                  <p className="text-green-600 text-sm">
                    Your dashboard is ready. You can now access all features.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ONBOARDING_STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            
            return (
              <Card 
                key={step.id} 
                className={`relative overflow-hidden ${
                  isCurrent ? 'ring-2 ring-blue-500' : ''
                } ${isCompleted ? 'border-green-200' : ''}`}
              >
                {isCompleted && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isCompleted ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isCompleted ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <CardTitle className="text-lg">{step.name}</CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                  
                  {!isCompleted ? (
                    <Button
                      onClick={() => router.push(`/onboarding/${organizationId}/${step.id}`)}
                      variant={isCurrent ? "default" : "outline"}
                      className="w-full"
                    >
                      {isCurrent ? 'Continue Setup' : 'Start Step'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => completeStep(step.id)}
                      variant="outline"
                      className="w-full"
                      disabled
                    >
                      Completed
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Skip Onboarding
          </Button>
          
          <Button
            onClick={handleCompleteOnboarding}
            disabled={!isComplete || loading}
            className="bg-green-600 hover:bg-green-700"
          >
            Complete Onboarding
          </Button>
        </div>
      </div>
    </div>
  );
}