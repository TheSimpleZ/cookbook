<script context="module">
  export async function preload (_, { user }) { 
    if(!user.uid) this.redirect(302, '/')
  }
</script>

<script>
  import { stores } from '@sapper/app'
  import RecipeBookList from '../../components/RecipeBookList/RecipeBookList.svelte'
  import 'simplebar'
  import 'simplebar/dist/simplebar.css'

  const { page } = stores()
</script>

<style lang="scss">
  $appBarHeight: 48px;
  .app {
    height: calc(100vh - #{$appBarHeight});
  }
</style>

<div class="flex flex-1 app">
  <RecipeBookList selectedBookId={$page.params.bookId} selectedRecipeId={$page.params.recipeId} />
  <div class="flex-1" data-simplebar>
    <slot />
  </div>
</div>


<!-- <Dialog bind:active={showDeleteDialog}>
  <Card>
    <CardTitle>Delete?</CardTitle>
    <CardText>
      If you delete this recipe it will be lost <b>forever</b>
    </CardText>
    <CardActions>
      <Button on:click={() => {showDeleteDialog = false; dispatch('delete')}} text class="red-text">Yes</Button>
      <Button on:click={() => {showDeleteDialog = false}} text>No</Button>
    </CardActions>
  </Card>
</Dialog> -->