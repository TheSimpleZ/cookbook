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
  import Sidebar from '../components/Sidebar.svelte'

  onMount(async () => {
    const EditorJS = await import('@editorjs/editorjs')
    new EditorJS.default()
  })
</script>

<style>
  #recipes {
    display: flex;
    flex-direction: row;
    flex: 1;
  }

  #editorjs {
    flex-basis: 100%;
    width: 100%;
  }
</style>

<div id="recipes">
  <Sidebar />
  <div id="editorjs" />
</div>
