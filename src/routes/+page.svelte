<script lang="ts">
	// TODO: hardcoded for now based on latest numbers.
	let count = 1000;
</script>

<div class="w-full min-h-screen max-w-screen-xl mx-auto">
	<div class="w-full h-full flex flex-col p-4 md:px-8">
		<!-- header -->
		<header class="flex flex-row items-center justify-between md:justify-normal">
			<a href="/">
				<img class="w-16 h-auto" src="/logo.png" alt="" />
			</a>
		</header>

		<main
			class="w-full h-full grid grid-cols-1 md:grid-cols-2 place-items-center gap-4 mx-auto mt-12 md:mt-12"
		>
			<div class="w-full flex flex-col gap-4">
				<span class="badge badge-ghost">Powered by ChatGPT</span>
				<h1 class="text-5xl font-bold">Life is better with AI!</h1>
				<p class="text-lg">
					AvaBot is here to be your reliable, privacy-focused personal assistant AI chatbot, readily
					available to assist you with any questions you may have.
				</p>
				<p class="text-lg">
					With AvaBot, you can engage in natural, friendly conversations on a wide range of topics.
					Whether you're curious about movies, science, or history, or simply looking for some
					laughs through jokes or original poetry, Ava is at your service.
				</p>

				<a href="https://t.me/spy16_avabot" class="btn btn-primary text-white"> Launch Now! </a>

				<div class="flex flex-col gap-2">
					<div class="flex flex-row items-center gap-2">
						<img
							class="w-24 border rounded-md bg-white p-1 shadow-lg"
							src="/telegram_qr.jpeg"
							alt=""
						/>
						<p>
							Scan or click the launch button to join {count}+ users who are already using AvaBot.
						</p>
					</div>

					<p class="text-xs">
						Ava is designed to be privacy-focused. Your chats are not stored or logged anywhere in
						our systems. AvaBot is completely <a
							href="https://github.com/spy16/avabot"
							class="link"
							rel="external "
							target="_blank">open-source</a
						>
						as well.
					</p>
				</div>
			</div>

			<div class="w-full">
				<img
					alt="telegram screenshot"
					class="mx-auto w-[350px] h-[700px]"
					src="/chat_vertical.png"
				/>
			</div>
		</main>
	</div>
</div>
