<script context="module">
  import { collection } from '../../lib/store'

  export function preload (_, { user }) { 
    return user.id 
      ? collection('recipes').asRole(user.id).preload() 
      : this.redirect(302, '/')
  }
  
</script>

<script>
  import {
    NavigationDrawer, ListItemGroup, ListItem, Button, List
  } from 'svelte-materialify'
  import { stores } from '@sapper/app'


  export let data
  const { page, session } = stores()
  const recipes = collection('recipes', data).asRole($session.user.id)


  let currentRecipeIndex = $recipes.findIndex(e => e.id == $page.params.slug)

  function createNewRecipe() {
    recipes.add({
      roles: { [$session.user.id]: 'owner' },
      name: 'Untitled recipe',
    })
  }
</script>

<div class="flex flex-1">
  <NavigationDrawer>
    <List nav>
      <ListItemGroup mandatory value={currentRecipeIndex}>
        {#each $recipes as recipe}
        <a rel=prefetch href={`/recipes/${recipe.id}`}><ListItem link>{recipe.name || 'Untitled recipe'}</ListItem></a>
        {/each}
      </ListItemGroup>
    </List>
    <span slot="append" class="pa-2">
      <Button block on:click={createNewRecipe}>New recipe</Button>
    </span>
  </NavigationDrawer>
  <slot />
</div>
