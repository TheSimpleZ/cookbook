<script>
  import { fb } from '../lib/firebase'
  import 'firebaseui/dist/firebaseui.css'

  import { onMount } from 'svelte'

  onMount(async () => {
      const fbui = await import('firebaseui')

      const ui = new fbui.auth.AuthUI(fb.auth())

      var uiConfig = {
          callbacks: {
              signInSuccessWithAuthResult: function () {
                  // User successfully signed in.
                  // Return type determines whether we continue the redirect automatically
                  // or whether we leave that to developer to handle.
                  return true
              },
              uiShown: function () {
                  // The widget is rendered.
                  // Hide the loader.
                  document.getElementById('loader').style.display = 'none'
              },
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
<div id="loader">Loading...</div>
