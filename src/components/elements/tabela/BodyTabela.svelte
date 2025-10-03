<script lang="ts">
    import type { Snippet } from "svelte";
    
    interface Props {
        children?: Snippet;
    }

    let { children}: Props = $props();
</script>

<tbody class="w-full">
    {#if children}
        {@render children()}
    {/if}
</tbody>