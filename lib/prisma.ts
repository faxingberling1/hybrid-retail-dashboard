import { PrismaClient } from './generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { pool } from './db'

const prismaClientSingleton = () => {
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

let internalPrisma = globalThis.prisma

if (internalPrisma && (!(internalPrisma as any).product || !(internalPrisma as any).plan)) {
    console.log('🔄 Stale Prisma client detected (missing Plan/Addon support), re-initializing...')
    internalPrisma = undefined
}

const prisma = internalPrisma ?? prismaClientSingleton()

if (!internalPrisma) {
    console.log('📦 Fresh Prisma Client Initialized. Available models:', Object.keys(prisma).filter(k => !k.startsWith('$')))
}

export default prisma

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma
}
