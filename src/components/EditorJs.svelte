<!-- /* eslint-disable ParseError */ -->
<script>
  import { onMount } from 'svelte'

  export let editor = undefined

  export let config = undefined

  let EditorJS 

  onMount(async () => {
    EditorJS = await import('@editorjs/editorjs')
  })

  $: if(EditorJS && config)
    editor = new EditorJS.default(config)

</script>

<style lang="scss" global>
  @use "sass:map";
  @use 'svelte-materialify/src/styles/theme' as *;


  #editorjs {
    color: var(--theme-text-primary);

    .ce-inline-toolbar {
      background-color: var(--theme-inline-toolbar);
      border: 1px solid  var(--theme-dividers);

      .ce-inline-tool:hover {
        background-color: var(--theme-inline-toolbar-btn-hover);
      }

      &__dropdown:hover {
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
      border: 1px solid  var(--theme-dividers);

      &__button, .cdx-settings-button {
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
        color: var(--theme-text-secondary);
    }
    .cdx-button{
      background-color: var(--theme-block-selected);
    }

    .ce-conversion-toolbar {
      background-color: var(--theme-inline-toolbar);
      border: 1px solid  var(--theme-dividers);
    }

    .ce-conversion-tool {
      &:hover {
        background-color: var(--theme-inline-toolbar-btn-hover);
      }

      &__icon {
        background-color: var(--theme-surface);
      }
    }
  }
</style>




<div id="editorjs"  {...$$restProps}/>

