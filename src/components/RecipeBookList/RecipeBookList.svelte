<script>
import {
  NavigationDrawer, 
  List, 
  Icon, 
  Divider,
  ListGroup,
  ListItem,
  Menu,
  Button,
  ButtonGroup
} from 'svelte-materialify'
import {
  mdiBook, 
  mdiBookOpen,
  mdiDotsVertical,
  mdiPlus,
  mdiRenameBox,
  mdiDelete,
  mdiShareVariant,
  mdiBookPlus
} from '@mdi/js'
import RecipeList from './RecipeList.svelte'
import RecipeToolbarButton from './RecipeToolbarButton.svelte'
import 'simplebar'
import 'simplebar/dist/simplebar.css'
import {
  books, recipes, createRecipe, createRecipeBook 
} from '../../lib/recipemanager'
import { stores } from '@sapper/app'


export let selectedBookId
export let selectedRecipeId


const { session } = stores()


function createNewRecipe(bookId) {
  recipes(bookId).add(createRecipe($session))
}

function createNewRecipeBook() {
  books.add(createRecipeBook($session))
}

let activeBook = $books.map((b) => selectedBookId == b.id)
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
    <ButtonGroup elevated borderless class="flex w-full" activeClass="">
      <RecipeToolbarButton iconPath={mdiBookPlus} on:click={() => createNewRecipeBook()}>New recipe book</RecipeToolbarButton>
    </ButtonGroup>
  </span>
  <Divider />
  <div class="flex-1 overflow-y-auto h-full" data-simplebar>
    <List>
      {#each $books as book, i}
      <ListGroup bind:active={activeBook[i]} offset={40} class='text--primary' activatorClass="overflow-visible" activatorProps={({ ripple: false })}>
        <span slot="prepend">
          <Icon path={activeBook[i] ? mdiBookOpen : mdiBook} />
        </span>
        <span slot="activator">{book.name}</span>
        <span slot="append" on:click|stopPropagation="">
          <Menu right >
            <div slot="activator">
              <Button icon>
                <Icon path={mdiDotsVertical} />
              </Button>
            </div>
            <ListItem on:click={() => createNewRecipe(book.id)}>
              <span slot="prepend"><Icon size={20} path={mdiPlus} /></span>
              Add new recipe
            </ListItem>
            <ListItem>
              <span slot="prepend"><Icon size={20} path={mdiRenameBox} /></span>
              Rename
            </ListItem>
            <ListItem>
              <span slot="prepend"><Icon size={20} path={mdiShareVariant} /></span>
              Share
            </ListItem>
            <ListItem class="red-text" on:click={() => book.delete()}>
              <span slot="prepend"><Icon size={20} path={mdiDelete} /></span>
              Delete
            </ListItem>
          </Menu>
        </span>
        <div>
          <RecipeList bookId={book.id} bind:selectedRecipeId/>
        </div>
    </ListGroup>
    {/each}
    </List>
  </div>
</NavigationDrawer>
