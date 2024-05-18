import "$lib/server/data"

import { redirect, type Handle } from "@sveltejs/kit"
import { verifyToken } from "$lib/server/token"
import { bot } from "$lib/server/bot"
import { checkSession } from "$lib/server/session"

export const handle: Handle = async ({ resolve, event }) => {
    if (event.route.id?.startsWith("/admin")) {
        if (!checkSession(event.cookies.get("ava_session") || "")) {
            throw redirect(303, "/")
        }
    }
    return resolve(event)
}

// bot.launch().catch((reason) => {
//     console.error("bot crash: ", reason)
// })

process.on("SIGINT", (signal) => bot.stop(signal.toString()))
process.on("SIGTERM", (signal) => bot.stop(signal.toString()))

process.on('uncaughtException', (error, origin) => {
    console.error('Uncaught exception: ', error, origin)
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('Uncaught rejection: ', promise, reason)
})
