/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			requireAuth: () => { id: string, isAdmin: boolean };
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };
