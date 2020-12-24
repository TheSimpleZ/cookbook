<script context="module">
  import { collection } from "../../lib/store";

  export async function preload({ params }, { user }) {
    const preloaded = await collection("recipes").doc(params.slug).preload();

    if (preloaded.data.roles[user.uid] !== "owner") {
      return this.redirect(302, "/recipes/access-denied");
    }

    return preloaded;
  }
</script>

<script>
  import EditorJs from "../../components/EditorJs.svelte";
  import { stores } from "@sapper/app";
  import { readable } from "svelte/store";
  import throttle from "lodash.throttle";
  import { onMount } from "svelte";
  import { storage } from "../../lib/firebase";
  import { loadTools } from "../../lib/toolmanager";

  const { page } = stores();

  export let data;

  let currentRecipe = readable(data);
  $: currentRecipe = collection("recipes", data).doc($page.params.slug);

  let editor;

  // This variable is needed to prevent the onChange from
  // running when we change a recipe.
  let autosave = true;
  let textContent = $currentRecipe.name;

  const saveName = throttle(() => {
    $currentRecipe.name = textContent;
  }, 300);

  const saveInstructions = throttle((data) => {
    if (data.blocks) {
      data.blocks.forEach((block) => {
        // If this piece of code is removed the image plugin will replace all
        // '&' signs with '&amp;'
        if (block.type === "image" && block.data.file.url) {
          block.data.file.url = block.data.file.url.replace("&amp;", "&");
        }

        // Firestore does not support nested arrays. 
        // hence we convert the table array to an object
        if (block.type === "table" && block.data.content) {
          block.data.content = block.data.content.reduce((acc, val, i) => {acc[i] = val; return acc}, {})
        }
      });
    }

    $currentRecipe.instructions = data;
  }, 300);

  // Rerender recipe when page changes
  $: {
    if (editor && $page.params.slug != $currentRecipe.id) {
      textContent = $currentRecipe.name;

      if (
        $currentRecipe.instructions &&
        $currentRecipe.instructions.blocks &&
        $currentRecipe.instructions.blocks.length > 0
      ) {
        autosave = false;
        editor.blocks.render($currentRecipe.instructions).then(() => {
          autosave = true;
        });
      } else {
        editor.blocks.clear();
      }
    }
  }

  let editorConfig;

  onMount(async () => {
    const { list, image, underline, header, marker, table } = await loadTools();
    const recipesStorage = storage.ref("recipes").child($currentRecipe.id);

    async function uploadByFile(file) {
      const snapshot = await recipesStorage
        .child(file.name)
        .put(file)

      const url = await snapshot.ref.getDownloadURL();
      return {
        success: 1,
        file: { url },
      };
    }

    
    // Since we had to convert the nested arrays into objects
    // we now have to convert it back.
    const editorData = $currentRecipe.instructions
    if (editorData.blocks) {
      editorData.blocks.forEach((block) => {
        if (block.type === "table" && block.data.content) {
          block.data.content = Object.values(block.data.content)
        }
      });
    }

    editorConfig = {
      autofocus: true,
      placeholder: "Please write your instructions here",
      holder: "editorjs",
      data: editorData,

      onChange(api) {
        if (autosave) api.saver.save().then(saveInstructions);
      },

      tools: {
        list: {
          class: list,
          inlineToolbar: true,
        },
        image: {
          class: image,
          config: { uploader: { uploadByFile } },
        },
        underline: underline,
        header: header,
        marker: {
          class: marker,
        },
        table: {
          class: table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },
      },
    };
  });
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
