<script>
    import { idLoja } from "$lib/utils/rotas.svelte";
    import { page } from "$app/state";
    import { onMount } from "svelte";

    let { children} = $props()

    onMount(() => {
        $idLoja = page.params.id

    })
</script>

{#if $idLoja}
    {@render children()}
{/if}