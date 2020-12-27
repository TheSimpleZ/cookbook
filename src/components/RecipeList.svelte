
<script>
import { createEventDispatcher } from 'svelte'
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
  ButtonGroup,
  ButtonGroupItem,
  Divider,
  Tooltip
} from 'svelte-materialify'
import { mdiDelete, mdiPlus } from '@mdi/js'
import 'simplebar'
import 'simplebar/dist/simplebar.css'

export let recipes = []
export let selectedRecipeIndex
const dispatch = createEventDispatcher()

let showDeleteDialog = false


function deleteRecipe() {
  const recipe = $recipes[selectedRecipeIndex]
  dispatch('delete', { recipe })
  
}

function createNewRecipe() {
  dispatch('create')
}

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
      <Tooltip bottom>
        <ButtonGroupItem class="w-full" on:click={createNewRecipe}>
          <Icon path={mdiPlus} />
        </ButtonGroupItem>
        <span slot="tip">New recipe</span>
      </Tooltip>
      <Tooltip bottom>
      <ButtonGroupItem class="w-full" on:click={() => {showDeleteDialog = true}}>
        <Icon path={mdiDelete} />
      </ButtonGroupItem>
      <span slot="tip">Delete recipe</span>
    </Tooltip>
    </ButtonGroup>
  </span>
  <Divider />
  <div class="flex-1 overflow-y-auto h-full" data-simplebar>
    <List nav>
      <ListItemGroup mandatory bind:value={selectedRecipeIndex}>
        {#each $recipes as recipe, i}
            <a rel=prefetch href={`/recipes/${recipe.id}`}>
              <ListItem link>
                {recipe.name || 'Untitled recipe'} 
              </ListItem>
            </a>
        {/each}
      </ListItemGroup>
    </List>
  </div>
</NavigationDrawer>

<Dialog bind:active={showDeleteDialog}>
  <Card>
    <CardTitle>Would you like to delete this recipe?</CardTitle>
    <CardText>
      If you delete this recipe it will be lost <b>forever</b>
    </CardText>
    <CardActions>
      <Button on:click={() => {showDeleteDialog = false; deleteRecipe()}} text class="red-text">Yes</Button>
      <Button on:click={() => {showDeleteDialog = false}} text>No</Button>
    </CardActions>
  </Card>
</Dialog>