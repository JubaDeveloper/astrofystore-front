<script lang="ts">
    import BarraDePesquisa from "$components/elements/search/BarraDePesquisa.svelte";
    import type { Snippet } from "svelte";
    import SetaSelect from "$components/assets/svg//SvgSetaSelect.svelte";
    import { slide } from 'svelte/transition';

    interface Props {
        titulo?: string;
        children?: Snippet;
        pesquisar?: boolean;
    }

    let { titulo = 'Selecione', children, pesquisar = true}: Props = $props();

    let visibilidade = $state<boolean>(false);

    function click() {
        visibilidade = !visibilidade;
    }
</script>

<div class="relative flex flex-col gap-2">
    <button class="flex items-center justify-between gap-5 py-1.5 px-2.5 rounded-[8px] border border-soft-200" onclick={()=> click()}>
        <p class="text-sub-600 font-normal text-[14px]">{titulo}</p>
        <SetaSelect props={{class: visibilidade ? 'rotate-180' : ''}}/>
    </button>
    {#if visibilidade}
        <div class="absolute top-0 right-0 translate-y-11 flex flex-col gap-1 p-1 rounded-[8px] border border-soft-200 w-[300px] bg-white-0 z-10" transition:slide={{ duration: 400 }}>
            {#if pesquisar}
                <BarraDePesquisa/>
            {/if}
            {#if children}
                {@render children()}
            {/if}
        </div>
    {/if}
</div>
