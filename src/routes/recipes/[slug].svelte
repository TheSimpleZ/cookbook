<script context="module">
  import { collection } from '../../lib/store'

  export async function preload({ params }, { user }) {
    const preloaded = await collection('recipes').doc(params.slug).preload()

    if(preloaded.data.roles[user.id] !== 'owner') {
      return this.redirect(302, '/recipes/access-denied')
    }

    return preloaded
  }
</script>

<script>
  import EditorJs from '../../components/EditorJs.svelte'
  import { stores } from '@sapper/app'
  import { readable } from 'svelte/store'
  import throttle from 'lodash.throttle'
  import { onMount } from 'svelte'
  import { storage } from '../../lib/firebase'

  const { page } = stores()

  export let data

  let currentRecipe = readable(data)
  $: currentRecipe = collection('recipes', data).doc($page.params.slug)

  
  let editor

  // This variable is needed to prevent the onChange from 
  // running when we change a recipe. 
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
      textContent = $currentRecipe.name

      if($currentRecipe.instructions 
        && $currentRecipe.instructions.blocks 
        && $currentRecipe.instructions.blocks.length > 0)
      {
        autosave = false
        editor.blocks.render($currentRecipe.instructions).then(() => {autosave = true})
      } else {
        editor.blocks.clear()
      } 
    }
  }

  const editorConfig = {
    autofocus: true,
    placeholder: 'Please write your instructions here',
    holder: 'editorjs',

    data: $currentRecipe.instructions,

    onChange(api) {
      if(autosave)
        api.saver.save().then(saveInstructions)
    }
  }
  

  onMount(async () => {
    const list = await import('@editorjs/list')
    const image = await import('@editorjs/image')
    const underline = await import('@editorjs/underline')
    const marker = await import('@editorjs/marker')
    const recipesStorage = storage.ref('recipes').child($currentRecipe.id)

    async function upload(file) {
      console.log(file)
      const fileRef = await recipesStorage
        .child(file.name)
        .put(file)
        .then((snapshot) => snapshot.ref)
      const url = await fileRef.getDownloadURL()
      console.log(url)
      return {
        success: 1,
        file: { url },
      }
    }

    editorConfig.tools = {
      list: {
        class: list.default,
        inlineToolbar: true,
      },
      image: {
        class: image.default,
        config: { uploader: { uploadByFile: upload, }, },
        unerline: underline.default,
        marker: { class: marker.default },
      },
    }
  })
</script>

<style lang="scss">
  [contenteditable][placeholder]:empty:before {
    text-decoration: underline;
    content: attr(placeholder);
    position: relative;
    color: gray;
    background-color: transparent;
  }

  h3 {
    width: fit-content; 
    min-width: 200px
  }
</style>


<div class="flex flex-column flex-1">
  <h3 placeholder="Recipe name" contenteditable bind:textContent on:input={saveName} class="mx-auto my-5 outline-none focus:underline"></h3>
  <EditorJs class="flex-1" bind:editor config={editorConfig}/>
</div>

