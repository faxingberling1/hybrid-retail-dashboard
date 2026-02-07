"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, GripVertical, Sparkles } from "lucide-react";

export default function FeaturesCMS() {
    const [features, setFeatures] = useState([
        { id: 1, title: "Dynamic POS Engine", description: "Zero-latency transaction processing with offline resilience and multi-terminal sync.", icon: "ShoppingCart" },
        { id: 2, title: "Intelligent Inventory", description: "Neural-driven stock monitoring with automated reordering and predictive analytics.", icon: "Package" },
        { id: 3, title: "Growth Intelligence", description: "Real-time visual reports and AI-powered business insights for rapid scaling.", icon: "PieChart" },
    ]);

    const [isSaving, setIsSaving] = useState(false);

    const addFeature = () => {
        const newId = Math.max(...features.map(f => f.id), 0) + 1;
        setFeatures([...features, {
            id: newId,
            title: "New Feature",
            description: "Feature description",
            icon: "Sparkles"
        }]);
    };

    const removeFeature = (id: number) => {
        setFeatures(features.filter(f => f.id !== id));
    };

    const updateFeature = (id: number, field: string, value: string) => {
        setFeatures(features.map(f => f.id === id ? { ...f, [field]: value } : f));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Features Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage feature cards on the landing page</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={addFeature}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Feature
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Features List */}
            <div className="space-y-4">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl border border-gray-200 p-6"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-2 cursor-move text-gray-400 hover:text-gray-600">
                                <GripVertical className="h-5 w-5" />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={feature.title}
                                            onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-2">Icon</label>
                                        <select
                                            value={feature.icon}
                                            onChange={(e) => updateFeature(feature.id, 'icon', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        >
                                            <option value="ShoppingCart">Shopping Cart</option>
                                            <option value="Package">Package</option>
                                            <option value="PieChart">Pie Chart</option>
                                            <option value="Users">Users</option>
                                            <option value="Globe">Globe</option>
                                            <option value="Shield">Shield</option>
                                            <option value="Sparkles">Sparkles</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-2">Description</label>
                                    <textarea
                                        value={feature.description}
                                        onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => removeFeature(feature.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-8">
                <h3 className="text-sm font-black uppercase tracking-wider text-purple-900 mb-6">Preview</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((feature) => (
                        <div key={feature.id} className="bg-white p-6 rounded-2xl border border-gray-100">
                            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                <Sparkles className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-black text-gray-900 mb-2">{feature.title}</h4>
                            <p className="text-sm text-gray-500">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
