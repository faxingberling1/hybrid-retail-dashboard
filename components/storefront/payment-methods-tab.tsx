import React, { useState } from 'react'
import { CreditCard, Wallet, Plus, CheckCircle2, Trash2, ShieldCheck, Smartphone } from 'lucide-react'
import { usePaymentStore, PaymentMethodType } from '@/lib/store/payment-store'

export function PaymentMethodsTab() {
  const { methods, addMethod, removeMethod, setDefaultMethod } = usePaymentStore()
  
  const [isAdding, setIsAdding] = useState(false)
  const [newMethodType, setNewMethodType] = useState<PaymentMethodType>('credit_card')
  
  // Form State
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    mobileNumber: '',
    label: ''
  })

  const getCardProvider = (number: string) => {
    if (number.startsWith('4')) return 'Visa'
    if (number.startsWith('5')) return 'Mastercard'
    return 'Card'
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newMethodType === 'credit_card') {
      if (!formData.cardNumber || !formData.expiry || !formData.cvv) return
      addMethod({
        type: 'credit_card',
        cardNumber: formData.cardNumber.slice(-4), // Just store last 4
        expiry: formData.expiry,
        label: getCardProvider(formData.cardNumber),
        isDefault: false
      })
    } else {
      if (!formData.mobileNumber) return
      addMethod({
        type: newMethodType,
        mobileNumber: formData.mobileNumber,
        label: newMethodType === 'jazzcash' ? 'JazzCash' : 'EasyPaisa',
        isDefault: false
      })
    }
    
    setIsAdding(false)
    setFormData({ cardNumber: '', expiry: '', cvv: '', mobileNumber: '', label: '' })
  }

  const handleTopUp = () => {
    usePaymentStore.getState().topUpWallet(1000)
    // Optional: show a mini local success text if needed, but balance update is instant
  }

  return (
    <div className="space-y-6">
      {/* Wallet Card */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 mb-2">
              <Wallet className="w-6 h-6" />
              <span className="font-bold tracking-widest uppercase text-sm">Hybrid Wallet</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black mb-2">
              <span className="text-2xl text-indigo-300 font-bold mr-1">Rs.</span> 
              {usePaymentStore.getState().walletBalance.toLocaleString()}
            </h3>
            <p className="text-indigo-200 font-medium max-w-sm text-sm">Use wallet balance for instant, 1-click checkouts.</p>
          </div>
          <button onClick={handleTopUp} className="px-6 py-3 bg-white text-indigo-900 rounded-full font-black shadow-lg shadow-white/10 hover:scale-105 transition-transform flex items-center gap-2">
            <Plus className="w-5 h-5" /> Top Up Wallet
          </button>
        </div>
      </div>

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
            {[
              { id: 'credit_card', label: 'Credit/Debit Card', icon: CreditCard },
              { id: 'jazzcash', label: 'JazzCash', icon: Smartphone },
              { id: 'easypaisa', label: 'EasyPaisa', icon: Wallet },
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setNewMethodType(type.id as PaymentMethodType)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-bold transition-all ${
                  newMethodType === type.id 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <type.icon className="w-5 h-5" />
                {type.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {newMethodType === 'credit_card' ? (
              <>
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
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Mobile Account Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-400 font-bold">+92</span>
                  <input 
                    type="text" 
                    required
                    maxLength={10}
                    placeholder="300 1234567"
                    value={formData.mobileNumber} 
                    onChange={e => setFormData({...formData, mobileNumber: e.target.value})} 
                    className="w-full p-4 pl-14 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50" 
                  />
                </div>
              </div>
            )}
            
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
                className={`relative bg-white rounded-2xl p-6 border-2 transition-all ${
                  method.isDefault 
                    ? 'border-indigo-500 shadow-sm' 
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    method.type === 'credit_card' ? 'bg-slate-900 text-white' :
                    method.type === 'jazzcash' ? 'bg-red-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {method.type === 'credit_card' ? <CreditCard className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Default
                      </span>
                    )}
                    <button 
                      onClick={() => removeMethod(method.id)}
                      className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-gray-900 text-lg mb-1">{method.label}</h4>
                  <p className="text-gray-500 font-mono tracking-widest text-sm mb-4">
                    {method.type === 'credit_card' ? `•••• •••• •••• ${method.cardNumber}` : `+92 ${method.mobileNumber}`}
                  </p>
                </div>

                {!method.isDefault && (
                  <button 
                    onClick={() => setDefaultMethod(method.id)}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Set as default
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
