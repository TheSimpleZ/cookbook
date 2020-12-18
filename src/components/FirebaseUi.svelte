<script>
  import { auth, fb } from '../lib/firebase'
  import 'firebaseui/dist/firebaseui.css'
  import { onMount } from 'svelte'
  
  export let onLoad

  onMount(async () => {
    const fbui = await import('firebaseui')

    const ui = new fbui.auth.AuthUI(auth)

    var uiConfig = { 
      callbacks: {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        signInSuccessWithAuthResult: () => true,
        uiShown: onLoad,
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      signInSuccessUrl: '/',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        fb.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
    }

    

    ui.start('#firebaseui-auth-container', uiConfig)
  })
</script>


<div id="firebaseui-auth-container" />
