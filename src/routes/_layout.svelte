<script>
	import { auth } from '../lib/firebase'
	import { AppBar, Button } from 'svelte-materialify'
	import { stores, goto } from '@sapper/app'
	import { MaterialApp } from 'svelte-materialify'
	import { onMount } from 'svelte'

	import Cookies from 'js-cookie'

	let theme = 'dark'

	const { session } = stores()

	export async function logout() {
	  await auth.signOut()
	  $session.user = undefined
	  goto('/')
	}
	
	onMount(async () => {
	  auth.onIdTokenChanged(async (user) => {
	    const userId = 'userId'
	    const userToken = 'userToken'
	    const userKeys = [userId, userToken]
			
	    const clearUserData = () => {
	      for (let key of userKeys) {
	        Cookies.remove(key)
	        $session[key] = undefined
	      }
	    }
	    try {
	      if (!user) {
	        console.log('User does not exist')
	        clearUserData()
	        return
	      }
	      const token = await user.getIdToken()
	      $session.userId = user.uid
	      $session.userToken = token
	      Cookies.set(userId, $session.userId)
	      Cookies.set(userToken, $session.userToken)
	      console.log('User found and session set!')
	    } catch (e) {
	      console.log('Something went wrong')
	      clearUserData()
	      return
	    }
	  })
	})
</script>

<style>
  .app {
    height: calc(100vh - 48px);
  }
</style>

<MaterialApp {theme}>
	<div class="h-screen flex flex-column overflow-hidden">
		<nav>
			<AppBar dense>
				<span slot="title">Kookbook</span>
				<div style="flex-grow:1" />
				<div class="mr-4">
					<!-- {#if $session.user} -->
						<Button active on:click={logout}>Logout</Button>
					<!-- {/if} -->
				</div>
			</AppBar>
		</nav>
		<div class="app">
			<slot />
		</div>
	</div>
</MaterialApp>
