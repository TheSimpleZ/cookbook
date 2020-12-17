<script context="module">
  import { collection } from '../../lib/store'

  export async function preload(page, { user }) {
    if (!user) {
      // return this.redirect(302, '/')
    }
    let recipes = collection('recipes')

    return recipes.preload()
  }
</script>

<script>
  import {
    NavigationDrawer, ListItemGroup, ListItem, Button, List
  } from 'svelte-materialify'
  import { auth } from '../../lib/firebase'
  import { stores } from '@sapper/app'


  export let data
  const { page } = stores()
  const recipes = collection('recipes', undefined, data)


  let currentRecipeIndex = $recipes.findIndex(e => e.id == $page.params.slug)

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
    <List nav>
      <ListItemGroup mandatory bind:value={currentRecipeIndex}>
        {#each $recipes as recipe}
        <a rel=prefetch href={`/recipes/${recipe.id}`}><ListItem link>{recipe.name}</ListItem></a>
        {/each}
      </ListItemGroup>
    </List>
    <span slot="append" class="pa-2">
      <Button block on:click={createNewRecipe}>New recipe</Button>
    </span>
  </NavigationDrawer>
  <slot />
</div>
