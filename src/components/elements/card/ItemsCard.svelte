<script lang='ts'>
    import SvgImgPadrao from '$components/assets/svg//SvgImgPadrao.svelte';
    import SvgMaisOpcoes from '$components/assets/svg//SvgMaisOpcoes.svelte';

    import type {Component, Snippet} from 'svelte'

    interface Props {
        label?: string;
        descricao?: string;
        Icon?:Component;
        children?: Snippet;
        click?:VoidFunction;
    }

    let {label = 'Label', descricao = '8 min ago ∙ Description insert here.', Icon = SvgImgPadrao, children, click}: Props = $props();
</script>

<div class="group rounded-2xl flex items-start justify-between hover:bg-weak-50 w-full p-3">
    <div class="flex items-start gap-4">
        <Icon />
        <div class="flex flex-col">
            <div class="flex flex-col">
                <p class="text-[14px] font-medium text-strong-950">{label}</p>
                <p class="text-[12px] font-normal text-sub-600">{descricao}</p>
            </div>
            {#if children}
                {@render children()}
            {/if}
        </div>
        
    </div>
    <button onclick={click} class="hidden group-hover:flex">
        <SvgMaisOpcoes/>       
    </button>
</div>