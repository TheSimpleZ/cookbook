<script>
import {
  Button, 
  Icon, 
  Dialog,
  Card,
  CardTitle,
  CardText,
  CardActions,
  ButtonGroup,
  ButtonGroupItem,
  Tooltip,
} from 'svelte-materialify'
import {
  mdiDelete, 
  mdiPlus, 
} from '@mdi/js'
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()
let showDeleteDialog = false


function deleteRecipe() {
  dispatch('delete')
  
}

function createNewRecipe() {
  dispatch('create')
}


</script>


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