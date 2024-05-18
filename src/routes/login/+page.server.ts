import { env } from "$env/dynamic/private";
import { getAdminSession } from "$lib/server/session";
import { redirect } from "@sveltejs/kit";

export const actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData()
        const userName = data.get("userName")?.toString() || ""
        const password = data.get("password")?.toString() || ""

        console.log("login", userName, password)

        const session = getAdminSession(userName, password)
        if (!session) {
            throw redirect(303, "/")
        }

        cookies.set("ava_session", session, {
            path: "/",
            maxAge: 60 * 60, // 1 hour
        })
        throw redirect(303, "/admin")
    }
};


