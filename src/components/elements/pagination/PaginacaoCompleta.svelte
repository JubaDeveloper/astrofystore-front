<script lang="ts">
  import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
  import type { Option } from "$lib/utils/types";
  import Paginacao from "./Paginacao.svelte";


  interface Props{
        onSelecionarPagina: VoidFunction,
        onSelecionarQuantidade?:VoidFunction,
        pagina:number,
        totalPaginas:number
        qtdPaginas:number
    }

    let {
        onSelecionarPagina,
        onSelecionarQuantidade,
        pagina = $bindable(),
        totalPaginas,
        qtdPaginas=$bindable(2)
    }:Props = $props()

    function mudarQuantidade(){
        pagina = 1
        onSelecionarPagina()
    }

    const opPaginas:Option[] = []
    for(let i=1;i<12;i++){
        opPaginas.push({
            label:i+"/ página",
            value:i
        })
    }

</script>


<div class="flex justify-between items-center w-full text-[14px] text-sub-600 font-normal">
    Página {pagina} de {totalPaginas ?? 1}
    {#if totalPaginas > 1}
        <Paginacao bind:pagina={pagina} totalPaginas={totalPaginas} onSelecionarPagina={onSelecionarPagina}/>
    {/if}
    <div class="grid h-[40px] w-[132px]">
        <SelectBlock 
        dropCss="absolute top-[-210px] left-0 w-full max-h-[200px] rounded-lg overflow-y-auto bg-transparent border border-[rgba(0,0,0,.05)]  
        dark:border-none outline-none shadow-lg dark:shadow-none flex flex-col origin-bottom"
         bind:value={qtdPaginas} options={opPaginas}  onSelect={mudarQuantidade} placeholder=""/>
    </div>
</div>

