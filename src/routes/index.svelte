<script context="module">
	import { collection, preloader } from '../store'
	// console.log(recipes)
	const recipes = collection('recipes')
	export const preload = preloader(recipes)
	// export function preload(page, session) {
	// 	// recipes.subscribe(
	// 		// 	data => data.length && console.log(data)
	// 		// )
			
	// 	return new Promise(
	// 		resolve => recipes.subscribe(
	// 			data => data.length && resolve(recipes)
	// 		)
	// 	);
	// }
</script>

<script>
	export let recipes;
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

<h1>Great success!123</h1>

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
