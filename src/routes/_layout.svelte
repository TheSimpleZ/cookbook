<script>
	import { auth } from '../lib/firebase'
	import { AppBar, Button } from 'svelte-materialify'
	import { stores, goto } from '@sapper/app'
	import { MaterialApp } from 'svelte-materialify'
	import GlobalStyle from '../components/GlobalStyle.svelte'

	let theme = 'dark'

	const { session } = stores()

	export async function logout() {
	  await auth.signOut()
	  $session.user = undefined
	  goto('/')
	}
</script>

<GlobalStyle />

<MaterialApp {theme}>
	<div class="min-h-screen flex flex-col">
		<nav>
			<AppBar dense>
				<span slot="title">Cookbook</span>
				<div style="flex-grow:1" />
				<div class="mr-4">
					{#if $session.user}
						<Button active on:click={logout}>Logout</Button>
					{/if}
				</div>
			</AppBar>
		</nav>
		<div class="flex flex-1 overflow-auto">
			<slot />
		</div>
	</div>
</MaterialApp>
