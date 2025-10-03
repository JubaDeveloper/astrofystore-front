<script lang="ts">
  import Trash from "$components/assets/anim/Trash.svelte";
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Badge from "$components/assets/badge/Badge.svelte";
  import Number from "$components/assets/input/Number.svelte";
  import SvgCupom from "$components/assets/svg/SvgCupom.svelte";
  import SvgTrash from "$components/assets/svg/SvgTrash.svelte";
  import avatarController from "$lib/api/modules/avatar/avatar.controller";
  import { CarrinhoController } from "$lib/api/modules/carrinho/carrinho.controller";
  import carrinhoData from "$lib/api/modules/carrinho/carrinho.data.svelte";
  import type {
    ItemCarrinhoDto,
    ItemCarrinhoPutDto,
  } from "$lib/api/modules/carrinho/carrinho.dto";
  import { LojaPublicaController } from "$lib/api/modules/loja-publica/loja.publica.controller";
  import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
  import { ProdutoVariacaoController } from "$lib/api/modules/produto/variacao/produto.variacao.controller";
  import sanitizar from "$lib/sanitizers/sanitizer";
  import domainManager from "$lib/settings/domain.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
  import storageService from "$lib/utils/storageService";
  import { onMount } from "svelte";

  interface Props {
    item: ItemCarrinhoDto;
    onExcluir: VoidFunction;
    uuid: string;
  }

  let { item = $bindable(), onExcluir, uuid }: Props = $props();

  const token = storageService.getStoredData("astronfy-token");
  const carrinhoController = new CarrinhoController(domainManager.lojaId!);
  const produtoController = new ProdutoController();
  const produtoVariadoController = new ProdutoVariacaoController(1,domainManager.lojaId!);
  let avatarImagem = $state("");

  async function changeQtd(novo: number, old: number) {
    if (novo > old) {
      const body: ItemCarrinhoPutDto = {
        quantidade: 1,
      };
      if(item.variado){
        delete body.produtoId
        body.variacaoProdutoId = item.variacaoProdutoId
      }
      else{
        body.produtoId = item.produtoId
      }
      if (uuid && !token) {
        body.uuid = uuid;
      }
      const [r, e] = await carrinhoController.adicionarItem(body);
      if (e) {
        item.quantidade = old;
      }
    } else if (novo < old) {
      const [r, e] = await carrinhoController.decrementarItem(uuid, item.id);
    }
    sinalizador.sendSignal("reloadCarrinho");
  }
  async function excluir() {
    carrinhoController.removerItem(uuid, item.id);
    onExcluir();
  }
  function reais(v: string) {
    return v.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  onMount(() => {
    if(item.variado){
      produtoVariadoController.listarImagens(item.variacaoProdutoId).then((result) => {
      if(result[1] || !result[0].data.imagem) return
      const imagem = result[0].data.imagem;
        avatarImagem = imagem.url;
    });

    }
    else{
      produtoController.listarImagens(item.produtoId).then((result) => {
      if(result[1]) return
      const lista = result[0];

      if (lista.imagens.length > 0) {
        avatarImagem = lista.imagens[0].url;
      }
    });

    }
  });

  let descontoAplicado = $derived.by(()=>{
    if(!carrinhoData.cupomAplicado) return null
    let desconto = carrinhoData.cupomAplicado.valorDesconto;
    const tipo = carrinhoData.cupomAplicado.tipoDesconto;
    const isVariacao = item.produto ? false : true
    const produto = item.produto ? item.produto : item.variacaoProduto
    const categoriaP = isVariacao ? item.variacaoProduto.produto.categoria.nome : item.produto.categoria.nome

    if(carrinhoData.cupomAplicado.categoria.nome === categoriaP){
      if(tipo==="fixo"){
        let tmp =  (produto.preco*item.quantidade) - desconto
        tmp = tmp > 1 ? tmp : 1
        return tmp
      }
      else{
        const total = produto.preco*item.quantidade
        let tmp = (total *desconto)/100
        tmp = tmp > 1 ? tmp : 1
        const final = total - tmp
        if(final>carrinhoData.cupomAplicado.limiteDesconto){
          return total - carrinhoData.cupomAplicado.limiteDesconto
        }
        else{
          return final
        }
      }
    }
  })
</script>

{#if true}
  {@const produto = item.produto ? item.produto : item.variacaoProduto}
  <div class="grid grid-cols-8 gap-4 w-full">
    <div class="flex col-span-4 items-center gap-4">
      <Avatar
        src={avatarImagem}
        name={produto.nome}
        rounded="rounded-lg"
        size="w-[48px] shrink-0"
      />
      <div class="flex flex-col justify-center items-start">
        <div
          class="justify-center text-strong-950 text-base font-medium whitespace-normal leading-normal"
        >
          {produto.nome}
        </div>
      </div>
    </div>
    <div class="w-[160px] flex items-center col-span-2 shrink-0">
      <Number
        buttonsOnly={true}
        label=""
        bind:value={item.quantidade}
        limit={999}
        min={1}
        onChange={changeQtd}
      />
    </div>
    <div class="flex flex-col col-span-1 {descontoAplicado ? "items-start" : "items-end justify-center"} gap-0.5">
      {#if descontoAplicado}
      {@const porcentagem = 100 - ((descontoAplicado*100)/(item.quantidade*produto.preco))  }
        <div class="flex items-center gap-2">
          <div class="text-[11px] text-faded-base">
            R${ sanitizar.centavosToReais((item.quantidade * produto.preco))}
          </div>
          <Badge
            tema="success-lighter"
            css="h-[16px] w-[56px] text-[11px] rounded-lg"
          >
            <SvgCupom
              padrao={1}
              props={{
                class: "fill-success-base h-2.5",
              }}
            />
            -{porcentagem.toFixed(0)}%
          </Badge>
        </div>
      {/if}

      {@render formatarValor()}
    </div>
    <div class="col-span-1 flex items-center justify-end">
      <Trash onClick={excluir} />
    </div>
  </div>
{/if}
{#snippet formatarValor()}
  {@const produto = item.produto ? item.produto : item.variacaoProduto}
  {@const valor = descontoAplicado ? sanitizar.centavosToReais(descontoAplicado) : ((item.quantidade * produto.preco) / 100).toFixed(2)}
  <span
    class="text-[24px] font-normal flex gap-0.5 whitespace-nowrap leading-6 items-start"
  > 

    R$ {reais(valor.split(".")[0])}
    <span class="text-[11px] self-start leading-4 font">
      {valor.split(".")[1]}
    </span>
  </span>
{/snippet}
