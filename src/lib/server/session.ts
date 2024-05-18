import { env } from "$env/dynamic/private";

const token = new Date().getMilliseconds().toString();

export const getAdminSession = (userId: string, pwd: string) => {
    if (userId == env.ADMIN_ID && pwd == env.ADMIN_PASSWORD) {
        return token;
    }
    return null;
}

export const checkSession = (session: string) => {
    return session == token;
}
