<script>



	import { auth } from '../lib/firebase'
	import Cookies from 'js-cookie'
	import Nav from '../components/Nav.svelte'

	import { MaterialApp } from 'svelte-materialify'
	
	import { onMount } from 'svelte'
	import { stores } from '@sapper/app'
	
	let theme = 'dark'

	const { session } = stores()

	onMount(async () => {
	  auth.onIdTokenChanged(async (user) => {
	    try {
	      if (!user) {
	        console.log('User does not exist')
	        Cookies.set('token', false)
	        $session.user = false
	        return
	      }
	      const token = await user.getIdToken()
	      $session.user = token
	      Cookies.set('token', token)
	      console.log('User found and session set!')
	    } catch (e) {
	      console.log('Something went wrong')
	      Cookies.set('token', false)
	      $session.user = false
	      return
	    }
	  })
	})
</script>

	
<MaterialApp theme='{theme}'>
	<div>	
		<Nav />
	</div>
	<div>
		<slot />
	</div>
</MaterialApp>