<script context="module">
  export async function preload(_, { user }) {
    if (user) {
      return this.redirect(302, '/recipes')
    }
  }
</script>

<script>
  import { auth, fb } from '../lib/firebase'
  import 'firebaseui/dist/firebaseui.css'
  import { onMount } from 'svelte'
  import { Card, CardText } from 'svelte-materialify/src'

  let loader

  onMount(async () => {
    const fbui = await import('firebaseui')

    const ui = new fbui.auth.AuthUI(auth)

    var uiConfig = {
      callbacks: {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        signInSuccessWithAuthResult: () => true,
        uiShown: () => {
          // The widget is rendered.
          // Hide the loader.
          loader.style.display = 'none'
        },
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      signInSuccessUrl: '/recipes',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        fb.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
    }

    ui.start('#firebaseui-auth-container', uiConfig)
  })
</script>

<svelte:head>
  <title>Cookbook Login</title>
</svelte:head>

<div class="w-full flex justify-center items-center">
  <div class="flex-initial">
    <Card style="max-width:300px;">
      <div class="pl-4 pr-4 pt-3">
        <span class="text-overline">Welcome to the Cookbook app</span>
        <br />
        <span class="text-h5 mb-2">Login</span>
        <br />
      </div>
      <CardText>
        <div id="firebaseui-auth-container" />
        <div bind:this={loader}>Loading...</div>
      </CardText>
    </Card>
  </div>
</div>
