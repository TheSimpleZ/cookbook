<script context="module">
  export async function preload(page, session) {
    let { user } = session;
    if (!user) {
      return this.redirect(302, "/");
    }
  }
</script>

<script>
  import { onMount } from "svelte";
  
  onMount(async () => {
    const EditorJS = await import("@editorjs/editorjs");
    const editor = new EditorJS.default();
  });
</script>

<div id="editorjs" />
