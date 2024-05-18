import { bot } from '$lib/server/bot/index.js';
import { prisma } from '$lib/server/data.js';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
    const userCount = await prisma.user.count();

    return {
        userCount
    }
};

export const actions = {
    logout: async ({ cookies }) => {
        cookies.set("ava_session", "", {
            path: "/",
            maxAge: 0,
        })
        throw redirect(303, "/")
    },
    broadcast: async ({ request }) => {
        const data = await request.formData()
        const userType = data.get("userType")?.toString() || ""
        const message = data.get("message")?.toString() || ""

        switch (userType) {
            case "userTypeAll":
                const users = await prisma.user.findMany()
                users.forEach((user) => {
                    console.log("broadcast", user.id, message)
                })
        }

        console.log("broadcast", message)
    }
};