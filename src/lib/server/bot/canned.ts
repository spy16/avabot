import type { Subscription, User } from "@prisma/client"
import { dev } from "$app/environment"
import configs from "./configs"

const APP_HOST = dev ? "http://localhost:3000" : "https://avabot.fly.dev"

export const sysPrompt = () => {
    return `Your name is Ava. You are a personal assistant AI bot that can answer user queries about any topic in a friendly conversation. You can only have discussion but cannot do any tasks like setting reminders, calling someone, etc. Be as concise as possible. Use emojis if appropriate.

    You MUST output valid markdown format supported by Telegram messaging app only. Anything else will be very dangerous.

    Current time: ${new Date()}`
}

export const commandList = [
    {
        command: "privacy",
        description: "Show me the privacy policy",
    },
    {
        command: "stats",
        description: "Show me my stats",
    },
    {
        command: "reset",
        description: "Start new dialog",
    },
    {
        command: "model",
        description: "Change AI model to be used",
    }
]

export const subscriptionMsg = (user: User, sub: Subscription | null) => {
    if (sub) {
        return '💳 You have an active subscription. You are eligible to enjoy all features of Ava! 😎'
    } else {
        const url = `${APP_HOST}/subscribe?user=${user.id}`

        return `💳 [Activate](${url}) your subscription now to use AvaBot without any limits! 🚀`
    }

}

export const privacyPolicy = () => {
    return `📜 Privacy Policy:

AvaBot is designed to be privacy-friendly, and collects absolutely minimum information necessary.

ℹ️ Information we collect:

- Telegram ID for user identification.
- Username, FirstName and LastName for message personalization.
- Language Preference for language selection.

✅ This information is used solely for the purpose of isolating user conversations and personalisation of certain messages.

❗ Conversation between the User and Ava is NEVER logged or stored in any form in AvaBot systems.

By using AvaBot, you maybe subject to Telegram and OpenAI privacy policy and terms of service.

In the interest of transparency, AvaBot is completely open-source. You can take a look at the code here: https://github.com/spy16/avabot
`
}

export const userStats = (
    user: User,
    sub: Subscription | null,
) => {
    return `Here are your stats!

🧠 You are using \`${user.model || configs.defaultModel}\`
🪪 Your user ID is \`${user.id}\`
💬 You have sent ${user.messagesSent} messages in total.
💰 You have $ \`${user.creditsLeft.toPrecision(8)}\` worth of credits left.

`+ subscriptionMsg(user, sub)

}

export const helpDoc = (user: User) => {
    return `👋 Hey there ${user.firstName || user.username}!

I am Ava, an AI-based personal assistant chatbot that can help
you with all your queries, 24x7! Ask me about anything!

You can also use these commands to do various things:

${commandList.map(v => "- /" + v.command + ": " + v.description).join("\n")}`
}

export const exhausted = (user: User) => {
    return `😐 I am sorry, you have exhausted your free trial limit. Please activate subscription to continue talking!

In addition to having nice chitchats, I can also:

🧠 Answer your general knowledge questions
🍿 Recommend movies, discuss movie plots & trivia
🃏 Make up jokes
🤗 Discuss life matters when you need a friend
📩 Help you write that email for a sick leave
📜 Help you write that essay,
and a lot more! And I am available 24x7 and I never get bored talking to you! 🤗

🫠 I really hope you enjoyed talking with me, I know I did. And I would love to keep it up!

` + subscriptionMsg(user, null)
}
