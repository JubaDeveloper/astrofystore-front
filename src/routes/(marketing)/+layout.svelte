<script lang="ts">
    import SvgGridBgEsquerda from "$components/assets/svg/SvgGridBgEsquerda.svelte";
    import SvgGridBgDireita from "$components/assets/svg/SvgGridBgDireita.svelte";
    import LoaderSmooth from "$components/elements/loading/LoaderSmooth.svelte";
    import SvgDiscord from "$components/assets/svg/SvgDiscord.svelte";
    import Avatar from "$components/assets/avatar/Avatar.svelte";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import api from "$lib/api/api";

    import { quadInOut } from "svelte/easing";
    import { fly } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    let status = $state(false)
    let {children} = $props()

    async function  pesquisa() {
        const [_, err] = await api.get('/pesquisa-marketing')
        if(err) return status = true
        goto('/gestao-de-lojas')
    }

    onMount(()=>pesquisa());
</script>

{#if !status}
    <div class="flex items-center justify-center w-full h-svh">
        <LoaderSmooth cor="primary-base" tamanho="w-40"/>
    </div>
{:else}
    <div class="flex flex-col w-full h-full overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-soft-200 px-6">
            {@render top()}
        </div>

        <div class="flex items-center justify-between w-full overflow-hidden">
            <SvgGridBgEsquerda />

            <div class="flex flex-col justify-center items-center w-full" in:fly={{y: -400, duration: 600, delay: 600/1.5, easing: quadInOut}} out:fly={{x: -1000, duration: 600, easing: quadInOut}}>
                {@render children()}
            </div>

            <SvgGridBgDireita/>
        </div>
    </div>
{/if}

{#snippet top()}
    <button onclick={()=>goto("/login")}>
        <Avatar size="w-[40px]" src="/images/astronfy.png" name="logo"/>
    </button>

    <div class="flex items-center gap-2 whitespace-nowrap">
        Precisa de ajuda?
        <Botao tema="gray-transparent" onClick={()=>goto("")}>
            <SvgDiscord/>
            Suporte
        </Botao>
    </div>
{/snippet}