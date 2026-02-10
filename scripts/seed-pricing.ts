import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding premium plans...')

    const plans = [
        {
            name: 'Essential Core',
            price: 4999,
            interval: 'month',
            features: ['Basic POS Engine', 'Single Branch License', 'Mobile Dashboard', 'Daily Email Reports'],
            is_active: true
        },
        {
            name: 'Business Pro',
            price: 14999,
            interval: 'month',
            features: ['Advanced Analytics', '5-Branch Network', 'Multi-User Hierarchy', 'Priority Support', 'API Access'],
            is_active: true
        },
        {
            name: 'Enterprise Quantum',
            price: 49999,
            interval: 'month',
            features: ['Unlimited Branches', 'AI-Vision Inventory', 'Dedicated Success Manager', 'Full System Customization', 'Legacy Sync Hub'],
            is_active: true
        }
    ]

    for (const plan of plans) {
        await prisma.plan.upsert({
            where: { name: plan.name },
            update: plan,
            create: plan
        })
    }

    console.log('Seeding premium add-ons...')

    const addons = [
        {
            name: 'AI Inventory Predictor',
            price: 2500,
            description: 'Use machine learning to forecast stock requirements and prevent outages.',
            icon: 'Zap',
            is_active: true
        },
        {
            name: 'WhatsApp Business Hub',
            price: 1500,
            description: 'Automated receipts and notifications via WhatsApp for your customers.',
            icon: 'MessageSquare',
            is_active: true
        },
        {
            name: 'Cloud Backup Pro',
            price: 3000,
            description: 'Encrypted off-site storage for your critical transaction logs and data.',
            icon: 'Shield',
            is_active: true
        }
    ]

    for (const addon of addons) {
        await prisma.addon.upsert({
            where: { name: addon.name },
            update: addon,
            create: addon
        })
    }

    console.log('Seeding completed successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
