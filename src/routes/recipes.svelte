<!-- /* eslint-disable ParseError */ -->
<script context="module">
  import { collection, preloader } from '../lib/store'

  const recipes = collection('recipes')
  export async function preload(page, { user }) {
    if (!user) {
      // return this.redirect(302, '/')
    }

    return preloader(recipes)(page)

  }
</script>

<script>
  import {
    NavigationDrawer, List, ListItem 
  } from 'svelte-materialify'

  import EditorJs from '../components/EditorJs.svelte'

  let editor
  let activeIndex = 0

  const editorConfig = {
    autofocus: true,
    placeholder: 'Please write your instructions here',
    /**
    * onReady callback
    */
    onReady: () => {console.log('Editor.js is ready to work!')},
   
    /**
    * onChange callback
    */
    onChange: () => {
      editor.save().then((data) => {
        const recipe = $recipes[activeIndex]
        recipe.instructions = data
        console.log($recipes[activeIndex])
      })
    }
  }

</script>

<div class="flex flex-1">
  <NavigationDrawer>
    <List>
      {#each $recipes as recipe, index}
        <ListItem active={index === activeIndex} on:click={() => {activeIndex = index}}>{recipe.name}</ListItem>
      {/each}
    </List>
  </NavigationDrawer>
  <EditorJs class="flex-1" bind:editor={editor} config={editorConfig}/>
</div>
