<script lang="ts">
  import { page } from "$app/state";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import DropBlock from "$components/assets/logic/DropBlock.svelte";
  import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
  import SvgPlus from "$components/assets/svg/SvgPlus.svelte";
  import SvgThreeDots from "$components/assets/svg/SvgThreeDots.svelte";
  import BubbleWrapper from "$components/elements/wrappers/BubbleWrapper.svelte";
  import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
  import { ProdutoVariacaoController } from "$lib/api/modules/produto/variacao/produto.variacao.controller";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import { onMount, type Component } from "svelte";
  import AdicionarAtributos from "./modais/AdicionarAtributos.svelte";
  import sinalizador from "$lib/utils/signal.svelte";

  let atributos = $state<{
    id:number,
    nome:string,
    valores:{
      id:number,
      valor:string,
    }[]
  }[]>([])


  let openDropDown = $state<boolean[]>([])
  let modalAtributos: boolean = $state(false)
  let loading = $state(false)
  let modalAtributosContainer = $state<ReturnType<typeof AdicionarAtributos>>()

  const produtoController = new ProdutoController()
  const produtoVariacaoController = new ProdutoVariacaoController(parseInt(page.params.idProduto),parseInt($idLoja))


  async function listar(){
    const [r,e] = await produtoController.listarAtributos(parseInt($idLoja),parseInt(page.params.idProduto))
    atributos = r.data.resultado
  }

  async function excluirAtributo(idAtributo:number){
      produtoController.deletarAtributo(parseInt($idLoja),parseInt(page.params.idProduto),idAtributo)
      atributos = atributos.filter((obj)=>obj.id!==idAtributo)
      openDropDown=[]
  }

  async function gerar(){
    loading=true
    const [r,e] = await produtoVariacaoController.gerarVariacoes()
    sinalizador.sendSignal("reloadVariacoes")
    loading=false
  }

  onMount(listar)




</script>

<BubbleWrapper css="w-[360px] px-0">
  <div class="flex w-full items-center justify-between px-4">
      <p class="text-16 font-medium text-strong-950">{'Atributos'}</p>
      <button class="flex items-center gap-2 group text-primary-base bg-[#784DEF10] hover:bg-[#775CFF] hover:text-white-0 text-14 font-medium rounded-[8px] px-4 p-2.5" onclick={()=>modalAtributos=true}>
        <SvgPlus props={{
          class:"fill-[#775CFF] group-hover:fill-white-0"
        }}/> Atributo
      </button>
  </div>

  <div class="border-b border-soft-200 my-3"></div>

  {#if atributos.length < 1}
    <div class="flex flex-col px-5">
      <p class="text-14 font-medium text-strong-950">Você ainda não tem atributos cadastrados.</p>
      <p class="text-12 font-normal text-faded-base mt-0.5">
        Adicione atributos para criar variáveis de forma rápida.
      </p>
    </div>
  {:else}
    <div class="flex flex-col">
      {#each atributos as atributo, i}
        <div class="flex items-center justify-between px-5 py-3 first:pt-0  border-b border-soft-200">
          <p class="text-14 font-medium text-strong-950">{atributo.nome}</p>
          <div class="flex items-center gap-2.5">
            {#each atributo.valores as variacao, i}
              <div class="flex items-center border border-soft-200 rounded-[10px] px-2 py-1">
                <span class="text-sub-600 text-12 font-medium">{variacao.valor}</span>
              </div>
            {/each}
            <div class="flex">
              <button onclick={()=>openDropDown[i]=true}>
                <SvgThreeDots/>
              </button>  
              <FocusBlock bind:isFocus={openDropDown[i]} className="relative" >
                <DropBlock isDrop={openDropDown[i]} className="absolute -bottom-2 right-0">
                    {@render selection(()=>{
                      excluirAtributo(atributo.id)
                    },()=>{
                      if(!modalAtributosContainer)return
                      modalAtributosContainer.modoEdicao({
                        nome:atributo.nome,
                        variacoes:atributo.valores.map((obj)=>{
                          return obj.valor
                        })
                      },atributo.id);

                    })}
                </DropBlock>
              </FocusBlock>
            </div>
          </div>
        </div>
      {/each}

    </div>

  <div class="grid grid-cols-1 gap-3 px-4 h-[40px] mt-3">

    <Botao onClick={gerar} {loading} tema={'primary'} >
      Gerar variações
    </Botao>
  </div>
  {/if}
</BubbleWrapper>

{#snippet selection(onExcluir:VoidFunction,onEditar:VoidFunction)}
  {@const actions = [
    {label:"Editar",action:onEditar},
    {label:"Excluir",action:onExcluir},
  ]}
  <div class="p-2 w-40 bg-white-0 rounded-2xl shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.10)] outline outline-offset-[-1px] outline-soft-200 inline-flex flex-col justify-start items-start gap-1 overflow-hidden">
    {#each actions as ac}
        <button onclick={ac.action} class="self-stretch p-2 bg-white-0 hover:bg-weak-50 rounded-lg inline-flex justify-start items-center gap-2 overflow-hidden">
            <div class="flex justify-start items-center gap-1">
                <div class="justify-start {ac.label==="Excluir" ? "text-error-base" : "text-strong-950"} text-sm font-normal leading-tight">
                    {ac.label}
                </div>
            </div>
        </button>
    {/each}
  </div>
{/snippet}


<AdicionarAtributos click={listar} bind:open={modalAtributos} bind:this={modalAtributosContainer} idProduto={parseInt(page.params.idProduto)}/>