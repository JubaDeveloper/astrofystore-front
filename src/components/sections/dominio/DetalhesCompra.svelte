<script lang="ts">
  import Botao from "$components/assets/buttons/Botao.svelte";
  import SvgCart from "$components/assets/svg/SvgCart.svelte";
  import BubbleWrapper from "$components/elements/wrappers/BubbleWrapper.svelte";
  import { onMount, untrack, type Snippet } from "svelte";
  import Cupom from "./Cupom.svelte";
  import { goto } from "$app/navigation";
  import type { CarrinhoResponseDto } from "$lib/api/modules/carrinho/carrinho.dto";
  import sanitizar from "$lib/sanitizers/sanitizer";
  import storageService from "$lib/utils/storageService";
  import { CarrinhoController } from "$lib/api/modules/carrinho/carrinho.controller";
  import domainManager from "$lib/settings/domain.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
  import carrinhoData from "$lib/api/modules/carrinho/carrinho.data.svelte";
  import { page } from "$app/state";
  import SvgChorandinho from "$components/assets/svg/historico/SvgChorandinho.svelte";
  import ItemCarrinho from "./ItemCarrinho.svelte";
  import SvgSad from "$components/assets/svg/min/SvgSad.svelte";

  interface Props {
    modo: "edicao" | "visualizacao";
    compra: any;
  }

  let { modo, compra = $bindable() }: Props = $props();

  let carrinho = $state<CarrinhoResponseDto>();
  let loadingFinalizar = $state(false);
  let loading = $state(true);

  const carrinhoController = new CarrinhoController(domainManager.lojaId!);
  const uuid = storageService.getStoredData("uuid-carrinho");

  async function listar() {
    if (!uuid) return;
    const [r, e] = await carrinhoController.listar(uuid);
    carrinho = r;
  }
  async function listarLogado() {
    const [r, e] = await carrinhoController.listarLogado();
    carrinho = r;
    console.log(r)
  }
  async function mount() {
    const url = page.url.pathname === "/finalizar-compra";
    if (storageService.getStoredData("astronfy-token")) {
      await listarLogado();
    } else {
      await listar();
    }
    if (!carrinho && url) {
      goto("/");
    }
    loading = false;
  }

  async function finalizar() {
    if (!storageService.getStoredData("astronfy-token")) {
      goto("/login?redirect=/carrinho");
      return;
    }

    if(carrinhoData.cupomAplicado ){
      const categoria = carrinhoData.cupomAplicado.categoria

      //Somar gastos por categoria do cupom e ver se é aplicavel
      const gastosCategoria = carrinho!.data.itens.map((obj)=>{
        if(obj.produto){
          if(obj.produto.categoria.nome===categoria.nome){
            return obj.produto.preco * obj.quantidade
          }
        }
        else{
          if(obj.variacaoProduto.produto.categoria.nome===categoria.nome){
            return obj.variacaoProduto.preco * obj.quantidade
          }
        }
      })

      const gastoTotal = gastosCategoria.reduce((prev,current)=> current = prev as number + (current as number));
      
      if(!gastoTotal || gastoTotal<carrinhoData.cupomAplicado.gastoMinimo){

        sinalizador.sendMeGenericModal({
          label:"Não podemos proceder com sua compra",
          desc: `O cupom "${carrinhoData.cupomAplicado.nome}" que você está utilizando necessita de um gasto mínimo de 
          ${sanitizar.centavosToReais(carrinhoData.cupomAplicado.gastoMinimo)} na categoria ${carrinhoData.cupomAplicado.categoria.nome}`,
          btnLabel:"Ok, eu compreendo!",
          icon: SvgSad
        })
        return
      }

    }
    goto("/finalizar-compra");
  }

  let descontoTotal = $derived.by(()=>{
    if(!carrinhoData.cupomAplicado || !carrinho) return null
    const desconto = carrinhoData.cupomAplicado.valorDesconto;
    let limite = carrinhoData.cupomAplicado.limiteDesconto
    const tipo = carrinhoData.cupomAplicado.tipoDesconto;
    const categoria = carrinhoData.cupomAplicado.categoria.nome

    const tmp = carrinho.data.itens.map((obj)=>{
      const isVariacao = obj.produto ? false : true
      const produto = obj.produto ? obj.produto : obj.variacaoProduto
      const categoriaP = isVariacao ? obj.variacaoProduto.produto.categoria.nome : obj.produto.categoria.nome

      //valor produto - valor descontado, sendo sempre maior que 1
      if(categoria === categoriaP){
        if(tipo==="fixo"){
          const tmp =  (produto.preco*obj.quantidade)
          let descontado = tmp - desconto
          descontado = descontado>1 ? descontado : 1
          return tmp - descontado
        }
        else{
          const total = produto.preco*obj.quantidade
          let tmp = (total *desconto)/100
          tmp = tmp > 1 ? tmp : 1
          const final = total - tmp

          if(final>limite){
            return limite
          }
          else{
            return total - final
          }
        }
      }
    })

    const total = tmp.reduce((prev,current)=>current = prev! + current!) 
    return total  
  })


  $effect(() => {
    if (sinalizador.signal.tipo === "reloadCarrinho") {
      untrack(mount);
    }
    if (compra) {
      carrinho = {
        message: "",
        statusCode: 200,
        data: {
          itens: compra.itens,
          totalItens: compra.itens.length,
          valorTotal: compra.preco,
          id: 0,
          uuid: "",
          status: compra.status,
          lojaId: compra.lojaId,
          clienteId: compra.clienteId,
          criadoEm: compra.criadoEm,
          atualizadoEm: compra.atualizadoEm,
        },
      };
      loading = false;
    }
  });

  onMount(() => {
    const pedido = storageService.getStoredData("id-pedido-pendente");
    if (!pedido) return mount();
  });
</script>

<BubbleWrapper
  {loading}
  cssLoading="w-[440px] h-[375px]"
  css="px-0 flex flex-col gap-1 w-[440px] overflow-auto"
>
  <h3 class="text-[18px] px-4">
    {modo === "edicao" ? "Resumo da compra" : "Informações da compra"}
  </h3>
  <div class="w-full h-[1px] bg-soft-200 my-2"></div>
  <div class="flex flex-col gap-3 px-4">
    {@render ResumoItem(
      "Quantidade de itens",
      carrinho ? `x${carrinho.data.totalItens}` : "0"
    )}
    <div class="w-full h-[1px] border-soft-200 border-dashed border-t"></div>
    {@render ResumoItem(
      "Subtotal",
      carrinho
        ? `R$${sanitizar.centavosToReais(carrinho.data.valorTotal)}`
        : "0"
    )}
    {#if !compra}
      <div class="w-full h-[1px] border-soft-200 border-dashed border-t"></div>
      {@render ResumoItem("Cupom de desconto", "", gerenciaCupons)}
    {/if}
    <div class="w-full h-[1px] border-soft-200 border-dashed border-t"></div>
    {@render ResumoItem(
      "Desconto aplicado",
      compra
        ? `<span class='text-success-base'>
            R$${compra.desconto ? sanitizar.centavosToReais(compra.desconto.toString()) : "0,00"}
        </span>`
        : `<span class='text-success-base'>
            R$${descontoTotal ? sanitizar.centavosToReais(descontoTotal) : "0,00"}
        </span>`
    )}
  </div>
  <div
    class="flex items-center justify-between w-full px-4 mt-3 border-t {modo ===
      'edicao' && page.url.pathname === '/carrinho'
      ? 'border-b mb-3 py-3'
      : 'pt-3'} border-sub-300 mt-1"
  >
    <span class="text-[18px] text-sub-600 font-normal"> Total </span>
    <span class="text-[18px] text-strong-950 font-medium">
      {#if true}
      {@const valor = carrinho!.data.valorTotal - (descontoTotal ? descontoTotal : 0)}
      { (carrinho
        ? `R$${ valor > 0 ? sanitizar.centavosToReais(valor) : sanitizar.centavosToReais(0)}`
        : "0") 
        
      }
      {/if}
    </span>
  </div>
  {#if modo === "edicao" && page.url.pathname === "/carrinho"}
    <div class="grid h-[40px] px-4">
      <Botao
        loading={loadingFinalizar}
        disabled={!carrinho || carrinho.data.totalItens === 0}
        tema="green"
        onClick={finalizar}
      >
        <SvgCart
          props={{
            class: "fill-white",
          }}
        />
        Ir para pagamento
      </Botao>
    </div>
  {/if}
</BubbleWrapper>

{#snippet gerenciaCupons()}
  <Cupom modo={page.url.pathname==="/finalizar-compra" ? "visualizacao" : "edicao"} />
{/snippet}

{#snippet ResumoItem(label: string, value: string, Snip?: Snippet)}
  <div
    class="flex items-center justify-between text-strong-950 text-[14px] font-medium"
  >
    <span class="text-sub-600 text-[14px] font-normal">
      {label}
    </span>
    {#if value}
      {@html value}
    {/if}

    {#if Snip}
      <Snip />
    {/if}
  </div>
{/snippet}
