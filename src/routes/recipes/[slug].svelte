<script context="module">
  import { collection } from '../../lib/store'

  export async function preload({ params }, { user }) {
    const preloaded = await collection('recipes').doc(params.slug).preload()

    if (preloaded.data.roles[user.uid] !== 'owner') {
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
  import { loadTools } from '../../lib/toolmanager'
  import {
    transformBlocksToFirebaseFriendly, transformBlocksToOriginal, uploadImage 
} from '../../lib/recipemanager'

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
  }, 500)

  const saveInstructions = throttle(async () => {
    const data = await editor.save()
    $currentRecipe.instructions = transformBlocksToFirebaseFriendly(data)
  }, 500)

  

  // Rerender recipe when page changes
  $: {
    if (editor && $page.params.slug != $currentRecipe.id) {
      textContent = $currentRecipe.name

      if (
        $currentRecipe.instructions &&
        $currentRecipe.instructions.blocks &&
        $currentRecipe.instructions.blocks.length > 0
      ) {
        autosave = false

        editor.blocks
          .render(transformBlocksToOriginal($currentRecipe.instructions))
          .then(() => {
            autosave = true
          })
      } else {
        editor.blocks.clear()
      }
    }
  }

  let editorConfig

  onMount(async () => {
    const {
      list, image, underline, header, marker, table 
    } = await loadTools()

    editorConfig = {
      autofocus: true,
      placeholder: 'Please write your instructions here',
      holder: 'editorjs',
      data: transformBlocksToOriginal($currentRecipe.instructions),

      onChange() {
        if (autosave) saveInstructions()
      },

      tools: {
        list: {
          class: list,
          inlineToolbar: true,
        },
        image: {
          class: image,
          config: {
            uploader: {
              uploadByFile(file) {
                return uploadImage($currentRecipe.id, file)
              } 
            } 
          },
        },
        underline,
        header,
        marker: { class: marker, },
        table: {
          class: table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },
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
    min-width: 200px;
  }
</style>

<div class="flex flex-column flex-1">
  <h3
    placeholder="Recipe name"
    contenteditable
    bind:textContent
    on:input={saveName}
    class="mx-auto my-5 outline-none focus:underline" />

  <EditorJs class="flex-1" bind:editor config={editorConfig} />
</div>
