<script>
import {
  Button, 
  Dialog,
  Card,
  CardTitle,
  CardText,
  CardActions,
  ButtonGroup,
} from 'svelte-materialify'
import {
  mdiDelete, 
  mdiPlus, 
  mdiBookPlus, 
} from '@mdi/js'
import RecipeToolbarButton from './RecipeToolbarButton.svelte'
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()
let showDeleteDialog = false

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


<ButtonGroup elevated borderless class="flex w-full" activeClass="">
  <RecipeToolbarButton iconPath={mdiPlus} on:click={() => dispatch('create')}>New recipe</RecipeToolbarButton>
  <RecipeToolbarButton iconPath={mdiBookPlus} on:click={() => dispatch('createBook')}>New recipe book</RecipeToolbarButton>
  <RecipeToolbarButton iconPath={mdiDelete} on:click={() => {showDeleteDialog = true}}>Delete recipe</RecipeToolbarButton>
</ButtonGroup>

<Dialog bind:active={showDeleteDialog}>
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
</Dialog>