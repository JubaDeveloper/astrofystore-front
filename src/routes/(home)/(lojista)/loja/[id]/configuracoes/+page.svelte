<script lang="ts">
    import Identidade from '$components/sections/loja/configuracoes/identidade/Identidade.svelte';
    import BannerLoja from '$components/sections/loja/configuracoes/banner/BannerLoja.svelte';
    import Dominio from '$components/sections/loja/configuracoes/dominio/Dominio.svelte';
    import StepIndicator from '$components/elements/progress/StepIndicator.svelte';
    import BubbleWrapper from '$components/elements/wrappers/BubbleWrapper.svelte';
    import SelectStatus from '$components/sections/select/SelectStatus.svelte';
    import SvgPoliticas from '$components/assets/svg/SvgPoliticas.svelte';
    import TextEditor from '$components/elements/texts/TextEditor.svelte';
    import SvgImagem from '$components/assets/svg/SvgImagem.svelte';
    import SvgTenda from '$components/assets/svg/SvgTenda.svelte';
    import SvgGlobo from '$components/assets/svg/SvgGlobo.svelte';
    import { fade } from 'svelte/transition';
    import Politicas from '$components/sections/loja/configuracoes/politicas/Politicas.svelte';
  import SvgMaoPidona from '$components/assets/svg/SvgMaoPidona.svelte';
  import Pagamento from '$components/sections/loja/configuracoes/pagamento/Pagamento.svelte';

    
    const buttons = [
        { label:"Identidade", icon: SvgTenda },
        { label:"Banners", icon: SvgImagem },
        { label:"Pagamento", icon: SvgMaoPidona },
        { label:"Domínios", icon: SvgGlobo },
        { label:"Políticas", icon: SvgPoliticas },
    ]

    let etapaAtual = $state(1);
</script>

{#snippet header()}
    <div class="flex w-full items-center justify-between border-b border-soft-200 pb-5">
        <div class="flex flex-col">
            <p class="text-lg font-medium text-strong-950">Configurações da Loja</p>
            <p class="text-sm font-medium text-sub-600">Edite informações e recursos da loja</p>
        </div>
        <SelectStatus/>
    </div>
{/snippet}

{#snippet sideMenu()}
    <BubbleWrapper css="w-[256px] px-0">
        <span class="text-sub-600 text-[12px] px-4 font-normal mb-2">MENU</span>
        <div class="px-2">
            <StepIndicator format="col" indicator="icon" steps={buttons} bind:currentStep={etapaAtual} click={true}/>
        </div>
    </BubbleWrapper>
{/snippet}

<div class="flex flex-col w-full gap-6">
    {@render header()}
    <div class="flex relative items-start gap-6 w-full">
        {@render sideMenu()}
        <div class="relative flex w-full ">
            {#key etapaAtual}
                <div class="absolute w-full" transition:fade={{duration:300}}>
                    {#if etapaAtual===1}
                        <Identidade/>
                    {:else if etapaAtual===2}
                        <BannerLoja/>
                    {:else if etapaAtual===3}
                        <Pagamento/>
                    {:else if etapaAtual===4}
                        <Dominio/>
                    {:else if etapaAtual===5}
                        <Politicas/>
                    {/if}
                </div>  
            {/key}
        </div>
    </div>
</div>