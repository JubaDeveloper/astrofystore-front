<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Badge from "$components/assets/badge/Badge.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import PaginacaoFeed from "$components/assets/paginacao/PaginacaoFeed.svelte";
  import PaginacaoTabela from "$components/assets/paginacao/PaginacaoTabela.svelte";
  import PaginacaoVariaveis from "$components/assets/paginacao/PaginacaoVariaveis.svelte";
  import SvgPlus from "$components/assets/svg/SvgPlus.svelte";
  import SvgSetaDireita from "$components/assets/svg/SvgSetaDireita.svelte";
  import SvgStatusCircle from "$components/assets/svg/SvgStatusCircle.svelte";
  import LoaderSmooth from "$components/elements/loading/LoaderSmooth.svelte";
  import BubbleWrapper from "$components/elements/wrappers/BubbleWrapper.svelte";
  import { EstoqueController } from "$lib/api/modules/lojas/estoque/estoque.controller";
  import { ProdutoVariacaoController } from "$lib/api/modules/produto/variacao/produto.variacao.controller";
  import type { ProdutoVariacaoDto } from "$lib/api/modules/produto/variacao/produto.variacao.dto";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
  import storageService from "$lib/utils/storageService";
  import toast from "$lib/utils/toast.svelte";
  import { encurtarTexto } from "$lib/utils/utils.svelte";
  import SideBarEstoqueVariavel from "../loja/estoque/SideBarEstoqueVariavel.svelte";

  
  let estado = $state({
    paginaAtual: 1,
    itensPorPagina: 5
  });

  let loading = $state<boolean>(false)  
  let variacoes = $state<ProdutoVariacaoDto[]>([])
  let openModal = $state(false)
  let modalContainer = $state<ReturnType<typeof SideBarEstoqueVariavel>>()

  let paginacao = $derived({
    totalPaginas: Math.ceil(variacoes.length / estado.itensPorPagina),
    itensPaginaAtual: variacoes.slice(
      (estado.paginaAtual - 1) * estado.itensPorPagina,
      estado.paginaAtual * estado.itensPorPagina
    )
  });

  function proximaPagina() {
    if (estado.paginaAtual < paginacao.totalPaginas) estado.paginaAtual++;
  }

  function paginaAnterior() {
    if (estado.paginaAtual > 1) estado.paginaAtual--;
  }


  const estoqueController = new EstoqueController(parseInt($idLoja),parseInt(page.params.idProduto))
  const produtoVariacaoController = new ProdutoVariacaoController(parseInt(page.params.idProduto),parseInt($idLoja))

  async function listar(){
    loading=true
    const [r,e] = await produtoVariacaoController.listar();
    estado.paginaAtual=1
    variacoes = r.data.resultado
    loading=false
  }

  async function concluir(){
    goto(`/loja/${$idLoja}/produtos`)

  }
  
  function status(qtd:number,estoquebaixo:number | null,tipoEstoque:string){

      if(tipoEstoque==="mensagem"){
          return {text:"🚀",tema:"primary-base"}
      }

      
      if((!estoquebaixo && qtd>0) || (estoquebaixo && qtd>estoquebaixo)){
            return {text:"😁 "+qtd,tema:"success-lighter"}
      }
      
      if(qtd!==0 && estoquebaixo && qtd<estoquebaixo){
            return {text:"😦 " + qtd,tema:"warning-light"}
      }

      if(qtd===0){
            return {text:"😫 " + "esgotado",tema:"error-base"}
      }

        return {text:"🚀 ILIMITADO",tema:"feature-base"}
        
  }




  listar()

  $effect(()=>{
    if(sinalizador.signal.tipo==="reloadVariacoes") listar()
  })

  


</script>

<BubbleWrapper css="w-[440px] px-0">
  <div class="flex w-full items-center justify-between px-4">
    <p class="text-16 font-medium text-strong-950">{'Variações'}</p>
    <button
      class="flex items-center gap-2 text-primary-base group bg-[#784DEF10] hover:bg-[#775CFF] hover:text-white-0 text-14 font-medium rounded-[8px] p-2.5"
      onclick={() => {
        openModal=true
      }}
    >
    <SvgPlus props={{
      class:"fill-[#775CFF] group-hover:fill-white-0"
    }}/> Variação
    </button>
  </div>

  {#if !loading}
  {#if variacoes.length < 1}
    <div class="border-b border-soft-200 my-3"></div>

    <div class="flex flex-col px-5 ">
      <p class="text-14 font-medium text-strong-950">Cadastre Variações</p>
      <p class="text-12 font-normal mt-1 text-faded-base ">Pense nas variações como as opções de um mesmo produto. Elas podem mudar o preço e/ou o que vem dentro.</p>
    </div>

    <div class="w-full h-[1px] bg-soft-200 mt-3"></div>
  {:else}
    <div class="grid grid-cols-4 bg-weak-50 px-5 py-2 mt-3">
      <p class="text-14 font-normal text-sub-600 col-span-3">Item</p>
      <p class="text-14 font-normal text-sub-600">Estoque</p>
    </div>
    <div class="flex flex-col">
      {#each variacoes.slice((estado.paginaAtual-1)*estado.itensPorPagina,estado.paginaAtual*estado.itensPorPagina) as produto, i}
      {@const estado = produto.estoque ? status(produto.estoque.estoqueItens.length ?? 0,produto.estoque.estoqueBaixo,produto.estoque.tipoEstoque) : null}
        <button onclick={() => {
          if(!modalContainer) return
          modalContainer.modoEdicao(produto)
          openModal = true;
        }} class="hover:bg-soft-200 items-center grid grid-cols-4 px-5  py-3 border-b border-soft-200">
          <div class="flex items-center gap-3 col-span-3">
            {@render CardImgStatus(produto.id,produto.imagem,true)}
            <div class="flex flex-col justify-start">
              <p class="text-14 text-strong-950 text-left font-medium">{encurtarTexto(produto.nome, 27)}</p>
              <p class="text-12 text-left {produto.preco > 0 ? 'text-sub-600' : 'text-error-base'} font-medium">
                {produto.preco > 0 ? 'R$ ' + (produto.preco/100).toFixed(2) : 'Item sem preço.'}
              </p>
            </div>
          </div>
          <div class="flex items-center justify-between mt-3">
            {#if estado}
              <Badge tema={estado.tema} css="h-5 px-2 rounded-full">

                <div class="text-[10px]">
                  {estado ? estado.text : ":C"}
                </div>

              </Badge>
            {:else}
              <div> - </div>
            {/if}
            <div>
              <SvgSetaDireita />
            </div>
          </div>
        </button>
      {/each}

    

    </div>
    <div class="mt-3">

    </div>
    <PaginacaoVariaveis
      paginaAtual={estado.paginaAtual}
      totalPaginas={paginacao.totalPaginas}
      proxima={proximaPagina}
      anterior={paginaAnterior}
    />

  {/if}
  {:else}
    <div class="flex w-full grow justify-center items-center">
      <LoaderSmooth tamanho="w-8" cor="black"/>
    </div>
  {/if}


  <div class="grid grid-cols-1 gap-3 px-4 h-[40px] mt-4">

    <Botao onClick={concluir}  tema={'primary'} >
      Concluir
    </Botao>
  </div>
</BubbleWrapper>

<SideBarEstoqueVariavel bind:this={modalContainer}  bind:open={openModal} onSalvar={listar} onExcluir={(idExcluir)=>{
  variacoes = variacoes.filter((obj)=>obj.id!==idExcluir)
  listar()
}} back={()=>{}}/>


{#snippet CardImgStatus(produtoId:number,imagem:{
  "id": number,
  "nome":string,
  "alt_text": string,
  "arquivoId": number,
},status:boolean)}

<div class="relative">
  <Avatar src={imagem ? produtoVariacaoController.pegarImagem(produtoId,imagem.id) : ""} name={imagem ? imagem.nome : "aa"} rounded={'rounded-[8px]'}/>
  <div class="absolute -bottom-2 -right-2">
    <SvgStatusCircle cor={status ? '#1FC16B' : '#CACFD8'}/>
  </div>
</div>

{/snippet}