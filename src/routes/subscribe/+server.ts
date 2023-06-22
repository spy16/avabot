import { redirect } from "@sveltejs/kit";
import type { User } from "@prisma/client";
import { env } from "$env/dynamic/private";

import { prisma } from "$lib/server/data";
import type { RequestHandler } from "./$types";
import { makePaymentLink, lemonHandler, type LemonSubscription } from "$lib/server/lemonsq";

const CHECKOUT_ID = env.LMSQ_CHECKOUT_ID

const isAvaOrder = ({ product_name }: { product_name: string }) => {
    return product_name.toLowerCase().trim().includes("avabot");
};

export const GET: RequestHandler = async ({ url }) => {
    const userId = url.searchParams.get("user");
    if (!userId) {
        throw redirect(303, "/");
    }
    throw redirect(303, makePaymentLink("spy16", CHECKOUT_ID, userId));
};

export const POST: RequestHandler = async ({ request }) => {
    return lemonHandler<{ user_id: string | undefined }>({
        req: request,
        secret: env.LMSQ_SECRET,
        onData: async (event) => {
            switch (event.event_name) {
                case "subscription_created":
                case "subscription_updated":
                    if (isAvaOrder(event.data.attributes)) {
                        let user: User | null;
                        if (event.data.attributes.test_mode) {
                            user = await prisma.user.findUnique({
                                where: { id: env.ADMIN_USER_ID },
                            });
                        } else if (event.meta.custom_data.user_id) {
                            user = await prisma.user.findUnique({
                                where: { id: event.meta.custom_data.user_id },
                            });
                        } else {
                            user = await prisma.user.findUnique({
                                where: { email: event.data.attributes.user_email || "" },
                            });
                        }

                        if (user) {
                            upsertSubscription(event.data, user);
                        } else {
                            console.error("failed to find a user to link subscription to")
                        }
                    }
                    break;

                case "subscription_payment_success": {
                    const sub = await prisma.subscription.findUnique({
                        where: { id: event.data.attributes.subscription_id.toString() },
                    })
                    if (sub) {
                        const margin = 80
                        const credits = (margin / 100) * event.data.attributes.subtotal_usd
                        await prisma.user.update({
                            where: { id: sub.userId },
                            data: {
                                creditsLeft: credits,
                                creditsIssued: { increment: credits },
                            }
                        })
                    }
                    break;
                }
            }
        },
        onError: async (err) => {
            console.warn("lmsqeeuzy webhook failure: ", err);
        },
    });
};

const upsertSubscription = async (sub: LemonSubscription, user: User) => {
    const lmsqueezyData = JSON.stringify(sub);

    await prisma.subscription.upsert({
        where: { id: sub.id },
        create: {
            id: sub.id,
            userId: user.id,
            variant: sub.attributes.product_name,
            isActive: sub.attributes.status === "active",
            lmsqueezyData,
        },
        update: {
            id: sub.id,
            variant: sub.attributes.product_name,
            isActive: sub.attributes.status === "active",
            lmsqueezyData,
        },
        select: { id: true },
    });
};
