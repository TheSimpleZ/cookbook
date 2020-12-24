<script context="module">

import { collection } from '../lib/store'
import { createRecipe } from '../lib/recipemanager'

export async function preload(page, { user }) {
  if (!(user && user.uid)) {
    return 
  }
  
 
  let recipes = collection('recipes').asRole(user.uid).limit(1)
  
  return recipes.preload(async (data) => {
    if(!data || data.length === 0) {
      data[0] = await recipes.add(createRecipe({ user }))
    }

    this.redirect(302, `/recipes/${data[0].id}`)
  })
}
  
</script>

<script>
  import FirebaseUi from '../components/FirebaseUi.svelte'
  import { Card, CardText } from 'svelte-materialify/src'

  let loading = true

</script>

<svelte:head>
  <title>Kookbook Login</title>
</svelte:head>


<div class="w-full h-full flex justify-center items-center">
  <Card style="max-width:300px;" {loading} >
    <div class="pl-4 pr-4 pt-3">
      <span class="text-overline">Welcome to the Kookbook app</span>
      <br />
      <span class="text-h5 mb-2">Login</span>
      <br />
    </div>
    <CardText>
      <FirebaseUi onLoad={() => {loading = false}} />
    </CardText>
  </Card>
</div>