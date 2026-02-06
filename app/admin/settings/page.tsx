"use client"

import { useState, useEffect } from "react"
import {
    Settings, Store, Bell, Shield,
    Globe, CreditCard, Puzzle, HelpCircle,
    Save, ChevronRight, CheckCircle2, Moon,
    Smartphone, Share2, Languages, Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

import { GeneralSettings } from "@/components/dashboard/settings/general-settings"
import { NotificationSettings } from "@/components/dashboard/settings/notification-settings"
import { PaymentSettings } from "@/components/dashboard/settings/payment-settings"
import { SecuritySettings } from "@/components/dashboard/settings/security-settings"
import { IntegrationSettings } from "@/components/dashboard/settings/integration-settings"
import { DeleteAccountModal } from "@/components/dashboard/settings/delete-account-modal"
import { signOut } from "next-auth/react"

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("GENERAL")
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [data, setData] = useState({
        organization: {
            name: "",
            billing_email: "",
            address: "",
            currency: "PKR",
            timezone: "Asia/Karachi",
            settings: {}
        },
        notifications: {
            email_notifications: true,
            push_notifications: true,
            desktop_notifications: true,
            digest_frequency: "realtime"
        }
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/admin/settings")
            const resData = await response.json()
            if (resData.error) throw new Error(resData.error)
            setData({
                organization: resData.organization || data.organization,
                notifications: resData.notifications || data.notifications
            })
        } catch (error: any) {
            toast.error(`Fetch Failed: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const response = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            if (!response.ok) throw new Error("Broadcast Refused")
            toast.success("Settings Synchronized")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSaving(false)
        }
    }

    const handleOrgChange = (field: string, value: any) => {
        setData(prev => ({
            ...prev,
            organization: { ...prev.organization, [field]: value }
        }))
    }

    const handleNotificationChange = (field: string, value: any) => {
        setData(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [field]: value }
        }))
    }

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch("/api/admin/account/delete", {
                method: "DELETE"
            })
            if (!response.ok) throw new Error("Deletion failed")

            toast.success("Account Destroyed. Redirecting...")
            setTimeout(() => {
                signOut({ callbackUrl: "/login" })
            }, 2000)
        } catch (error: any) {
            toast.error(error.message)
            setIsDeleting(false)
        }
    }

    const tabs = [
        { id: "GENERAL", label: "General", icon: <Store className="h-4 w-4" /> },
        { id: "NOTIFICATIONS", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
        { id: "PAYMENTS", label: "Payments", icon: <CreditCard className="h-4 w-4" /> },
        { id: "SECURITY", label: "Security", icon: <Shield className="h-4 w-4" /> },
        { id: "INTEGRATIONS", label: "Integrations", icon: <Puzzle className="h-4 w-4" /> }
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Accessing Cipher...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                isLoading={isDeleting}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Store Settings</h1>
                    <p className="text-gray-500 font-medium">Fine-tune your store's configuration and preferences</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-gray-900/20 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-70"
                >
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    {isSaving ? "Syncing..." : "Save Changes"}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Navigation Sidebar */}
                <div className="lg:w-72 flex-shrink-0">
                    <div className="bg-white rounded-[2.5rem] p-4 border border-gray-100 shadow-xl shadow-gray-200/20 sticky top-8">
                        <div className="space-y-1.5">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm
                                        ${activeTab === tab.id
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                                    `}
                                >
                                    {tab.icon}
                                    {tab.label}
                                    {activeTab === tab.id && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">System Status</div>
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-gray-700">Operational</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === "GENERAL" && (
                                <GeneralSettings data={data.organization} onChange={handleOrgChange} />
                            )}
                            {activeTab === "NOTIFICATIONS" && (
                                <NotificationSettings data={data.notifications} onChange={handleNotificationChange} />
                            )}
                            {activeTab === "PAYMENTS" && (
                                <PaymentSettings data={data.organization.settings} onChange={(f, v) => handleOrgChange('settings', { ...data.organization.settings, [f]: v })} />
                            )}
                            {activeTab === "SECURITY" && (
                                <SecuritySettings data={data.organization.settings} onChange={(f, v) => handleOrgChange('settings', { ...data.organization.settings, [f]: v })} />
                            )}
                            {activeTab === "INTEGRATIONS" && (
                                <IntegrationSettings data={data.organization.settings} />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Danger Zone */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 p-12 bg-rose-50/30 rounded-[3.5rem] border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-8"
                    >
                        <div>
                            <h3 className="text-xl font-black text-rose-900 mb-2">Danger Zone</h3>
                            <p className="text-sm text-rose-700/60 font-medium max-w-md">
                                Permanently delete this organization and all associated data. This action cannot be undone.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="px-10 py-5 bg-white border-2 border-rose-200 text-rose-600 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm active:scale-95"
                        >
                            Delete Account
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Footer Support */}
            <div className="mt-20 py-12 border-t border-gray-100 flex flex-col items-center">
                <HelpCircle className="h-10 w-10 text-gray-300 mb-4" />
                <h3 className="text-lg font-black text-gray-900 mb-2">Need Help with Configuration?</h3>
                <p className="text-gray-500 font-medium mb-8 text-center max-w-sm">
                    Our specialized onboarding team is ready to assist you with any advanced setup requirements.
                </p>
                <button className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline">
                    Open Support Portal
                </button>
            </div>
        </div>
    )
}
