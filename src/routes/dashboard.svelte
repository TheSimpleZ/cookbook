<script context="module">
  export async function preload(page, session) {
    let { user } = session
    if (!user) {
      return this.redirect(302, '/')
    }
  }
</script>
<script>
  	import Sidebar from '../components/Sidebar.svelte'
</script>

<div>
  <Sidebar></Sidebar>
</div>

<div style='padding-left:280px'>
<h1>
  This is our protected dashboard! Only visible when you are logged in with
  Firebase
</h1>
</div>