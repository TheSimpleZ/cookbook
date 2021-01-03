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


function deleteRecipe() {
  dispatch('delete')
  
}

function createNewRecipe() {
  dispatch('create')
}

function createNewRecipeBook() {
  dispatch('createBook')
}

</script>


<ButtonGroup elevated borderless class="flex w-full" activeClass="">
  <RecipeToolbarButton iconPath={mdiPlus} on:click={createNewRecipe}>New recipe</RecipeToolbarButton>
  <RecipeToolbarButton iconPath={mdiBookPlus} on:click={createNewRecipeBook}>New recipe book</RecipeToolbarButton>
  <RecipeToolbarButton iconPath={mdiDelete} on:click={() => {showDeleteDialog = true}}>Delete recipe</RecipeToolbarButton>
</ButtonGroup>

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