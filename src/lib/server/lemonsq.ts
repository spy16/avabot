import { json } from '@sveltejs/kit'
import crypto from 'crypto'

export function makePaymentLink(
    storeId: string,
    checkoutId: string,
    userId: string,
) {
    return `https://${storeId}.lemonsqueezy.com/checkout/buy/${checkoutId}?media=0&logo=0&checkout[custom][user_id]=${userId}`
}

export async function lemonHandler<CustomData = any>({
    secret,
    req,
    onData,
    onError = console.error,
}: {
    req: Request
    secret: string
    onData: (data: DiscriminatedWebhookPayload<CustomData>) => any
    onError?: (error: Error) => any
}) {
    const signingSecret = secret

    if (req.method !== 'POST') {
        return json({ message: "method not allowed" }, { status: 405 })
    }

    try {
        if (!req.body) {
            return json({ message: "no request body" }, { status: 400 })
        }

        const actualSignature = req.headers.get("x-signature")
        if (!actualSignature) {
            return json({ message: "no signature" }, { status: 400 })
        }

        const rawBody = await req.text()
        const hmac = crypto.createHmac('sha256', signingSecret)
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8')
        const signature = Buffer.from(actualSignature, 'utf8')

        if (!crypto.timingSafeEqual(digest, signature)) {
            await onError(new Error('Invalid lemonsqueezy signature.'))
            return json({ message: "invalid signature" }, { status: 401 })
        }

        const payload: WebhookPayload = JSON.parse(rawBody)

        const eventName = payload.meta.event_name

        await onData({ event_name: eventName, ...payload } as any)

        return json({ message: "webhook accepted" }, { status: 200 })
    } catch (e: any) {
        await onError(e)
        return json({ message: `webhook error: ${e}` }, { status: 500 })
    }
}

type LemonSubscriptionEvents =
    | 'subscription_created'
    | 'subscription_cancelled'
    | 'subscription_resumed'
    | 'subscription_expired'
    | 'subscription_paused'
    | 'subscription_unpaused'
    | 'subscription_updated'

type LemonSubscriptionInvoiceEvents =
    | 'subscription_payment_success'
    | 'subscription_payment_failed'
    | 'subscription_payment_recovered'

type LemonOrderEventNames = 'order_created' | 'order_refunded'

type LemonLicenseKeyEvents = 'license_key_created'

export type WebhookPayload<CustomData = any> = {
    meta: {
        event_name:
        | LemonSubscriptionEvents
        | LemonSubscriptionInvoiceEvents
        | LemonOrderEventNames
        | LemonLicenseKeyEvents
        custom_data: CustomData
    }
    data: LemonSubscription | LemonSubscriptionInvoice | LemonOrder | LemonLicenseKey
}

// augmented type to make TypeScript discriminated unions work: https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions
export type DiscriminatedWebhookPayload<CustomData = any> =
    | {
        event_name: LemonSubscriptionEvents
        meta: {
            event_name: LemonSubscriptionEvents

            custom_data: CustomData
        }
        data: LemonSubscription
    }
    | {
        event_name: LemonSubscriptionInvoiceEvents
        meta: {
            event_name: LemonSubscriptionInvoiceEvents
            custom_data: CustomData
        }
        data: LemonSubscriptionInvoice
    }
    | {
        event_name: LemonOrderEventNames
        meta: { event_name: LemonOrderEventNames; custom_data: CustomData }
        data: LemonOrder
    }
    | {
        event_name: LemonLicenseKeyEvents
        meta: { event_name: LemonLicenseKeyEvents; custom_data: CustomData }
        data: LemonLicenseKey
    }

export type LemonEventName = WebhookPayload['meta']['event_name']

export type LemonSubscriptionInvoice = {
    type: 'subscription-invoices'
    id: string
    attributes: {
        store_id: number
        subscription_id: number
        billing_reason: string
        card_brand: string
        card_last_four: string
        currency: string
        currency_rate: string
        subtotal: number
        discount_total: number
        tax: number
        total: number
        subtotal_usd: number
        discount_total_usd: number
        tax_usd: number
        total_usd: number
        status: string
        status_formatted: string
        refunded: number
        refunded_at: any
        subtotal_formatted: string
        discount_total_formatted: string
        tax_formatted: string
        total_formatted: string
        urls: {
            invoice_url: string
        }
        created_at: string
        updated_at: string
        test_mode: boolean
    }
    relationships: {
        store: {
            links: {
                related: string
                self: string
            }
        }
        subscription: {
            links: {
                related: string
                self: string
            }
        }
    }
    links: {
        self: string
    }
}

export type LemonSubscription = {
    type: 'subscriptions'
    id: string
    attributes: {
        store_id: number
        order_id: number
        order_item_id: number
        product_id: number
        variant_id: number
        product_name: string
        variant_name: string
        user_name: string
        user_email: string
        status: LemonSubscriptionStatus
        status_formatted: string
        pause: any | null
        cancelled: boolean
        trial_ends_at: string | null
        billing_anchor: number
        urls: {
            update_payment_method: string
        }
        renews_at: string
        /**
         * If the subscription has as status of cancelled or expired, this will be an ISO-8601 formatted date-time string indicating when the subscription expires (or expired). For all other status values, this will be null.
         */
        ends_at: string | null
        created_at: string
        updated_at: string
        test_mode: boolean
    }
}

export type LemonOrder = {
    type: 'orders'
    id: string
    attributes: {
        store_id: number
        identifier: string
        order_number: number
        user_name: string
        user_email: string
        currency: string
        currency_rate: string
        subtotal: number
        discount_total: number
        tax: number
        total: number
        subtotal_usd: number
        discount_total_usd: number
        tax_usd: number
        total_usd: number
        tax_name: string
        tax_rate: string
        status: string
        status_formatted: string
        refunded: number
        refunded_at: any
        subtotal_formatted: string
        discount_total_formatted: string
        tax_formatted: string
        total_formatted: string
        first_order_item: {
            id: number
            order_id: number
            product_id: number
            variant_id: number
            product_name: string
            variant_name: string
            price: number
            created_at: string
            updated_at: string
            test_mode: boolean
        }
        created_at: string
        updated_at: string
    }
}

export type LemonLicenseKey = {
    type: 'license-keys'
    id: string
    attributes: {
        store_id: number
        order_id: number
        order_item_id: number
        product_id: number
        user_name: string
        user_email: string
        key: string
        key_short: string
        activation_limit: number
        instances_count: number
        disabled: number
        status: string
        status_formatted: string
        expires_at: any
        created_at: string
        updated_at: string
    }
}

type LemonSubscriptionStatus =
    | 'on_trial'
    | 'active'
    | 'paused'
    | 'past_due'
    | 'unpaid'
    | 'cancelled'
    | 'expired'
