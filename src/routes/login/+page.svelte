<div class="grid h-full min-h-screen w-full place-items-center">
	<form
		class="w-full max-w-md flex flex-col gap-4 items-center border rounded-md p-6 bg-base-200"
		method="post"
		action="?/login"
	>
		<h1 class="font-bold text-2xl">Login</h1>
		<input
			autocomplete="off"
			type="text"
			name="userName"
			id="userName"
			class="w-full input input-primary"
		/>
		<input
			autocomplete="off"
			type="password"
			name="password"
			id="password"
			class="w-full input input-primary"
		/>
		<button type="submit" class="btn btn-primary w-full">Login</button>
	</form>
</div>
