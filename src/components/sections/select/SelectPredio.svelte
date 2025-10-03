<script lang="ts">
    import Check from "$components/assets/checkboxs/Check.svelte";
    import Search from "$components/assets/input/Search.svelte";
    import LoaderSmooth from "$components/elements/loading/LoaderSmooth.svelte";
    import { PredioController } from "$lib/api/modules/predios/predio.controller.svelte";
    import type { FiltrosPrediosListagem, PredioInListType } from "$lib/api/modules/predios/predio.dto.svelte";
    import { fade } from "svelte/transition";

    
    interface Props{
        predio:PredioInListType | null,
    }

    let {predio = $bindable()}:Props = $props()

    let filtros = $state<FiltrosPrediosListagem>({
        nome:""
    })

    let listaPredios = $state<PredioInListType[]>([])
    let loading = $state(false)


    const prediosController = new PredioController()

    const pesquisarPredios = async() => {
        loading=true
        const [data,error] = await prediosController.listar(filtros)
        loading=false
        if(error){
            return
        }
        listaPredios = data.resultado 
    }   

    const formatarEndereco = (p:PredioInListType) =>{
        const end = p.endereco
        if(end===null) return ""
        return `${end.logradouro},${end.numero} - ${end.bairro}, ${end.estado}`
    }

    pesquisarPredios()

    
</script>


<div class="flex flex-col px-4 w-full">
    <Search label="Selecione um prédio" onEnter={pesquisarPredios} bind:value={filtros.nome as string} 
    placeholder="Endereço ou CEP"/>
    <div class="flex flex-col py-2 border w-full border-soft-200 relative rounded-2xl mt-2 max-h-[200px]">
        {#if loading}
            <div class="w-full flex items-center justify-center p-12">
                <LoaderSmooth cor="black" tamanho="23px"/>
             </div>
        {:else}
            <div class="flex flex-col overflow-y-auto gap-1 px-2 w-full relative">
                {#if predio}
                    {@render itemPredio(predio,true)}
                {:else}
                    {#each listaPredios as predio}

                        {@render itemPredio(predio)}
                
                    {/each}
                {/if}
                {#if listaPredios.length===0}
                    <div class="flex items-center justify-center p-12">
                        Nenhum resultado encontrado
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>


{#snippet itemPredio(p:PredioInListType,marked?:boolean)}
    <button class="flex items-center justify-between gap-2 w-full rounded-lg px-2 py-2 hover:bg-slate-100" onclick={()=>{
        if(marked){
            predio=null
            return
        }
        predio = p
    }}>
        <div class="flex items-center gap-[14px]">

            {#if marked}

                <Check checked={true}/>

            {/if}

            <div class="flex flex-col leading-4">
                <b class="text-[14px] text-left font-medium">
                    {p.nome}
                </b>
                <span class="text-sub-600 text-left text-[12px]">
                    {formatarEndereco(p)}
                </span>
            </div>
    
        </div>
        <span class="bg-faded-lighter text-faded-base text-[12px] px-2 py-[1px] rounded-lg whitespace-nowrap">
            {#if p.endereco}
                {p.endereco.cep}
            {:else}
                Não informado
            {/if}
        </span>
    
    </button>
{/snippet}