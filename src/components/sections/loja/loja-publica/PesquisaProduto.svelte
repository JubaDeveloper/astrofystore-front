<script lang="ts">
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import LoaderMinhocaExpend from "$components/assets/loading/LoaderMinhocaExpend.svelte";
import DropBlock from "$components/assets/logic/DropBlock.svelte";
  import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
  import SvgSearch from "$components/assets/svg/SvgSearch.svelte";
  import SvgX from "$components/assets/svg/SvgX.svelte";
  import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import { LojaPublicaController } from "$lib/api/modules/loja-publica/loja.publica.controller";
  import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
  import domainManager from "$lib/settings/domain.svelte";


  const lojaPublicaController = new LojaPublicaController()

  interface Props{
    produtoId:number | undefined,
  }

  let {produtoId =$bindable()}:Props = $props()

  let open = $state(false)

  let inputC = $state<HTMLInputElement>()
  let value = $state("")

  let produto = $state<any>()

  let loading = $state()

  let lista = $state<any[]>([])

  async function listar(){
    loading = true
    const [r,e] = await lojaPublicaController.listarProdutos(domainManager.ultimoDominioAcessado!,{
        pesquisa:value
    })
    lista = await Promise.all(
    r.data.resultado.map(async (obj:any) => {
        const [ids, err] = await new ProdutoController().listarImagens(obj.id);
        
        return {
        ...obj,
        imagensId: ids.imagens
        };
    })
    );
    loading=false
  }
    $effect(()=>{
        if(value.length>=0) listar()
    })

    $effect(()=>{
        if(open===true && inputC){
            setTimeout(()=>{
                if(inputC)
                inputC.focus()
            },120)
        }
    })
</script>


<InputWrapper label="Selecione um produto" value="" mandatory={true}>
    <FocusBlock className="relative flex flex-col" 
    itensWithFocus={["input"]}
    bind:isFocus={open}>
        <div class="grow h-[40px] rounded-[8px] border border-soft-200 px-3 flex w-full">
            {#if produtoId && produto}

                <div class="flex items-center justify-between w-full truncate gap-2">
                
                    <div class="flex items-center gap-2 truncate">
                        <div class="shrink-0">
                            <Avatar name={produto.nome}
                            size="w-7"
                            textSize="text-[12px]"
                            rounded="rounded=[4px]" 
                            src={produto.imagensId.length>0 ? produto.imagensId[0].url : ""}/>
                        </div>
                        {produto.nome}    
                    </div>

                    <button onclick={()=>{
                        produtoId=undefined
                        produto = undefined
                    }} class='p-1.5 group'>
                        <SvgX props={{
                            class:"fill-sub-600 group-hover:fill-error-base w-2.5 h-2.5"
                        }}/>
                    </button>    
                </div>

            {:else}
                <div class="flex items-center justify-between w-full">
                    <input bind:this={inputC} type="text" placeholder="Ex: produtinho" 
                    onkeydown={()=>open=true} 
                    class="outline-0 border-none text-[14px] text-strong-400 grow"
                    bind:value/>
                    <button onclick={()=>open=true}>
                        <SvgSearch/>
                    </button>    
                </div>
            {/if}
            </div>
            <DropBlock isDrop={open} 
            className="absolute top-[100%] border border-soft-200 rounded-[16px] mt-2 w-full z-2 max-h-[400px] overflow-y-auto  bg-white-0 flex flex-col">
                {#if loading}
                    <div class="flex flex-col w-full grow h-[200px] justify-center items-center">
                        <LoaderMinhocaExpend label="Procurando os produtos" />
                    </div>
                {:else}
                    {#if lista.length===0}
                        <div class="flex flex-col">
                            <b class="text-[16px] font-medium">
                                Nenhum produto encontrado
                            </b>
                            <span class="text-[14px] text-sub-600">
                                Tente alterar sua busca
                            </span>
                        </div>
                    {:else}
                        {#each lista as p}
                            <button class="flex p-3 text-left hover:bg-soft-200 px-5 text-[12px] items-center gap-3"
                            onclick={()=>{
                                produtoId = p.id
                                produto = p
                                open=false
                            }}>
                                <div class="shrink-0">
                                    <Avatar name={p.nome}
                                    size="w-7"
                                    textSize="text-[12px]"
                                    rounded="rounded=[4px]" 
                                    src={p.imagensId.length>0 ? p.imagensId[0].url : ""}/>
                                </div>
                                {p.nome}
                            </button>
                        {/each}
                    {/if}
                {/if}
            </DropBlock>
    </FocusBlock>
</InputWrapper>