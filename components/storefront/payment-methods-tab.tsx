import React, { useState } from 'react'
import { CreditCard, Plus, CheckCircle2, Trash2, ShieldCheck } from 'lucide-react'
import { usePaymentStore } from '@/lib/store/payment-store'

export function PaymentMethodsTab() {
  const { methods, addMethod, removeMethod, setDefaultMethod } = usePaymentStore()
  
  const [isAdding, setIsAdding] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    label: ''
  })

  const getCardProvider = (number: string) => {
    if (number.startsWith('4')) return 'Visa'
    if (number.startsWith('5')) return 'Mastercard'
    return 'Card'
  }

  const getCardBg = (label?: string) => {
    const l = (label || '').toLowerCase();
    if (l.includes('mastercard')) return 'bg-gradient-to-br from-gray-900 via-slate-800 to-black border-slate-700';
    if (l.includes('visa')) return 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 border-blue-800';
    return 'bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 border-indigo-700';
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.cardNumber || !formData.expiry || !formData.cvv) return
    addMethod({
      type: 'credit_card',
      cardNumber: formData.cardNumber.slice(-4), // Just store last 4
      expiry: formData.expiry,
      label: getCardProvider(formData.cardNumber),
      isDefault: false
    })
    
    setIsAdding(false)
    setFormData({ cardNumber: '', expiry: '', cvv: '', label: '' })
  }

  const handleTopUp = () => {
    usePaymentStore.getState().topUpWallet(1000)
    // Optional: show a mini local success text if needed, but balance update is instant
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between mb-6 pt-4">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-indigo-500" />
          Saved Payment Methods
        </h2>
        
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl font-bold transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Secure Payment
          </h3>
          
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            <button
              type="button"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-bold transition-all border-indigo-600 bg-indigo-50 text-indigo-700"
            >
              <CreditCard className="w-5 h-5" />
              Credit/Debit Card
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Card Number</label>
              <input 
                type="text" 
                required
                maxLength={19}
                placeholder="0000 0000 0000 0000"
                value={formData.cardNumber} 
                onChange={e => setFormData({...formData, cardNumber: e.target.value})} 
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Expiry (MM/YY)</label>
                <input 
                  type="text" 
                  required
                  placeholder="MM/YY"
                  maxLength={5}
                  value={formData.expiry} 
                  onChange={e => setFormData({...formData, expiry: e.target.value})} 
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">CVV</label>
                <input 
                  type="password" 
                  required
                  placeholder="•••"
                  maxLength={4}
                  value={formData.cvv} 
                  onChange={e => setFormData({...formData, cvv: e.target.value})} 
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50" 
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)} 
                className="px-6 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                Save Payment Method
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {methods.length === 0 ? (
             <div className="md:col-span-2 bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                 <CreditCard className="w-8 h-8 text-gray-300" />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-1">No payment methods saved</h3>
               <p className="text-gray-500 mb-6">Add a card or wallet for faster checkout.</p>
             </div>
          ) : (
            methods.map(method => (
              <div 
                key={method.id} 
                className={`relative rounded-2xl p-6 md:p-8 transition-all overflow-hidden shadow-xl text-white flex flex-col justify-between aspect-[1.58/1] border ${getCardBg(method.label)} ${
                  method.isDefault 
                    ? 'ring-4 ring-indigo-500 ring-offset-2' 
                    : 'hover:-translate-y-1 hover:shadow-2xl'
                }`}
              >
                {/* Decorative background circles */}
                <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute left-0 bottom-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>

                <div className="relative z-10 flex justify-between items-start">
                  <div className="w-12 h-9 bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 rounded-md opacity-90 shadow-sm border border-amber-200/50 flex flex-col justify-center items-center overflow-hidden">
                    <div className="w-full h-[1px] bg-amber-600/30 mb-1"></div>
                    <div className="w-full h-[1px] bg-amber-600/30 mb-1"></div>
                    <div className="w-full h-[1px] bg-amber-600/30"></div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <span className="text-[10px] font-black bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest border border-white/10">
                        <CheckCircle2 className="w-3 h-3" /> Default
                      </span>
                    )}
                    <button 
                      onClick={() => removeMethod(method.id)}
                      className="p-2 text-white/60 hover:text-rose-400 hover:bg-rose-500/20 rounded-full transition-colors backdrop-blur-md border border-transparent hover:border-rose-500/30"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <p className="font-mono text-xl md:text-2xl tracking-widest mb-6 opacity-90 drop-shadow-md flex items-center justify-between px-1">
                    <span className="opacity-70 mt-1">••••</span> 
                    <span className="opacity-70 mt-1">••••</span> 
                    <span className="opacity-70 mt-1">••••</span> 
                    <span>{method.cardNumber}</span>
                  </p>
                  <div className="flex justify-between items-end">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest opacity-60 font-bold mb-1">Card Holder</p>
                        <p className="font-bold tracking-wider uppercase text-sm drop-shadow-sm">HYBRID USER</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest opacity-60 font-bold mb-1">Valid Thru</p>
                        <p className="font-mono text-sm tracking-widest font-bold drop-shadow-sm">{method.expiry || '12/28'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {method.label?.toLowerCase().includes('mastercard') ? (
                        <div className="flex -space-x-3 items-center opacity-90">
                          <div className="w-8 h-8 rounded-full bg-rose-500"></div>
                          <div className="w-8 h-8 rounded-full bg-amber-500 opacity-80 mix-blend-screen"></div>
                        </div>
                      ) : method.label?.toLowerCase().includes('visa') ? (
                        <h4 className="font-black text-3xl italic tracking-tighter drop-shadow-sm opacity-90">VISA</h4>
                      ) : (
                        <h4 className="font-black text-xl italic drop-shadow-sm opacity-90">{method.label}</h4>
                      )}
                    </div>
                  </div>
                </div>

                {!method.isDefault && (
                  <div className="absolute inset-x-0 bottom-0 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-6 flex justify-center backdrop-blur-[2px] z-20">
                    <button 
                      onClick={() => setDefaultMethod(method.id)}
                      className="text-xs font-black bg-white text-gray-900 px-6 py-2.5 rounded-full shadow-2xl hover:scale-105 transition-transform"
                    >
                      Set as Default
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
