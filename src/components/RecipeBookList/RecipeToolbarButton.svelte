<script>
import {
  Icon, 
  ButtonGroupItem,
  Tooltip,
} from 'svelte-materialify'

export let iconPath
</script>

<Tooltip bottom>
  <ButtonGroupItem class="w-full" on:click>
    <Icon path={iconPath} />
  </ButtonGroupItem>
  <span slot="tip">
    <slot />
  </span>
</Tooltip>