<script lang="ts">
    import SvgCompacto from "$components/assets/svg/SvgCompacto.svelte";

    interface Opcao {
        label: string;
        quantidade?: number | undefined;
        id: number;
    }

    interface Props {
        opcoes?: Opcao[];
        click?: VoidFunction;
    }

    const opcoesPadrao = [
        {
            label: 'All',
            id: 1
        },
        {
            label: 'Inbox',
            quantidade: 2,
            id: 2
        },
        {
            label: 'Following',
            id: 3
        }
    ];

    const onClick = ()=> {}

    let {opcoes = opcoesPadrao, click = onClick}: Props = $props();

    let itemAtivo: number | null = $state(0);

    function toggleAccordion(index: number) {
        itemAtivo = itemAtivo === index ? null : index;
        click(); 
    }

    function formatarQuantidade(qtd: number){
        let quantidade = qtd < 10 ? '0' + qtd : qtd;

        return quantidade;
    }
</script>

<div class="flex justify-between items-center w-full">
    <div class="flex md:gap-5 gap-3">
        {#each opcoes as {label, quantidade, id}, i}
            <button class="flex items-center justify-center font-medium text-[14px] {itemAtivo === i ? 'text-strong-950' : 'text-sub-600'} gap-1 relative" onclick={()=> toggleAccordion(i)}>
                {label} 
                {#if quantidade}
                    <span class="bg-error-base rounded-full text-[11px] text-static-white py-0.5 px-1 shrink-0">{formatarQuantidade(quantidade)}</span> 
                {/if}
                {#if itemAtivo === i}
                    <span class="w-4 h-0.5 bg-primary-base absolute top-[38px]"></span>
                {/if}
            </button>
        {/each}
        <button class='font-medium text-[14px] text-sub-600 border-l border-soft-200 md:pl-5 pl-3'>
            Archived
        </button>
    </div>
    <button>
        <SvgCompacto/>        
    </button>
    
    
</div>