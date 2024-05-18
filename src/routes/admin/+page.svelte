<script lang="ts">
	export let data;
</script>

<div class="h-full w-full">
	<header class="p-2 flex flex-row justify-between border-b border-base-200">
		<h1 class="text-2xl">AvaBot Admin</h1>

		<form method="post" action="?/logout">
			<button type="submit" class="btn btn-secondary btn-sm">Logout</button>
		</form>
	</header>

	<div class="flex flex-col gap-4 flex-wrap p-8">
		<!-- stats card -->
		<p>Total Users: {data.userCount}</p>

		<!-- broadcast form -->
		<form method="post" action="?/broadcast" class="flex flex-col gap-2 h-[200px]">
			<h2 class="text-lg">Broadcast Message</h2>

			<div class="flex flex-row items-center gap-2">
				<label for="userTypeAll" class="inline-flex items-center gap-2">
					<input
						class="radio radio-primary"
						type="radio"
						name="userType"
						id="userTypeAll"
						value="all"
						checked
					/>
					All Users
				</label>
				<label for="userTypePremium" class="inline-flex items-center gap-2">
					<input
						class="radio radio-primary"
						type="radio"
						name="userType"
						id="userTypePremium"
						value="premium"
					/>
					Premium Users Only
				</label>
				<label for="userTypeFree" class="inline-flex items-center gap-2">
					<input
						class="radio radio-primary"
						type="radio"
						name="userType"
						id="userTypeFree"
						value="free"
					/>
					Free Users Only
				</label>

				<label for="userTypeSpecific" class="inline-flex items-center gap-2">
					<input
						class="radio radio-primary"
						type="radio"
						name="userType"
						id="userTypeSpecific"
						value="user"
					/>
					Specific User
				</label>
			</div>

			<textarea
				name="message"
				id="message"
				class="w-full h-full input input-primary"
				placeholder="Enter your message here"
			/>
			<button type="submit" class="btn btn-primary">Broadcast</button>
		</form>
	</div>
</div>
