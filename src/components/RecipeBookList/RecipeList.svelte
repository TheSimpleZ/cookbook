<script>
  import { ListItem, ListItemGroup } from 'svelte-materialify'

  export let bookId
  export let recipes
  export let selectedRecipeId
  
  $: selectedRecipeIndex = $recipes.findIndex(r => selectedRecipeId === r.id)
</script>

<ListItemGroup bind:value={selectedRecipeIndex}>
{#each $recipes as recipe}
    <a rel=prefetch href={`/books/${bookId}/recipes/${recipe.id}`}>
      <ListItem link class={(recipe.name ? '' : 'text--secondary')}>
        {recipe.name || 'Untitled recipe'}
      </ListItem>
    </a>
{/each}
</ListItemGroup>
