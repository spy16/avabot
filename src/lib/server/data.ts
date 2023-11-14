import { PrismaClient } from "@prisma/client"
import type { Context } from "telegraf"
import { setProfile, userEvent } from "./tracking"

export const prisma = new PrismaClient()

export async function allocUser({ from: tgUser }: Context) {
    if (!tgUser) throw new Error("from is null")

    const user = await prisma.user.upsert({
        create: {
            language: tgUser.language_code || "en",
            username: tgUser.username,
            firstName: tgUser.first_name,
            lastName: tgUser.last_name,
            telegramId: tgUser.id,
        },
        where: { telegramId: tgUser.id },
        update: {
            username: tgUser.username,
            firstName: tgUser.first_name,
            lastName: tgUser.last_name,
            language: tgUser.language_code,
        },
    })

    setProfile({
        userId: user.id,
        language: user.language,
        telegramId: user.telegramId.toString(),

        // mixpanel special properties.
        $email: user.email,
        $name: user.firstName + " " + user.lastName,
        $created: user.createdAt.toString(),
    });

    const isNew = user.createdAt.getTime() === user.updatedAt.getTime()

    if (isNew) {
        userEvent({
            kind: "signed_up",
            user: user.id,
        })
    }

    return user;
}

