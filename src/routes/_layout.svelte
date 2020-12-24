<script>
	import { auth } from '../lib/firebase'
	import { AppBar, Button } from 'svelte-materialify'
	import { stores, goto } from '@sapper/app'
	import {
  MaterialApp, Avatar, Menu, ListItem, List 
} from 'svelte-materialify'
	import { onMount } from 'svelte'

	import Cookies from 'js-cookie'

	let theme = 'dark'

const { session } = stores()
  

	export async function logout() {
	  await auth.signOut()
	  $session.user = undefined
	  goto('/')
	}
	
	onMount(async () => {
	  auth.onIdTokenChanged(async (user) => {			
	    const clearUserData = () => {
      Cookies.remove('user')
      $session.user = undefined
	    }
	    try {
	      if (!user) {
	        console.log('User does not exist')
	        clearUserData()
	        return
      }
      $session.user = user
	      Cookies.set('user', JSON.stringify(user.toJSON()))
	      console.log('User found and session set!')
	    } catch (e) {
	      console.log('Something went wrong')
	      clearUserData()
	      return
	    }
	  })
	})
</script>

<style>
  .app {
    height: calc(100vh - 48px);
  }
</style>

<MaterialApp {theme}>
	<div class="h-screen flex flex-column overflow-hidden">
		<nav>
			<AppBar dense>
				<span slot="title">Kookbook</span>
				<div style="flex-grow:1" />
				<div class="mr-4">
					{#if $session.user}
            <Menu nudgeX="-50" >
              <div slot="activator">
                <Button fab>
                  <Avatar size={40}><img src={$session.user.photoURL} alt="profile" /></Avatar>
                </Button>
              </div>
              <List>
                <ListItem on:click={logout}>Log out</ListItem>
              </List>
            </Menu>
					{/if}
				</div>
			</AppBar>
		</nav>
		<div class="app">
			<slot />
		</div>
	</div>
</MaterialApp>
