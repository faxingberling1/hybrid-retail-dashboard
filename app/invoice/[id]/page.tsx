import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { MapPin, Phone, Mail, Globe, Printer } from "lucide-react"
import { PrintButton } from "./print-button"

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const { id } = await params
  
  const order = await prisma.storefrontOrder.findUnique({
    where: { id },
    include: {
      items: true,
      address: true,
      user: true
    }
  })

  if (!order) {
    notFound()
  }

  const invoiceDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-100 py-12 print:py-0 print:bg-white flex justify-center font-sans">
      <div className="w-full max-w-4xl bg-white shadow-2xl print:shadow-none print:max-w-full mx-auto relative">
        
        {/* Print Action Header (Hidden in print mode) */}
        <div className="absolute top-8 right-8 print:hidden z-10">
          <PrintButton />
        </div>

        {/* Invoice Container */}
        <div className="p-12 md:p-16 relative">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 border-b-4 border-indigo-600 pb-12">
            <div>
              <h1 className="text-4xl font-black text-indigo-600 tracking-tighter mb-1">HybridPOS</h1>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Storefront Receipt</p>
            </div>
            <div className="text-right mt-6 md:mt-0">
              <h2 className="text-5xl font-black text-slate-900 mb-2">INVOICE</h2>
              <p className="text-lg font-bold text-slate-500">#{order.id.split('-')[0].toUpperCase()}</p>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            
            {/* Bill To */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Billed To</p>
              {order.address ? (
                <div className="text-slate-700">
                  <p className="font-bold text-slate-900 text-lg mb-1">{order.address.name}</p>
                  <p className="mb-1">{order.address.street}</p>
                  <p className="mb-1">{order.address.city}</p>
                  <p className="mt-2 text-sm font-bold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-indigo-500" /> {order.address.phone}
                  </p>
                </div>
              ) : (
                <p className="text-slate-500">Customer Details Not Found</p>
              )}
            </div>

            {/* Invoice Info */}
            <div className="md:text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Invoice Details</p>
              <div className="space-y-2">
                <div className="flex justify-between md:justify-end gap-8">
                  <span className="text-slate-500 font-medium">Issue Date:</span>
                  <span className="font-bold text-slate-900">{invoiceDate}</span>
                </div>
                <div className="flex justify-between md:justify-end gap-8">
                  <span className="text-slate-500 font-medium">Payment Method:</span>
                  <span className="font-bold text-slate-900 uppercase">{order.payment_method}</span>
                </div>
                <div className="flex justify-between md:justify-end gap-8">
                  <span className="text-slate-500 font-medium">Payment Status:</span>
                  <span className={`font-bold uppercase ${order.payment_status === 'PAID' ? 'text-green-600' : 'text-amber-500'}`}>
                    {order.payment_status}
                  </span>
                </div>
              </div>
            </div>
            
          </div>

          {/* Table Section */}
          <div className="mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Description</th>
                  <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Qty</th>
                  <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Unit Price</th>
                  <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {order.items.map((item, index) => (
                  <tr key={item.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-6">
                      <p className="font-bold text-slate-900">{item.name}</p>
                    </td>
                    <td className="py-6 text-center font-medium">{item.quantity}</td>
                    <td className="py-6 text-right font-medium">Rs. {Number(item.price).toLocaleString()}</td>
                    <td className="py-6 text-right font-bold text-slate-900">
                      Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-16">
            <div className="w-full md:w-1/2 space-y-4 bg-slate-50 p-6 rounded-2xl print:bg-transparent print:p-0">
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Subtotal</span>
                <span>Rs. {(Number(order.total_amount) - Number(order.delivery_fee) + Number(order.discount_amount)).toLocaleString()}</span>
              </div>
              
              {Number(order.delivery_fee) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Delivery Fee</span>
                  <span>Rs. {Number(order.delivery_fee).toLocaleString()}</span>
                </div>
              )}
              
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span className="font-medium">Discount</span>
                  <span>- Rs. {Number(order.discount_amount).toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t-2 border-slate-200">
                <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Total Amount</span>
                <span className="text-3xl font-black text-indigo-600">Rs. {Number(order.total_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="border-t border-slate-200 pt-8 mt-16 text-center md:text-left text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>Thank you for shopping with HybridPOS!</p>
            <div className="flex gap-6">
              <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> hybridpos.com</span>
              <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@hybridpos.com</span>
            </div>
          </div>

        </div>
      </div>
      
      {/* Background styling to look like a desk */}
      <div className="fixed inset-0 bg-slate-900 -z-10 print:hidden opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
    </div>
  )
}
