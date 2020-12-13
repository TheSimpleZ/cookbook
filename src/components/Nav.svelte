<script>
	export let segment
	
	import {AppBar} from 'svelte-materialify'
	import { auth } from '../lib/firebase'
	export let username

	import { onMount, goto } from 'svelte'

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

<style>
	nav {
		border-bottom: 1px solid rgba(255, 62, 0, 0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: "";
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: "";
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255, 62, 0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>

<nav>
<AppBar>
	<h5>Cookbook</h5>
</AppBar>
</nav>
