<script context="module">
  import { collection } from '../../lib/store'

  export async function preload ({ bookId }, { user }) { 
    if(!user.uid) this.redirect(302, '/')

    const result = {}

    if(user.uid)
      result.booksData = (await collection('books').asRole(user.uid).preload()).data

    if(bookId)
      result.bookData = (await collection('books').doc(bookId).preload()).data

    return result
  }
  
</script>

<script>
  import { stores, goto } from '@sapper/app'
  import RecipeBookList from '../../components/RecipeBookList/RecipeBookList.svelte'
  import { createRecipeBook } from '../../lib/recipemanager'
  import 'simplebar'
  import 'simplebar/dist/simplebar.css'

  export let booksData
  export let bookData

  const { page, session } = stores()

  let book = $page.params.bookId && collection('books', bookData).doc($page.params.bookId)
  $: book = $page.params.bookId && collection('books', bookData).doc($page.params.bookId)

  let recipes = $page.params.bookId && book.collection('recipes')
  $: recipes = $page.params.bookId && book.collection('recipes')

  const books = collection('books', booksData).asRole($session.user.uid)
  $: booksWithRecipes = $books.map(b => {
    const bookRecipes = collection('books').doc(b.id).collection('recipes')
    return {
      ...b,
      recipes: bookRecipes
    }
  })

  async function createNewRecipe() {
    const newRecipe = await recipes.add({})
    await goto(`/books/${$page.params.bookId}/recipes/${newRecipe.id}`)
  }

  async function createNewRecipeBook() {
    const newBook = await book.add(createRecipeBook({ user: $session.user }))
    const newRecipe = await recipes.add({})
    await goto(`/books/${newBook.id}/recipes/${newRecipe.id}`)

  }

  async function deleteRecipe(e) {
    // const nextRecipeIndex = (currentRecipeIndex + 1) % $books.length
    // await goto(`/recipes/${$books[nextRecipeIndex].id}`)
    await $recipes.find((r) => e.detail.recipeId === r.id).delete()
    await goto('/books')
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


