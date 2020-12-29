<script context="module">
  import { collection } from '../../lib/store'

  export function preload (_, { user }) { 
    return user.uid 
      ? collection('books').asRole(user.uid).preload() 
      : this.redirect(302, '/')
  }
  
</script>

<script>
  import { stores, goto } from '@sapper/app'
  import RecipeBookList from '../../components/RecipeBookList/RecipeBookList.svelte'
  import { createRecipeBook } from '../../lib/recipemanager'
  import 'simplebar'
  import 'simplebar/dist/simplebar.css'

  export let data
  const { page, session } = stores()
  const books = collection('books', data).asRole($session.user.uid)
  const boooks = $books.map(book => {
    const recipes = collection('books').doc(book.id).collection('recipes')
    return {
      ...book,
      recipes
    }
})


  let currentRecipeIndex = $books.findIndex(e => e.id == $page.params.slug)
  $: currentRecipeIndex = $books.findIndex(e => e.id == $page.params.slug)

  async function createNewRecipe() {
    const newRecipe = await books.add(createRecipeBook({ user: $session.user }))
    await goto(`/recipes/${newRecipe.id}`)
  }

  async function deleteRecipe(e) {
    if($books.length == 1) {
      await createNewRecipe()
    } else {
      const nextRecipeIndex = (currentRecipeIndex + 1) % $books.length
      await goto(`/recipes/${$books[nextRecipeIndex].id}`)
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
  <RecipeBookList on:create={createNewRecipe} on:delete={deleteRecipe} books={boooks} bind:selectedRecipeIndex={currentRecipeIndex} />
  <div class="flex-1" data-simplebar>
    <slot />
  </div>
</div>


