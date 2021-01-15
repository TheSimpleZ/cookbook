<script>
  import { ListItem, ListItemGroup } from 'svelte-materialify'
  import { recipes } from '../../lib/recipemanager'

  export let bookId
  export let selectedRecipeId
  
  
  const recipesStore = recipes(bookId)

  $: selectedRecipeIndex = $recipesStore.findIndex(r => selectedRecipeId === r.id)
</script>

<ListItemGroup bind:value={selectedRecipeIndex}>
{#each $recipesStore as recipe}
    <a rel=prefetch href={`/books/${bookId}/recipes/${recipe.id}`}>
      <ListItem link class={(recipe.name ? '' : 'text--secondary')}>
        {recipe.name || 'Untitled recipe'}
      </ListItem>
    </a>
{/each}
</ListItemGroup>
