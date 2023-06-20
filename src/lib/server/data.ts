import { PrismaClient } from "@prisma/client"
import type { Context } from "telegraf"
import configs from "./bot/configs"

export const prisma = new PrismaClient()

export async function allocUser({ from }: Context) {
    if (!from) throw new Error("from is null")

    const result = await prisma.user.upsert({
        create: {
            language: from.language_code || "en",
            username: from.username,
            firstName: from.first_name,
            lastName: from.last_name,
            telegramId: from.id,
            creditsIssued: configs.freeCredits,
            creditsLeft: configs.freeCredits,
        },
        where: { telegramId: from.id },
        update: {
            username: from.username,
            firstName: from.first_name,
            lastName: from.last_name,
            language: from.language_code,
        },
    })

    return result;
}
