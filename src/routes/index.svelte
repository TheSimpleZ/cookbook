<script context="module">
  export async function preload(_, { user }) {
    if (user) {
      return this.redirect(302, '/recipes')
    }
  }
</script>

<script>
  import FirebaseUi from '../components/FirebaseUi.svelte'
</script>

<svelte:head>
  <title>Cookbook Login</title>
</svelte:head>

<FirebaseUi />
