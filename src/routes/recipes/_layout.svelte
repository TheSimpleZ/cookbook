<script context="module">
  import { collection } from '../../lib/store'

  export async function preload(page, { user }) {
    if (!user) {
      // return this.redirect(302, '/')
    }
    const recipes = collection('recipes')

    return recipes.preload()
  }
</script>

<script>
  import {
    NavigationDrawer, ListItemGroup, ListItem, Button
  } from 'svelte-materialify'
  import { auth } from '../../lib/firebase'
  import { goto } from '@sapper/app'

  export let data
  
  const recipes = collection('recipes', undefined, data)
 
  let currentRecipeIndex = 0
  let currentRecipe = $recipes[currentRecipeIndex]
  $: currentRecipe = $recipes[currentRecipeIndex]

  

  function createNewRecipe() {
    recipes.add({
      author_id: auth.currentUser.uid,
      roles: { [auth.currentUser.uid]: 'owner' },
      name: 'Untitled recipe',
    })
  }


</script>

<div class="flex flex-1">
  <NavigationDrawer>
    <ListItemGroup mandatory bind:value={currentRecipeIndex}>
      {#each $recipes as recipe}
      <ListItem on:click={() => goto(`/recipes/${recipe.id}`)}>{recipe.name}</ListItem>
      {/each}
    </ListItemGroup>
    <span slot="append" class="pa-2">
      <Button block on:click={createNewRecipe}>New recipe</Button>
    </span>
  </NavigationDrawer>
  <slot />
</div>
