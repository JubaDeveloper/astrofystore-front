<script lang='ts'>
    import SvgMaisOpcoes from "../svg/SvgMaisOpcoes.svelte";

    import { onDestroy, onMount, type Snippet } from "svelte";

    interface Props {
        opcoes: {label: string, action?: VoidFunction}[];
        children?: Snippet;
        posicao?: string;
    }

    let {opcoes, children, posicao = 'top-7 right-0'}: Props = $props();
    let mostrarOpcoes = $state<boolean>(false)
    let menuRef: HTMLDivElement;

    function cliqueFora(event: MouseEvent) {
        if (!menuRef?.contains(event.target as Node)) {
            mostrarOpcoes = false;
        }
    }
    function alternarExibicao() {
        mostrarOpcoes = !mostrarOpcoes
    }
    function chamarAcao(callback?: VoidFunction) {
        alternarExibicao()
        callback?.()
    }

    onMount(() => document.addEventListener("click", cliqueFora));

    onDestroy(() => document.removeEventListener("click", cliqueFora));
</script>

<div class="relative w-6 h-6" bind:this={menuRef}>
    <button class="flex items-center justify-center w-6 h-6 rounded-sm {mostrarOpcoes ? 'bg-sub-300' : ''}" onclick={alternarExibicao}>
        {#if children}
            {@render children()}
        {:else}
            <SvgMaisOpcoes props={{ class:"rotate-[-90deg]" }}/>
        {/if}
    </button>
    {#if mostrarOpcoes}
        <div class="absolute {posicao} flex flex-col p-1 bg-white rounded-md border border-soft-200 z-10">
            {#each opcoes as {label, action}}
                <button class="flex items-center p-2 rounded-sm text-sub-600 text-xs min-w-[6rem] hover:bg-weak-50 transition-colors" onclick={()=>chamarAcao(action)}>
                    {label}
                </button>
            {/each}
        </div>
    {/if}

</div>