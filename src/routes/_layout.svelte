<script>
	import Nav from '../components/Nav.svelte'
	import { auth } from '../lib/firebase'
	import Cookies from 'js-cookie'
	import Nav from '../components/Nav.svelte';
	import Sidebar from '../components/Sidebar.svelte';
	import { MaterialApp } from 'svelte-materialify';
	
	import { onMount } from 'svelte'
	import { stores } from '@sapper/app'
	
	export let segment
	let theme = 'light';

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
		<Nav></Nav>
	</div>
	<div>
	<Sidebar/>
	</div>
	<slot></slot>
</MaterialApp>
