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
    recipes.add({ roles: { [$session.user.id]: 'owner' }, })
  }
</script>

<style lang="scss">
  $appBarHeight: 48px;
  .app {
    height: calc(100vh - #{$appBarHeight});
  }
</style>

<div class="flex flex-1 app">
  <NavigationDrawer>
    <span slot="prepend" class="pa-2">
      <Button block on:click={createNewRecipe}>New recipe</Button>
    </span>
    <div class="flex-1 overflow-y-auto">
      <List nav>
        <ListItemGroup mandatory value={currentRecipeIndex}>
          {#each $recipes as recipe}
          <a rel=prefetch href={`/recipes/${recipe.id}`}><ListItem link>{recipe.name || 'Untitled recipe'}</ListItem></a>
          {/each}
        </ListItemGroup>
      </List>
    </div>
  </NavigationDrawer>
  <div class="overflow-y-auto flex-1">
    <slot />
  </div>
</div>
