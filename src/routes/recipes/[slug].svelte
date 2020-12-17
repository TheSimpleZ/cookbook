<script context="module">
  import { collection } from '../../lib/store'

  export async function preload(page, { user }) {
    if (!user) {
      // return this.redirect(302, '/')
    }

    const { slug } = page.params
    const recipes = collection('recipes').doc(slug)
    const data = await recipes.preload()
    return data 
  }
</script>

<script>
  import EditorJs from '../../components/EditorJs.svelte'
  import { stores } from '@sapper/app'

  const { page } = stores()
  const { slug } = $page.params

  export let data




  const currentRecipe = collection('recipes', undefined, data).doc(slug)

  
  let editor

  const editorConfig = {
    autofocus: true,
    placeholder: 'Please write your instructions here',

    onReady: () => {console.log('Editor.js is ready to work!')},

    data: $currentRecipe.instructions,

    onChange: () => {
      editor.save().then((data) => {
        $currentRecipe.instructions = data
      })
    }
  }


</script>



  <div class="flex flex-column flex-1">
    <h3>{$currentRecipe?.name}</h3>
    <EditorJs class="flex-1" bind:editor config={editorConfig}/>
  </div>

