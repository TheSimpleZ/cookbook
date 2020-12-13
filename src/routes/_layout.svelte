<script>
	import Nav from '../components/Nav.svelte'
	import { auth } from '../lib/firebase'
	import Cookies from 'js-cookie'

	import { onMount } from 'svelte'
	import { stores } from '@sapper/app'

	export let segment

	const { session } = stores()

	onMount(async () => {
	  auth.onIdTokenChanged(async (user) => {
	    try {
	      if (!user) {
	        console.log('User does not exist')
	        Cookies.set('token', false)
	        $session.user = false
	        return
	      }
	      const token = await user.getIdToken()
	      $session.user = token
	      Cookies.set('token', token)
	      console.log('User found and session set!')
	    } catch (e) {
	      console.log('Something went wrong')
	      Cookies.set('token', false)
	      $session.user = false
	      return
	    }
	  })
	})
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<Nav {segment} />

<main>
	<slot />
</main>
