<script>
	
	import { AppBar, Button } from 'svelte-materialify'
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
	<span slot="title">Cookbook</span>
	<a href='.' style='text-decoration:none'>
		<Button depressed>Home</Button>
	</a>
	<a href='/dashboard' style='text-decoration:none'>
		<Button depressed>Dashboard</Button>
	</a>
	<a href='/login_page' style='text-decoration:none'>
	<Button depressed>Login</Button>
	</a>
</AppBar>
</nav>
