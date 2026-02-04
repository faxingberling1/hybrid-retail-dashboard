// app/auth/signup/steps/user-invitation.tsx
'use client'

import { useState } from 'react'
import { Users, Mail, X, Plus, UserCheck, Shield, Zap, BarChart3, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ROLES = [
  { value: 'MANAGER', label: 'Command', description: 'Operations & Staff Sync', icon: Zap },
  { value: 'USER', label: 'Operator', description: 'Core Task Execution', icon: UserCheck },
  { value: 'VIEWER', label: 'Analyst', description: 'Intelligence & Reports', icon: BarChart3 },
  { value: 'ACCOUNTANT', label: 'Vault', description: 'Fiscal & Asset Flow', icon: Shield },
]

export default function UserInvitation({ formData, updateFormData, theme }: any) {
  const [emailInput, setEmailInput] = useState('')
  const [selectedRole, setSelectedRole] = useState('USER')
  const [emailError, setEmailError] = useState('')
  const isGalactic = theme === 'galactic'

  const inputClasses = `flex-1 px-6 py-4 rounded-2xl border-2 transition-all duration-300 outline-none font-medium ${isGalactic
    ? 'bg-white/5 border-white/5 text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:bg-white/10'
    : 'bg-white border-slate-100 text-slate-900 placeholder:text-slate-400 focus:border-sky-500/50 focus:bg-white'
    }`

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const addUser = () => {
    if (!emailInput.trim()) {
      setEmailError('Node Identifier Required')
      return
    }
    if (!validateEmail(emailInput)) {
      setEmailError('Invalid Protocol Format')
      return
    }
    if (formData.userEmails.includes(emailInput)) {
      setEmailError('Node Already Synchronized')
      return
    }

    updateFormData({
      userEmails: [...formData.userEmails, emailInput],
      userRoles: [...formData.userRoles, selectedRole]
    })

    setEmailInput('')
    setEmailError('')
  }

  const removeUser = (index: number) => {
    const newEmails = [...formData.userEmails]
    const newRoles = [...formData.userRoles]
    newEmails.splice(index, 1)
    newRoles.splice(index, 1)
    updateFormData({ userEmails: newEmails, userRoles: newRoles })
  }

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className={`text-3xl font-black tracking-tighter ${isGalactic ? 'text-white' : 'text-slate-900'}`}>Invite Your Team</h2>
        <p className={`text-sm font-medium leading-relaxed ${isGalactic ? 'text-slate-400' : 'text-slate-500'}`}>
          Add team members to your organization and assign their roles.
        </p>
      </div>

      <div className="space-y-8">
        {/* Add User Form */}
        <div className={`p-8 rounded-[2.5rem] border-2 shadow-sm ${isGalactic ? 'bg-white/5 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
          <div className="flex items-center space-x-3 mb-6">
            <Plus className={`w-4 h-4 ${isGalactic ? 'text-violet-400' : 'text-sky-600'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Invite New Member</span>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex gap-4">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value)
                    setEmailError('')
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && addUser()}
                  className={`${inputClasses} ${emailError ? 'border-rose-500/50' : ''}`}
                  placeholder="operator@nexus.io"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={addUser}
                  className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isGalactic ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-slate-900 text-white shadow-xl shadow-slate-900/10'
                    }`}
                >
                  Provision
                </motion.button>
              </div>
              {emailError && (
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter ml-2">{emailError}</p>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Tier</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {ROLES.map(role => {
                  const Icon = role.icon
                  const isSelected = selectedRole === role.value
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 group ${isSelected
                        ? (isGalactic ? 'bg-white text-black border-white shadow-xl' : 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20')
                        : (isGalactic ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-white border-slate-100 hover:border-slate-200')
                        }`}
                    >
                      <Icon className={`w-5 h-5 mb-3 transition-colors ${isSelected ? (isGalactic ? 'text-black' : 'text-white') : (isGalactic ? 'text-violet-400' : 'text-sky-500')}`} />
                      <div className="font-black text-[11px] tracking-tight">{role.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Invited Users List */}
        <AnimatePresence mode="popLayout">
          {formData.userEmails.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Provisioned Nodes ({formData.userEmails.length})</span>
              </div>
              <div className="grid gap-3">
                {formData.userEmails.map((email: string, index: number) => (
                  <motion.div
                    key={email}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`flex items-center justify-between p-4 rounded-[1.5rem] border transition-all ${isGalactic ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:shadow-md'
                      }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-xl ${isGalactic ? 'bg-white/5 text-violet-400' : 'bg-slate-50 text-sky-600'}`}>
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`font-black text-xs tracking-tight ${isGalactic ? 'text-white' : 'text-slate-900'}`}>{email}</div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          Tier: {ROLES.find(r => r.value === formData.userRoles[index])?.label}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeUser(index)}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`text-center py-12 border-2 border-dashed rounded-[2.5rem] ${isGalactic ? 'border-white/10' : 'border-slate-200'}`}>
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4 opacity-50" />
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Isolated Environment</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1 leading-relaxed uppercase tracking-tighter">
                No external nodes synchronized. You will be the sole operator.
              </p>
            </div>
          )}
        </AnimatePresence>

        <div className={`p-6 border rounded-[2rem] flex items-center space-x-5 ${isGalactic ? 'bg-white/5 border-white/5 opacity-60' : 'bg-slate-50 border-slate-100'}`}>
          <div className={`p-2 rounded-xl ${isGalactic ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
            <Info className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-slate-500">
            Node invitations are optional. Operators will receive a synchronization link via encrypted email protocols once initialization is complete.
          </p>
        </div>
      </div>
    </div>
  )
}