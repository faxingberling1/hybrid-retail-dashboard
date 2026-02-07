"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, Link as LinkIcon, ExternalLink } from "lucide-react";

export default function ResourcesCMS() {
    const [resources, setResources] = useState([
        { id: 1, title: "Blog", url: "/blog", description: "Latest insights and updates" },
        { id: 2, title: "Knowledge Base", url: "/knowledge-base", description: "Documentation and guides" },
        { id: 3, title: "Request Feature", url: "/feedback", description: "Submit feature requests" }
    ]);

    const [isSaving, setIsSaving] = useState(false);

    const addResource = () => {
        const newId = Math.max(...resources.map(r => r.id), 0) + 1;
        setResources([...resources, {
            id: newId,
            title: "New Resource",
            url: "/new-resource",
            description: "Resource description"
        }]);
    };

    const removeResource = (id: number) => {
        setResources(resources.filter(r => r.id !== id));
    };

    const updateResource = (id: number, field: string, value: string) => {
        setResources(resources.map(r => r.id === id ? { ...r, [field]: value } : r));
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
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Resources Menu</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage header dropdown resources</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={addResource}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Resource
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

            <div className="space-y-4">
                {resources.map((resource, index) => (
                    <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl border border-gray-200 p-6"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={resource.title}
                                            onChange={(e) => updateResource(resource.id, 'title', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-2">URL</label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={resource.url}
                                                onChange={(e) => updateResource(resource.id, 'url', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                placeholder="/path or https://..."
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-2">Description (optional)</label>
                                    <input
                                        type="text"
                                        value={resource.description}
                                        onChange={(e) => updateResource(resource.id, 'description', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Brief description"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => removeResource(resource.id)}
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
                <h3 className="text-sm font-black uppercase tracking-wider text-purple-900 mb-6">Dropdown Preview</h3>
                <div className="bg-white rounded-2xl border border-gray-200 p-4 max-w-xs shadow-xl">
                    <div className="space-y-2">
                        {resources.map((resource) => (
                            <a
                                key={resource.id}
                                href={resource.url}
                                className="flex items-center justify-between px-4 py-2 rounded-xl hover:bg-gray-50 transition-all group"
                            >
                                <div>
                                    <div className="text-sm font-bold text-gray-900">{resource.title}</div>
                                    {resource.description && (
                                        <div className="text-xs text-gray-500">{resource.description}</div>
                                    )}
                                </div>
                                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
