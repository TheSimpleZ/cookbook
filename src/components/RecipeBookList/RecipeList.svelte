<script>
  import { ListItem, ListItemGroup } from 'svelte-materialify'
  export let bookId
  export let recipes
  export let selectedRecipeIndex

</script>

<ListItemGroup mandatory bind:value={selectedRecipeIndex}>
{#each $recipes as recipe, i}
    <a rel=prefetch href={`/recipes/${bookId}/${recipe.id}`}>
      <ListItem link>
        {recipe.name || 'Untitled recipe'} 
      </ListItem>
    </a>
{/each}
</ListItemGroup>
