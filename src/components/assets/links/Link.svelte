<script lang="ts">
  import type { Snippet } from "svelte";


    interface Props{
        action: VoidFunction,
        children:Snippet
    }

    let {action,children}:Props = $props()

</script>


<button class="text-sub-600 font-medium text-[14px] underline" onclick={action}>
    {@render children()}    
</button>