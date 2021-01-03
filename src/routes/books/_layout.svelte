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

  $: booksWithRecipes = $books.map(book => {
    const recipes = collection('books').doc(book.id).collection('recipes')
    return {
      ...book,
      recipes
    }
  })

  async function createNewRecipe() {
    const newRecipe = await books.add(createRecipeBook({ user: $session.user }))
    await goto(`/books/${newRecipe.id}`)
  }

  async function createNewRecipeBook() {
    const newBook = await collection('books').add(createRecipeBook({ user: $session.user }))
    const newRecipe = await collection('books').doc(newBook.id).collection('recipes').add({})
    await goto(`/books/${newBook.id}/recipes/${newRecipe.id}`)

  }

  async function deleteRecipe(e) {
    if($books.length == 1) {
      await createNewRecipe()
    } else {
      // const nextRecipeIndex = (currentRecipeIndex + 1) % $books.length
      // await goto(`/recipes/${$books[nextRecipeIndex].id}`)
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
  <RecipeBookList on:create={createNewRecipe} on:createBook={createNewRecipeBook} on:delete={deleteRecipe} books={booksWithRecipes} selectedBookId={$page.params.bookId} selectedRecipeId={$page.params.recipeId} />
  <div class="flex-1" data-simplebar>
    <slot />
  </div>
</div>


