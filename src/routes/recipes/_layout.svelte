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
    NavigationDrawer, 
    ListItemGroup, 
    ListItem, 
    Button, 
    List, 
    Icon, 
    Dialog,
    Card,
    CardTitle,
    CardText,
    CardActions,
  } from 'svelte-materialify'
  import { stores, goto } from '@sapper/app'
  import { mdiDelete } from '@mdi/js'

  export let data
  const { page, session } = stores()
  const recipes = collection('recipes', data).asRole($session.user.id)
  let showDeleteDialog = false
  let stageForDeletion = null


  let currentRecipeIndex = $recipes.findIndex(e => e.id == $page.params.slug)
  $: currentRecipeIndex = $recipes.findIndex(e => e.id == $page.params.slug)

  async function createNewRecipe() {
    const newRecipe = await recipes.add({ roles: { [$session.user.id]: 'owner' }, })
    await goto(`/recipes/${newRecipe.id}`)
  }

  async function deleteRecipe(e, recipe) {
    e.preventDefault()
    e.stopPropagation()
    stageForDeletion = recipe
    showDeleteDialog = true
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
        <ListItemGroup mandatory bind:value={currentRecipeIndex}>
          {#each $recipes as recipe, i}
              <a rel=prefetch href={`/recipes/${recipe.id}`}>
                <ListItem link>
                  {recipe.name || 'Untitled recipe'} 
                  <span slot="append">
                    <Button icon class="elevation-2" on:click={(e) => deleteRecipe(e, recipe)}>
                      <Icon path={mdiDelete} />
                    </Button>
                  </span>
                </ListItem>
              </a>
          {/each}
        </ListItemGroup>
      </List>
    </div>
  </NavigationDrawer>
  <div class="overflow-y-auto flex-1">
    <slot />
  </div>
</div>

<Dialog bind:active={showDeleteDialog}>
  <Card>
    <CardTitle>Would you like to delete this recipe?</CardTitle>
    <CardText>
      If you delete this recipe it will be lost <b>forever</b>
    </CardText>
    <CardActions>
      <Button on:click={() => {showDeleteDialog = false; return stageForDeletion.delete()}} text class="red-text">Yes</Button>
      <Button on:click={() => {showDeleteDialog = false}} text>No</Button>
    </CardActions>
  </Card>
</Dialog>
