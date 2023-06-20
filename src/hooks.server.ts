import "$lib/server/data"

import { redirect, type Handle } from "@sveltejs/kit"
import { verifyToken } from "$lib/server/token"
import { bot } from "$lib/server/bot"

export const handle: Handle = async ({ resolve, event }) => {
    event.locals.requireAuth = () => {
        const user = verifyToken(event.cookies.get("ava_session"))
        if (!user) throw redirect(303, "/")
        return user;
    }

    return resolve(event)
}

bot.launch().catch((reason) => {
    console.error("bot crash: ", reason)
})
process.on("SIGINT", (signal) => bot.stop(signal.toString()))
process.on("SIGTERM", (signal) => bot.stop(signal.toString()))

process.on('uncaughtException', (error, origin) => {
    console.error('Uncaught exception: ', error, origin)
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('Uncaught rejection: ', promise, reason)
})
