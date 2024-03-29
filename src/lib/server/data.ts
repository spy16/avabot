import { PrismaClient } from "@prisma/client"
import type { Context } from "telegraf"
import configs from "./bot/configs"
import { setProfile, userEvent } from "./tracking"

export const prisma = new PrismaClient()

export async function allocUser({ from }: Context) {
    if (!from) throw new Error("from is null")

    const user = await prisma.user.upsert({
        create: {
            language: from.language_code || "en",
            username: from.username,
            firstName: from.first_name,
            lastName: from.last_name,
            telegramId: from.id,
        },
        where: { telegramId: from.id },
        update: {
            username: from.username,
            firstName: from.first_name,
            lastName: from.last_name,
            language: from.language_code,
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

