<script>
  import { ListItem, ListItemGroup } from 'svelte-materialify'
  export let bookId
  export let recipes
  export let selectedRecipeId
  
  $: selectedRecipeIndex = $recipes.findIndex(r => selectedRecipeId === r.id)

</script>

<ListItemGroup mandatory bind:value={selectedRecipeIndex}>
{#each $recipes as recipe}
    <a rel=prefetch href={`/books/${bookId}/recipes/${recipe.id}`}>
      <ListItem link>
        {recipe.name || 'Untitled recipe'} 
      </ListItem>
    </a>
{/each}
</ListItemGroup>
