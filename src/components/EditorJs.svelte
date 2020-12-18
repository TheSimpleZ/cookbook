<!-- /* eslint-disable ParseError */ -->
<script>
  import { onMount } from 'svelte'

  export let editor = undefined

  export let config = undefined

  onMount(async () => {
    const EditorJS = await import('@editorjs/editorjs')
    editor = new EditorJS.default(config)
  })
</script>

<style lang="scss" global>
  @use "sass:map";
  @use 'svelte-materialify/src/styles/theme' as *;


  #editorjs {
    color: var(--theme-text-primary);

    .ce-inline-toolbar {
      background-color: var(--theme-inline-toolbar);
      border: 1px solid  var(--theme-divider);

      .ce-inline-tool:hover {
        background-color: var(--theme-inline-toolbar-btn-hover);
      }
    }

    .ce-toolbar__settings-btn {
      background-color: var(--theme-inline-toolbar);

      &:hover {
        color: var(--theme-settings-btn-hover);
      }
    }

    .ce-settings {
      background-color: var(--theme-inline-toolbar);
      border: 1px solid  var(--theme-divider);

      &__button {
        color: var(--theme-text-primary);

        &:hover {
          background-color: var(--theme-inline-toolbar-btn-hover);
        }
      } 
    }

    .ce-block--selected .ce-block__content {
      background-color: var(--theme-block-selected);
    }

    .ce-block__content,
    .ce-toolbar__content {
        max-width: 900px;
    }

    .ce-toolbar__plus, .ce-toolbox__button {
        color: #8e8e8e;
    }
  }
</style>




<div id="editorjs"  {...$$restProps}/>

