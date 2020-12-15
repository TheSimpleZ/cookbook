<!-- /* eslint-disable ParseError */ -->
<script context="module">
  export async function preload(page, session) {
    let { user } = session
    if (!user) {
      return this.redirect(302, '/')
    }
  }
</script>

<script>
  import { onMount } from 'svelte'
  import {
    NavigationDrawer, List, ListItem 
} from 'svelte-materialify'

  onMount(async () => {
    const EditorJS = await import('@editorjs/editorjs')
    new EditorJS.default()
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
  }
</style>


<div class="flex flex-1">
  <NavigationDrawer>
    <List>
        <ListItem>Recipie 1</ListItem>
        <ListItem>Recipie 2</ListItem>
    </List>
  </NavigationDrawer>
  <div class="flex-1" id="editorjs" />
</div>
