import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const SETTINGS_KEY = 'landing_page_content'

// Default content to seed if none exists
const defaultContent = {
    hero: {
        badge: "Pakistan's No.1 Retail Management System",
        title: "Retail Perfected.",
        subtitle: "The high-fidelity ecosystem for professional commerce. Real-time synchronization, neural inventory, and zero-latency performance.",
        ctaPrimary: "Get Started Free",
        ctaSecondary: "Schedule a Demo"
    },
    features: [
        {
            title: "Dynamic POS Engine",
            desc: "Zero-latency transaction processing with offline resilience and multi-terminal sync.",
            icon: "ShoppingCart",
            color: "from-sky-500 to-blue-600"
        },
        {
            title: "Intelligent Inventory",
            desc: "Neural-driven stock monitoring with automated reordering and predictive analytics.",
            icon: "Package",
            color: "from-emerald-500 to-teal-600"
        },
        {
            title: "Growth Intelligence",
            desc: "Real-time visual reports and AI-powered business insights for rapid scaling.",
            icon: "PieChart",
            color: "from-violet-500 to-purple-600"
        },
        {
            title: "Staff Optimization",
            desc: "Advanced shift management, performance tracking, and granular access control.",
            icon: "Users",
            color: "from-rose-500 to-pink-600"
        },
        {
            title: "Regional Mesh",
            desc: "Distributed database architecture ensuring speed and data integrity anywhere.",
            icon: "Globe",
            color: "from-amber-500 to-orange-600"
        },
        {
            title: "Hardened Security",
            desc: "Bank-grade encryption with multi-factor authentication and audit logging.",
            icon: "Shield",
            color: "from-indigo-500 to-cyan-600"
        }
    ],
    enterprise: {
        badge: "Mission Critical",
        title: "Command Your Enterprise.",
        subtitle: "The scale-out infrastructure for retail giants. Dedicated zones, custom sharding, and 24/7 priority support.",
        cta: "Deploy Enterprise",
        features: [
            { title: "Global Sharding", desc: "Private mesh nodes isolated from public traffic.", icon: "Globe" },
            { title: "Granular Access", desc: "Role-based permission scaling with biometrics.", icon: "Users" },
            { title: "Forensic Logs", desc: "Immutable activity tracking with 7-year retention.", icon: "Lock" }
        ]
    },
    header: {
        logoText: "HybridPOS",
        logoSubtext: "Enterprise Unified",
        links: [
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Blog", href: "/blog" }
        ],
        ctaText: "Login",
        ctaHref: "/login"
    },
    footer: {
        tagline: "The ultimate retail ecosystem. Synchronized, secure, and scalable.",
        columns: [
            {
                title: "Ecosystem",
                links: [
                    { label: "POS Core", href: "#" },
                    { label: "Inventory Mesh", href: "#" },
                    { label: "Documentation", href: "/docs" }
                ]
            },
            {
                title: "Network",
                links: [
                    { label: "Regional Nodes", href: "#" },
                    { label: "Uptime Map", href: "#" },
                    { label: "Partners", href: "#" }
                ]
            }
        ],
        copyright: "Hybrid Retail Systems Ltd.",
        socials: {
            twitter: "#",
            linkedin: "#",
            github: "#"
        }
    },
    map: {
        badge: "Operational Hub",
        title: "Karachi\nCommand Center.",
        lat: 25.193389469968414,
        lng: 66.59499551722738,
        zoom: 12,
        style: "Dark" // Dark | Light
    }
}

export async function GET() {
    try {
        const setting = await db.queryOne(
            'SELECT value FROM system_settings WHERE key = $1',
            [SETTINGS_KEY]
        )

        if (!setting) {
            return NextResponse.json(defaultContent)
        }

        return NextResponse.json(JSON.parse(setting.value))
    } catch (error: any) {
        console.error('❌ Error fetching CMS content:', error)
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.role || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const content = await request.json()

        // Update or insert
        await db.query(
            `INSERT INTO system_settings (key, value, updated_at, updated_by) 
             VALUES ($1, $2, NOW(), $3)
             ON CONFLICT (key) DO UPDATE 
             SET value = $2, updated_at = NOW(), updated_by = $3`,
            [SETTINGS_KEY, JSON.stringify(content), session.user.id]
        )

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('❌ Error updating CMS content:', error)
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
