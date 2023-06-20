import { env } from "$env/dynamic/private"
import jwt from "jsonwebtoken"

const tokenIssuer = "spy16.in/avabot"

export const magicKeys = new Map<string, string>()

export const issueKey = (userId: string) => {
    const key = randomString(16)
    magicKeys.set(key, userId)
    return key
}

export const issueTokenFromKey = async (key: string) => {
    const userId = magicKeys.get(key)
    if (!userId) return null;
    magicKeys.delete(key)

    return jwt.sign({
        userId: userId,
    }, env.JWT_SECRET, {
        expiresIn: 60 * 60,
        algorithm: "HS512",
        issuer: tokenIssuer,
    })
}

export const verifyToken = (token: string | undefined | null) => {
    token = (token || "").trim()
    if (token === "") return null

    try {
        const res = jwt.verify(token, env.JWT_SECRET, {
            algorithms: ["HS512"],
            issuer: tokenIssuer,
            complete: true,
        })
        const payload = res.payload as { userId: string }

        return {
            id: payload.userId,
            isAdmin: payload.userId === env.ADMIN_USER_ID,
        }
    } catch (error) {
        console.warn("failed to verify token: ", error)
        return null;
    }
}

const alphaNum = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
function randomString(length: number, chars = alphaNum) {
    let result = '';
    for (let i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
