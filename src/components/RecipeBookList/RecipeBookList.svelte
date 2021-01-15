
<script>
import {
  NavigationDrawer, 
  List, 
  Icon, 
  Divider,
  ListGroup,
  ListItem,
  Menu,
  Button
} from 'svelte-materialify'
import {
  mdiBook, 
  mdiBookOpen,
  mdiDotsVertical,
  mdiPlus,
  mdiRenameBox,
  mdiDelete,
  mdiShareVariant
} from '@mdi/js'
import RecipeList from './RecipeList.svelte'
import RecipeToolbar from './RecipeToolbar.svelte'
import 'simplebar'
import 'simplebar/dist/simplebar.css'

export let books = []
export let selectedBookId
export let selectedRecipeId

import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()

function deleteRecipe() {
  dispatch('delete', { recipeId: selectedRecipeId })
}


let activeBook = books.map((b) => selectedBookId == b.id)


</script>

<NavigationDrawer>
  <span slot="prepend">
    <RecipeToolbar on:delete={deleteRecipe} on:create on:createBook/>
  </span>
  <Divider />
  <div class="flex-1 overflow-y-auto h-full" data-simplebar>
    <List>
      {#each books as book, i}
      <ListGroup bind:active={activeBook[i]} offset={40} class='text--primary' activatorClass="overflow-visible" activatorProps={({ ripple: false })}>
        <span slot="prepend">
          <Icon path={activeBook[i] ? mdiBookOpen : mdiBook} />
        </span>
        <span slot="activator">{book.name}</span>
        <span slot="append" on:click|stopPropagation="">
          <Menu right >
            <div slot="activator">
              <Button icon on:click={() => {} }>
                <Icon path={mdiDotsVertical} />
              </Button>
            </div>
            <ListItem>
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
            <ListItem class="red-text">
              <span slot="prepend"><Icon size={20} path={mdiDelete} /></span>
              Delete
            </ListItem>
          </Menu>
        </span>
        <div>
          <RecipeList bookId={book.id} recipes={book.recipes} bind:selectedRecipeId/>
        </div>
    </ListGroup>
    {/each}
    </List>
  </div>
</NavigationDrawer>
