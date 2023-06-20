<script>
	import '../app.postcss';
</script>

<svelte:head>
	<meta charSet="utf-8" />
	<meta name="viewport" content="width=device-width,initial-scale=1" />
	<meta name="robots" content="follow, index" />
	<meta name="description" content="Your AI sidekick powered by ChatGPT" />

	<meta name="og:type" content="website" />
	<meta name="og:url" content="https://avabot.fly.dev" />
	<meta name="og:title" content="AvaBot - Your AI sidekick" />
	<meta name="og:image" content="https://docutalk.co/logo.png" />
	<meta name="og:description" content="Your AI sidekick powered by ChatGPT" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:url" content="https://avabot.fly.dev" />
	<meta name="twitter:title" content="AvaBot - Your AI sidekick" />
	<meta name="twitter:description" content="Your AI sidekick powered by ChatGPT" />
	<meta name="twitter:image" content="https://avabot.fly.dev/logo.png" />

	<title>AvaBot - Your AI Sidekick</title>
</svelte:head>

<div class="w-full h-full min-h-screen flex flex-col felx-grow" data-theme="night">
	<slot />
</div>
