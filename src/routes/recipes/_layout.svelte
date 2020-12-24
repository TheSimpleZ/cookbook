<script context="module">
  import { collection } from '../../lib/store'

  export function preload (_, { user }) { 
    return user.id 
      ? collection('recipes').asRole(user.id).preload() 
      : this.redirect(302, '/')
  }
  
</script>

<script>
  import { stores, goto } from '@sapper/app'
  import { mdiDelete } from '@mdi/js'
  import RecipeList from "../../components/RecipeList.svelte";
  import { createRecipe } from '../../lib/recipemanager'


  export let data
  const { page, session } = stores()
  const recipes = collection('recipes', data).asRole($session.user.id)


  let currentRecipeIndex = $recipes.findIndex(e => e.id == $page.params.slug)
  $: currentRecipeIndex = $recipes.findIndex(e => e.id == $page.params.slug)

  async function createNewRecipe() {
    const newRecipe = await recipes.add(createRecipe({user: $session.user}))
    await goto(`/recipes/${newRecipe.id}`)
  }

  async function deleteRecipe(e) {
    if($recipes.length == 1) {
      await createNewRecipe();
    } else {
      const nextRecipeIndex = (currentRecipeIndex + 1) % ($recipes.length)
      await goto(`/recipes/${$recipes[nextRecipeIndex].id}`)
    }
    await e.detail.recipe.delete()
  }
</script>

<style lang="scss">
  $appBarHeight: 48px;
  .app {
    height: calc(100vh - #{$appBarHeight});
  }
</style>

<div class="flex flex-1 app">
  <RecipeList on:create={createNewRecipe} on:delete={deleteRecipe} recipes={recipes} bind:selectedRecipeIndex={currentRecipeIndex} />
  <div class="overflow-y-auto flex-1">
    <slot />
  </div>
</div>


