// Mock API functions for billing
export const billingAPI = {
  // Get all invoices
  getInvoices: async () => {
    return {
      data: [
        {
          id: 1,
          organization: "FashionHub Retail",
          invoiceId: "INV-2024-001",
          amount: 45000,
          status: "paid",
          dueDate: "2024-01-15",
          paymentDate: "2024-01-10",
        },
        // ... more mock data
      ],
      total: 42,
      page: 1,
      limit: 10
    }
  },

  // Send reminder
  sendReminder: async (invoiceId: number, type: 'email' | 'sms', message: string) => {
    console.log(`Sending ${type} reminder for invoice ${invoiceId}: ${message}`)
    return { success: true, message: "Reminder sent successfully" }
  },

  // Mark as paid
  markAsPaid: async (invoiceId: number) => {
    console.log(`Marking invoice ${invoiceId} as paid`)
    return { success: true, message: "Invoice marked as paid" }
  },

  // Get billing stats
  getStats: async () => {
    return {
      totalRevenue: 8400000,
      pendingPayments: 90000,
      overduePayments: 65000,
      monthlyGrowth: 23
    }
  }
}