import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

// Secret key for Storefront sessions (different from NextAuth admin secret)
const secretKey = process.env.STOREFRONT_JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-key-do-not-use-in-prod';
const key = new TextEncoder().encode(secretKey);

export async function signStorefrontToken(payload: JWTPayload): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(key);
}

export async function verifyStorefrontToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload;
    } catch (error) {
        return null;
    }
}
