<script>
	import { auth } from '../lib/firebase'
	import Cookies from 'js-cookie'
	import { AppBar, Button } from 'svelte-materialify'
	import { stores, goto } from '@sapper/app'
	import { MaterialApp } from 'svelte-materialify'
	import { onMount } from 'svelte'
	import GlobalStyle from '../components/GlobalStyle.svelte'

	let theme = 'dark'

	const { session } = stores()

	onMount(async () => {
	  auth.onIdTokenChanged(async (user) => {
	    try {
	      if (!user) {
	        console.log('User does not exist')
	        Cookies.remove('token')
	        $session.user = undefined
	        return
	      }
	      const token = await user.getIdToken()
	      $session.user = token
	      Cookies.set('token', token)
	      console.log('User found and session set!')
	    } catch (e) {
	      console.log('Something went wrong')
	      Cookies.remove('token')
	      $session.user = undefined
	      return
	    }
	  })
	})

	export async function logout() {
	  await auth.signOut()
	  $session.user = undefined
	  goto('/')
	}
</script>

<style>
	#root {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	#child {
		flex: 1;
		overflow: auto;
		display: flex;
	}

	#loginlogout {
		margin-right: 10px;
	}
</style>

<GlobalStyle />

<MaterialApp {theme}>
	<div id="root">
		<nav>
			<AppBar dense>
				<span slot="title">Cookbook</span>
				<div style="flex-grow:1" />
				<div id="loginlogout">
					{#if $session.user}
						<Button active on:click={logout}>Logout</Button>
					{/if}
				</div>
			</AppBar>
		</nav>
		<div id="child">
			<slot />
		</div>
	</div>
</MaterialApp>
