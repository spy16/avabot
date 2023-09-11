import { env } from "$env/dynamic/private";
import mixpanel from "mixpanel"

let tracker: mixpanel.Mixpanel | null = null
const getTracker = () => {
    if (!tracker) {
        tracker = mixpanel.init(env.MIXPANEL_TOKEN)
    }
    return tracker
}

type UserEvent = {
    kind: string,
    user: string,
} & mixpanel.PropertyDict

export const setProfile = (data: { userId: string, [key: string]: string | null }) => {
    try {
        const { userId, ...rest } = data;
        getTracker().people.set(userId, rest)
    } catch (error) {
        console.warn("failed to publish")
    }
}

export const userEvent = (ev: UserEvent) => {
    try {
        const { kind, user, ...rest } = ev;

        getTracker().track(kind, {
            ...rest,
            "distinct_id": user,
        })
    } catch (error) {
        console.warn("failed to publish tracking event", error)
    }
}
