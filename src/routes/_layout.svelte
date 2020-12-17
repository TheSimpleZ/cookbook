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


<MaterialApp {theme}>
	<div class="min-h-screen flex flex-col">
		<nav>
			<AppBar dense>
				<span slot="title">Cookbook</span>
				<div style="flex-grow:1" />
				<div class="mr-4">
					<!-- {#if $session.user} -->
						<Button active on:click={logout}>Logout</Button>
					<!-- {/if} -->
				</div>
			</AppBar>
		</nav>
		<div class="flex flex-1 overflow-auto">
			<slot />
		</div>
	</div>
</MaterialApp>
