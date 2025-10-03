<script lang="ts">
  import SvgAdicionar from "$components/assets/svg/SvgAdicionar.svelte";
  import SvgCadeado from "$components/assets/svg/SvgCadeado.svelte";
  import SvgCartao from "$components/assets/svg/SvgCartao.svelte";
  import SvgConta from "$components/assets/svg/SvgConta.svelte";
  import SvgPin from "$components/assets/svg/SvgPin.svelte";
  import SvgSubtrair from "$components/assets/svg/SvgSubtrair.svelte";


    import type { Component } from "svelte";

    interface Opcao {
        icon?: Component;
        label: string;
        texto: string;
    }

    interface Props {
        opcoes?: Opcao[];
        onClick?: () => void;
    }

    const opcoesPadrao = [
        { 
            icon: SvgConta,
            label: 'How do I update my account information?', 
            texto: 'Major credit and debit cards like Visa, MasterCard, and American Express, as well as digital payment options like PayPal and Apple Pay. ' 
        },
        { 
            icon: SvgCartao,
            label: 'How do I update my account information?', 
            texto: 'Major credit and debit cards like Visa, MasterCard, and American Express, as well as digital payment options like PayPal and Apple Pay. ' 
        },
        { 
            icon: SvgPin,
            label: 'How do I update my account information?', 
            texto: 'Major credit and debit cards like Visa, MasterCard, and American Express, as well as digital payment options like PayPal and Apple Pay. ' 
        },
        { 
            icon: SvgCadeado,
            label: 'How do I update my account information?', 
            texto: 'Major credit and debit cards like Visa, MasterCard, and American Express, as well as digital payment options like PayPal and Apple Pay. ' 
        },
    ];

    const onClickPadrao = () => {};

    let { opcoes = opcoesPadrao, onClick = onClickPadrao }: Props = $props();

    let itemAberto: number | null = $state(null);

    function toggleAccordion(index: number) {
        itemAberto = itemAberto === index ? null : index;
        onClick(); 
    }
</script>

<div class="flex flex-col md:w-96 w-full gap-2.5">
    {#each opcoes as {icon:Icon, label, texto}, i}
        <button class="w-full text-left p-3.5 rounded-xl {itemAberto === i ? 'border-none bg-weak-50' : 'border border-soft-200 bg-transparent'}" onclick={() => toggleAccordion(i)}>
            <div class="flex items-start justify-between gap-2.5">
                <div class="flex items-start gap-2.5">
                    {#if Icon}
                        <Icon props={{class:"shrink-0"}}/>
                    {/if}
                    <div class="flex flex-col gap-1.5">
                        <p class="font-medium text-[14px] text-strong-950">{label}</p>
                        {#if itemAberto === i}
                            <span class="font-normal text-[14px] text-sub-600 ">{texto}</span>
                        {/if}
                    </div>
                </div>
                {#if itemAberto === i}
                    <SvgSubtrair props={{class:"shrink-0"}}/>
                {:else}
                    <SvgAdicionar props={{class:"shrink-0"}}/>
                {/if}
            </div>
        </button>
    {/each}
</div>