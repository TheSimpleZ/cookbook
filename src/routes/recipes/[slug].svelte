<script context="module">
  import { collection } from '../../lib/store'

  export async function preload(page, { user }) {
    if (!user) {
      return this.redirect(302, '/')
    }

    const { slug } = page.params
    const recipes = collection('recipes').doc(slug)
    return recipes.preload() 
  }
</script>

<script>
  import EditorJs from '../../components/EditorJs.svelte'
  import { stores } from '@sapper/app'
  import { readable } from 'svelte/store'
  import throttle from 'lodash.throttle'

  const { page } = stores()

  export let data

  let currentRecipe = readable(data)
  $: currentRecipe = collection('recipes', data).doc($page.params.slug)

  
  let editor
  let autosave = true
  let textContent = $currentRecipe.name

  const saveName = throttle(() => {
    $currentRecipe.name = textContent
  }, 300)
  
  const saveInstructions = throttle((data) => {
    $currentRecipe.instructions = data
  }, 300)


  // Rerender recipe when page changes
  $: {
    if(editor && $page.params.slug != $currentRecipe.id) {
      if($currentRecipe.instructions 
        && $currentRecipe.instructions.blocks 
        && $currentRecipe.instructions.blocks.length > 0)
      {
        autosave = false
        textContent = $currentRecipe.name
        editor.blocks.render($currentRecipe.instructions).then(() => {autosave = true})
      }
      else{
        editor.blocks.clear()
      } 
    }
  }

  const editorConfig = {
    autofocus: true,
    placeholder: 'Please write your instructions here',
    holder: 'editorjs',

    data: $currentRecipe.instructions,

    onChange: () => {
      if(autosave)
        editor.save().then(saveInstructions)
    }
  }
  

</script>


  <div class="flex flex-column flex-1">
    <h3 contenteditable bind:textContent on:input={saveName} class="mx-auto my-5 outline-none focus:underline border-b" style="width: fit-content; min-width: 200px"></h3>
    <EditorJs class="flex-1" bind:editor config={editorConfig}/>
  </div>

