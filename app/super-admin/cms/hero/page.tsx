"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, RotateCcw, Eye, Sparkles } from "lucide-react";

export default function HeroSectionCMS() {
    const [heroData, setHeroData] = useState({
        badge: "Pakistan's No.1 Retail Management System",
        title: "Retail Perfected.",
        subtitle: "The high-fidelity ecosystem for professional commerce. Real-time synchronization, neural inventory, and zero-latency performance.",
        ctaPrimary: "Get Started Free",
        ctaSecondary: "Schedule a Demo"
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: Implement API call to save hero data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
    };

    const handleReset = () => {
        setHeroData({
            badge: "Pakistan's No.1 Retail Management System",
            title: "Retail Perfected.",
            subtitle: "The high-fidelity ecosystem for professional commerce. Real-time synchronization, neural inventory, and zero-latency performance.",
            ctaPrimary: "Get Started Free",
            ctaSecondary: "Schedule a Demo"
        });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hero Section</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage the main landing page hero content</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset
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

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6"
            >
                {/* Badge */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Hero Badge
                    </label>
                    <input
                        type="text"
                        value={heroData.badge}
                        onChange={(e) => setHeroData({ ...heroData, badge: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Enter badge text"
                    />
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Main Title
                    </label>
                    <input
                        type="text"
                        value={heroData.title}
                        onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-2xl font-bold"
                        placeholder="Enter main title"
                    />
                </div>

                {/* Subtitle */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Subtitle
                    </label>
                    <textarea
                        value={heroData.subtitle}
                        onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        placeholder="Enter subtitle text"
                    />
                </div>

                {/* CTA Buttons */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Primary CTA
                        </label>
                        <input
                            type="text"
                            value={heroData.ctaPrimary}
                            onChange={(e) => setHeroData({ ...heroData, ctaPrimary: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Primary button text"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Secondary CTA
                        </label>
                        <input
                            type="text"
                            value={heroData.ctaSecondary}
                            onChange={(e) => setHeroData({ ...heroData, ctaSecondary: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Secondary button text"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Preview */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-8">
                <div className="flex items-center gap-2 mb-6">
                    <Eye className="h-5 w-5 text-purple-600" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-purple-900">Live Preview</h3>
                </div>
                <div className="bg-white rounded-xl p-12 text-center space-y-6">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-600">
                        <Sparkles className="h-4 w-4 mr-2" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">{heroData.badge}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900">
                        {heroData.title}
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        {heroData.subtitle}
                    </p>
                    <div className="flex gap-4 justify-center pt-4">
                        <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm">
                            {heroData.ctaPrimary}
                        </button>
                        <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-2xl font-bold text-sm">
                            {heroData.ctaSecondary}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
