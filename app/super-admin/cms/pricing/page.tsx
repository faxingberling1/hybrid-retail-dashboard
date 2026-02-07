"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, DollarSign, Check } from "lucide-react";

export default function PricingCMS() {
    const [plans, setPlans] = useState([
        {
            id: 1,
            name: "Essential",
            price: 2999,
            priceUSD: 29,
            features: ["Single Location", "Up to 3 Users", "Basic Reporting", "Email Support"]
        },
        {
            id: 2,
            name: "Professional",
            price: 7999,
            priceUSD: 79,
            popular: true,
            features: ["Up to 5 Locations", "Unlimited Users", "Advanced Analytics", "Priority Support", "API Access"]
        },
        {
            id: 3,
            name: "Enterprise",
            price: 0,
            priceUSD: 0,
            custom: true,
            features: ["Unlimited Locations", "Dedicated Support", "Custom Integrations", "SLA Guarantee", "White Label"]
        }
    ]);

    const [isSaving, setIsSaving] = useState(false);

    const updatePlan = (id: number, field: string, value: any) => {
        setPlans(plans.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pricing Plans</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage subscription tiers and pricing</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6"
                    >
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-2">Plan Name</label>
                            <input
                                type="text"
                                value={plan.name}
                                onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-bold text-lg"
                            />
                        </div>

                        {!plan.custom && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-2">PKR Price</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="number"
                                                value={plan.price}
                                                onChange={(e) => updatePlan(plan.id, 'price', parseInt(e.target.value))}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-2">USD Price</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="number"
                                                value={plan.priceUSD}
                                                onChange={(e) => updatePlan(plan.id, 'priceUSD', parseInt(e.target.value))}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-2">Features (one per line)</label>
                            <textarea
                                value={plan.features.join('\n')}
                                onChange={(e) => updatePlan(plan.id, 'features', e.target.value.split('\n'))}
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={plan.popular || false}
                                onChange={(e) => updatePlan(plan.id, 'popular', e.target.checked)}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <label className="text-sm font-bold text-gray-700">Mark as Popular</label>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-8">
                <h3 className="text-sm font-black uppercase tracking-wider text-purple-900 mb-6">Preview</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div key={plan.id} className={`bg-white p-8 rounded-2xl border-2 ${plan.popular ? 'border-blue-500' : 'border-gray-100'}`}>
                            {plan.popular && (
                                <div className="text-xs font-black uppercase tracking-wider text-blue-600 mb-2">Most Popular</div>
                            )}
                            <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
                            <div className="mb-6">
                                {plan.custom ? (
                                    <div className="text-3xl font-black text-gray-900">Custom</div>
                                ) : (
                                    <>
                                        <div className="text-4xl font-black text-gray-900">PKR {plan.price.toLocaleString()}</div>
                                        <div className="text-sm text-gray-500">USD ${plan.priceUSD}/mo</div>
                                    </>
                                )}
                            </div>
                            <ul className="space-y-3">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
