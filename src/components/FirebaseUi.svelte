<script>
  import { auth, fb } from '../lib/firebase'
  import 'firebaseui/dist/firebaseui.css'
  import { stores } from '@sapper/app'
  import { onMount } from 'svelte'
  import Cookies from 'js-cookie'

  export let onLoad
  const { session } = stores()

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
      signInSuccessUrl: '/recipes',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        fb.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
    }

    auth.onIdTokenChanged(async (user) => {
      try {
        if (!user) {
          console.log('User does not exist')
          Cookies.remove('token')
          $session.user = undefined
          return
        }
        const token = await user.getIdToken()
        $session.user = token
        Cookies.set('token', token)
        console.log('User found and session set!')
      } catch (e) {
        console.log('Something went wrong')
        Cookies.remove('token')
        $session.user = undefined
        return
      }
    })

    ui.start('#firebaseui-auth-container', uiConfig)
  })
</script>


<div id="firebaseui-auth-container" />
