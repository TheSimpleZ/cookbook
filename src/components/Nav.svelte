<script>
	
	import { AppBar } from 'svelte-materialify'
	import { auth } from '../lib/firebase'
	export let username

	import { onMount } from 'svelte'
	import { goto } from '@sapper/app'

	onMount(async () => {
	  auth.onAuthStateChanged(
	    (user) => {
	      if (user) {
	        // User is signed in.
	        username = user.displayName
	      } else {
	        // User is signed out.
	        username = undefined
	      }
	    },
	    (error) => {
	      console.log(error)
	    }
	  )
	})

	export async function logout() {
	  return auth.signOut().then(() => {
	    goto('/')
	  })
	}
</script>

<nav>
<AppBar>
	<h5>Cookbook</h5>
</AppBar>
</nav>
