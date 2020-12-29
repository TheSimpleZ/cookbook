
<script>
import {
  NavigationDrawer, 
  List, 
  Icon, 
  Divider,
  ListGroup
} from 'svelte-materialify'
import {
  mdiBook, 
  mdiChevronUp
} from '@mdi/js'
import RecipeList from './RecipeList.svelte'
import RecipeToolbar from './RecipeToolbar.svelte'
import 'simplebar'
import 'simplebar/dist/simplebar.css'

export let books = []
export let selectedRecipeIndex
 
let active = false

</script>


<style>
  /* 
   * This is a hack to override the btn group styles.
   * Tailwind classes do not work here
   */
  :global(.s-tooltip__wrapper) {
    flex-grow: 1 !important;
  }

  :global(.s-navigation-drawer__content) {
    overflow: hidden;
  }
</style>

<NavigationDrawer>
  <span slot="prepend">
    <RecipeToolbar on:delete on:create/>
  </span>
  <Divider />
  <div class="flex-1 overflow-y-auto h-full" data-simplebar>
    <List nav>
      {#each books as book}
      <ListGroup bind:active offset={40}>
        <span slot="prepend">
          <Icon path={mdiBook} />
        </span>
        <span slot="activator"> {book.name} </span>
        <span slot="append">
          <Icon path={mdiChevronUp} rotate={active ? 0 : 180} />
        </span>
        <RecipeList bookId={book.id} recipes={book.recipes} bind:selectedRecipeIndex/>
    </ListGroup>
    {/each}
    </List>
  </div>
</NavigationDrawer>
