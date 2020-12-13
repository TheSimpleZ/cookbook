<script context="module">
	import { collection, preloader } from '../lib/store'
	const recipes = collection('recipes')
	export const preload = preloader(recipes)
</script>

<script>
	import { auth } from '../lib/firebase'
	export let username

	import { onMount } from 'svelte'

onMount(async () => {

	  auth.onAuthStateChanged(function(user) {
	    if (user) {
	      // User is signed in.
	      username = user.displayName
			
	    } else {
	      // User is signed out.
	      username = undefined
	    }
	  }, function(error) {
	    console.log(error)
	  })
})
</script>

<style>
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1>Great success! {username}</h1>

<figure>
	<img alt="Success Kid" src="/successkid.jpg">
	<figcaption>Have fun with Sapper!</figcaption>
</figure>

<!-- {recipes[0].name} -->

<ul>
	{#each $recipes as recipe}
		<li>{recipe.name}</li>
	{/each}
</ul>

<p><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>
