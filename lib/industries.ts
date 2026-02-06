export const industryConfigs = {
  pharmacy: {
    name: 'Pharmacy',
    defaultSettings: {
      theme: 'blue',
      features: {
        prescriptionManagement: true,
        inventoryTracking: true,
        patientRecords: true,
        billingIntegration: true,
        complianceReports: true
      },
      modules: ['inventory', 'patients', 'prescriptions', 'billing', 'reports'],
      compliance: ['HIPAA', 'FDA', 'State Regulations'],
      workflows: {
        prescription: ['verify', 'dispense', 'record'],
        inventory: ['order', 'receive', 'dispense', 'audit']
      }
    },
    adminPermissions: [
      'manage_prescriptions',
      'manage_inventory',
      'view_patient_records',
      'generate_reports',
      'manage_users',
      'configure_settings',
      'billing_access'
    ],
    userPermissions: [
      'view_prescriptions',
      'update_inventory',
      'view_reports',
      'manage_patients'
    ],
    onboardingSteps: [
      'setup_inventory',
      'configure_prescriptions',
      'import_patient_data',
      'setup_billing',
      'configure_compliance'
    ]
  },
  
  fashion: {
    name: 'Fashion & Retail',
    defaultSettings: {
      theme: 'pink',
      features: {
        inventoryManagement: true,
        orderProcessing: true,
        customerCRM: true,
        trendAnalysis: true,
        ecommerceIntegration: true
      },
      modules: ['products', 'orders', 'customers', 'analytics', 'marketing'],
      inventory: {
        trackSizes: true,
        trackColors: true,
        lowStockAlerts: true
      }
    },
    adminPermissions: [
      'manage_products',
      'manage_orders',
      'view_analytics',
      'manage_customers',
      'configure_store',
      'manage_promotions'
    ],
    userPermissions: [
      'process_orders',
      'update_inventory',
      'view_sales',
      'manage_customers'
    ],
    onboardingSteps: [
      'setup_catalog',
      'configure_pricing',
      'setup_payment',
      'import_products',
      'configure_shipping'
    ]
  },
  
  education: {
    name: 'Education',
    defaultSettings: {
      theme: 'green',
      features: {
        studentManagement: true,
        courseScheduling: true,
        gradebook: true,
        resourceLibrary: true,
        parentPortal: true
      },
      modules: ['students', 'courses', 'grades', 'attendance', 'resources'],
      academic: {
        gradingScale: 'percentage',
        attendanceTracking: true,
        parentAccess: true
      }
    },
    adminPermissions: [
      'manage_students',
      'manage_courses',
      'manage_faculty',
      'view_grades',
      'configure_academic',
      'manage_resources'
    ],
    userPermissions: [
      'view_students',
      'manage_attendance',
      'enter_grades',
      'access_resources'
    ],
    onboardingSteps: [
      'setup_academic_year',
      'import_students',
      'create_courses',
      'setup_grading',
      'configure_portal'
    ]
  },
  
  healthcare: {
    name: 'Healthcare',
    defaultSettings: {
      theme: 'red',
      features: {
        patientManagement: true,
        appointmentScheduling: true,
        medicalRecords: true,
        billing: true,
        labIntegration: true
      },
      modules: ['patients', 'appointments', 'records', 'billing', 'labs'],
      compliance: ['HIPAA', 'EMR Standards', 'Privacy Laws'],
      appointment: {
        defaultDuration: 30,
        bufferTime: 10,
        maxDaily: 20
      }
    },
    adminPermissions: [
      'manage_patients',
      'manage_appointments',
      'view_records',
      'manage_staff',
      'configure_clinic',
      'billing_access'
    ],
    userPermissions: [
      'view_schedule',
      'update_patients',
      'enter_notes',
      'view_records'
    ],
    onboardingSteps: [
      'setup_schedule',
      'configure_records',
      'setup_billing',
      'import_patient_data',
      'configure_compliance'
    ]
  },
  
  corporate: {
    name: 'Corporate',
    defaultSettings: {
      theme: 'indigo',
      features: {
        projectManagement: true,
        hrManagement: true,
        documentCollaboration: true,
        timeTracking: true,
        reporting: true
      },
      modules: ['projects', 'hr', 'documents', 'time', 'reports'],
      departments: ['HR', 'IT', 'Finance', 'Operations', 'Sales']
    },
    adminPermissions: [
      'manage_projects',
      'manage_employees',
      'view_reports',
      'configure_company',
      'manage_departments',
      'access_finance'
    ],
    userPermissions: [
      'view_projects',
      'track_time',
      'access_documents',
      'submit_reports'
    ],
    onboardingSteps: [
      'setup_departments',
      'import_employees',
      'configure_projects',
      'setup_documentation',
      'configure_workflows'
    ]
  }
};

export type IndustryType = keyof typeof industryConfigs;