<script lang="ts">
  import RatingStars from "$components/elements/rating/RatingStars.svelte";
  import PopAvaliar from "$components/assets/modals/PopAvaliar.svelte";
  import SvgXModal from "$components/assets/svg/SvgXModal.svelte";
  import SidePop from "$components/assets/modals/SidePop.svelte";
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import SvgCart from "$components/assets/svg/SvgCart.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import Number from "$components/assets/input/Number.svelte";
  import domainManager from "$lib/settings/domain.svelte";
  import storageService from "$lib/utils/storageService";
  import SvgX from "$components/assets/svg/SvgX.svelte";
  import toast from "$lib/utils/toast.svelte";

  import { LojaPublicaController } from "$lib/api/modules/loja-publica/loja.publica.controller";
  import { CarrinhoController } from "$lib/api/modules/carrinho/carrinho.controller";
  import type { ItemCarrinhoPutDto } from "$lib/api/modules/carrinho/carrinho.dto";
  import { encurtarTexto, formatarPreco } from "$lib/utils/utils.svelte";
  import type {
    ProdutoDetalhado,
    variacao,
  } from "$lib/api/modules/produto/produto.dto.svelte";
  import { fade, fly } from "svelte/transition";
  import { onMount } from "svelte";
  import SvgCheckMin from "$components/assets/svg/SvgCheckMin.svelte";
  import SideAvaliarProduto from "../avaliacao/SideAvaliarProduto.svelte";
  import sinalizador from "$lib/utils/signal.svelte";

  type Body = {
    nota: number;
    comentario: string;
  };

  interface Props {
    produto: ProdutoDetalhado;
  }

  const { produto }: Props = $props();

  let atributosSelecionados = $state<Map<number, number>>(new Map());
  let lojaId: number | undefined = $state(domainManager.lojaId);
  let produtoController = new LojaPublicaController();
  let selectedPrice = $state<number | null>(null);
  let pegarVariacoes: boolean = $state(true);
  let versionar: boolean = $state(false);
  let quantidade = $state<number>(1);
  let open: boolean = $state(false);

  let recemAdicionado = $state(false);
  let processandoAdicao = $state(false);
  let min = $state(0);
  let max = $state(0);

  const carrinhoController = new CarrinhoController(domainManager.lojaId!);

  let body: Body = $state({
    nota: 1,
    comentario: "",
  });

  function selecionarValorAtributo(atributoIndex: number, valorId: number) {
    const nomeDoAtributo = produto.atributos[atributoIndex]?.nome;
    const selecionandoOutros = nomeDoAtributo === "Outros";
    const indexOutros = produto.atributos.findIndex(
      (attr) => attr.nome === "Outros"
    );
    const outrosSelecionado = atributosSelecionados.has(indexOutros);

    if (selecionandoOutros) {
      atributosSelecionados.clear();
      atributosSelecionados.set(atributoIndex, valorId);
    } else {
      if (outrosSelecionado) {
        atributosSelecionados.delete(indexOutros);
      }
      if (
        atributosSelecionados.has(atributoIndex) &&
        atributosSelecionados.get(atributoIndex) === valorId
      ) {
        atributosSelecionados.delete(atributoIndex);
      } else {
        atributosSelecionados.set(atributoIndex, valorId);
      }
    }
    atributosSelecionados = new Map(atributosSelecionados);
    atualizarPrecoSelecionado();
  }

  function pegarProdutosSemAtributos(variacoes: variacao[]) {
    let variacaoSemAtributos: variacao[] = [];
    variacoes.forEach((v) => {
      if (v.valorAtributoProduto.length === 0) variacaoSemAtributos.push(v);
    });

    const totalEstoque = variacaoSemAtributos.reduce(
      (sum, v) => sum + (v.estoque?.quantidade || 0),
      0
    );

    const variacoesFormatadas: {
      id: number;
      nome: string;
      valores: { id: number; valor: string }[];
      estoque: { quantidade: number };
    } = {
      id: 0,
      nome: "Outros",
      valores: variacaoSemAtributos.map((v) => ({ id: v.id, valor: v.nome })),
      estoque: { quantidade: totalEstoque },
    };

    if (
      variacoesFormatadas.valores.length > 0 &&
      !produto.atributos.find((item) => item.nome === "Outros")
    ) {
      produto.atributos = [...produto.atributos, variacoesFormatadas];
    }
  }

  function estaOpcaoDesabilitada(
    atributoIndex: number,
    valorId: number
  ): boolean {
    if (!produto.variacoes || produto.variacoes.length === 0) {
      return (produto.estoque?.quantidade ?? 0) === 0;
    }

    const isOutrosAttribute =
      produto.atributos[atributoIndex]?.nome === "Outros";

    // VERIFICA SE "OUTROS" ESTÁ SELECIONADO ATUALMENTE
    const indexOutros = produto.atributos.findIndex(
      (attr) => attr.nome === "Outros"
    );
    const outrosSelecionado = atributosSelecionados.has(indexOutros);

    // SE "OUTROS" ESTÁ SELECIONADO, e NÃO estou renderizando "Outros", NUNCA desabilita
    if (outrosSelecionado && atributoIndex !== indexOutros) {
      return false; // sempre habilitado
    }

    const hasStock = produto.variacoes.some((variacao) => {
      const isOutrosVariation = variacao.valorAtributoProduto.length === 0;
      const stock = variacao.estoque?.quantidade ?? 0;

      if (isOutrosVariation) {
        return isOutrosAttribute && valorId === variacao.id && stock > 0;
      }

      const matchesCurrent = variacao.valorAtributoProduto.some(
        (v) => v.id === valorId
      );

      if (!matchesCurrent) return false;

      for (const [index, selectedId] of atributosSelecionados.entries()) {
        // Pula o atributo que estamos testando agora
        if (index === atributoIndex) continue;

        // Se estou em uma variação "normal" e algum outro atributo não bate, descarta
        if (!variacao.valorAtributoProduto.some((v) => v.id === selectedId)) {
          return false;
        }
      }

      return stock > 0;
    });

    return !hasStock;
  }

  function pegarIntervaloValores(variacoes: variacao[]) {
    variacoes.forEach((v) => {
      if (v.preco! < min || min === 0) min = v.preco ?? min;
      if (v.preco! > max) max = v.preco ?? max;
    });
  }

  function atualizarPrecoSelecionado() {
    if (!produto.variacoes || produto.variacoes.length === 0) {
      selectedPrice = produto.preco;
      return;
    }

    const selectedVariation = produto.variacoes.find((variacao) => {
      const valorIdsDaVariacao = variacao.valorAtributoProduto.map((v) => v.id);
      const isOutros = variacao.valorAtributoProduto.length === 0;

      if (isOutros) {
        const outrosIndex = produto.atributos.findIndex(
          (attr) => attr.nome === "Outros"
        );
        return (
          atributosSelecionados.size === 1 &&
          atributosSelecionados.has(outrosIndex) &&
          atributosSelecionados.get(outrosIndex) === variacao.id
        );
      }

      if (
        atributosSelecionados.size !==
        produto.atributos.length -
          (produto.atributos.some((attr) => attr.nome === "Outros") ? 1 : 0)
      ) {
        return false;
      }

      return Array.from(atributosSelecionados.values()).every((id) =>
        valorIdsDaVariacao.includes(id)
      );
    });

    selectedPrice = selectedVariation ? selectedVariation.preco : null;
  }

  async function adicionarCarrinho() {
    if (quantidade < 1) {
      return;
    }
    processandoAdicao = true;
    const body: ItemCarrinhoPutDto = {
      produtoId: produto.id,
      variacaoProdutoId: selecionarIdVariacao(),
      quantidade: quantidade,
    };
    const uuid = storageService.getStoredData("uuid-carrinho");
    const token = storageService.getStoredData("astronfy-token");
    if (uuid && !token) {
      body.uuid = uuid;
    }

    const [r, e] = await carrinhoController.adicionarItem(body);
    if (e) {
      processandoAdicao = false;

      return toast.error(
        "Não foi possivel adicionar este item ao carrinho",
        e.message
      );
    }
    recemAdicionado = true;
    sinalizador.sendSignal("novoItemCarrinho");
    setTimeout(() => {
      recemAdicionado = false;
      processandoAdicao = false;
    }, 1000);
    if (!token) storageService.storeData("uuid-carrinho", r.data.uuid);
  }

  function selecionarIdVariacao(): number | undefined {
    if (!produto.variacoes || produto.variacoes.length === 0) return undefined;

    const selectedVariation = produto.variacoes.find((variacao) => {
      const valorIdsDaVariacao = variacao.valorAtributoProduto.map((v) => v.id);
      const isOutros = variacao.valorAtributoProduto.length === 0;

      if (isOutros) {
        const outrosIndex = produto.atributos.findIndex(
          (attr) => attr.nome === "Outros"
        );
        return (
          atributosSelecionados.size === 1 &&
          atributosSelecionados.has(outrosIndex) &&
          atributosSelecionados.get(outrosIndex) === variacao.id
        );
      }

      if (
        atributosSelecionados.size !==
        produto.atributos.length -
          (produto.atributos.some((attr) => attr.nome === "Outros") ? 1 : 0)
      ) {
        return false;
      }

      return Array.from(atributosSelecionados.values()).every((id) =>
        valorIdsDaVariacao.includes(id)
      );
    });

    return selectedVariation?.id;
  }

  async function listarAvaliacoes() {
    const [res, err] = await produtoController.listarAvaliacoes(
      lojaId,
      produto.id
    );
    if (err) return toast.error("Mensagem do sistema", err.message);
  }

  $effect(() => {
    if (produto.variacoes && produto.variacoes.length > 0 && pegarVariacoes) {
      pegarVariacoes = false;
      pegarIntervaloValores(produto.variacoes);
      pegarProdutosSemAtributos(produto.variacoes);
      atualizarPrecoSelecionado();
    } else if (!produto.variacoes || produto.variacoes.length === 0) {
      selectedPrice = produto.preco;
    }
    atualizarPrecoSelecionado();
  });

  onMount(() => listarAvaliacoes());
</script>

<div class="flex flex-col gap-4 w-1/2">
  {@render detalhesDoProduto()}
  <div class="border-b border-soft-200 border-dashed"></div>
  {#if produto.variacoes && produto.variacoes.length > 0}
    {#each produto.atributos as { nome, valores }, i}
      <div class="flex flex-col items-start gap-3">
        <p class="text-16 text-strong-950 font-medium">{nome}</p>
        <div class="flex flex-wrap items-center gap-3">
          {#each valores as { valor, id }}
            <button
              onclick={() => selecionarValorAtributo(i, id)}
              class="border rounded-[6px] py-1 px-2 text-11 font-medium
                {atributosSelecionados.get(i) === id
                ? 'border-strong-950 text-strong-950'
                : 'border-soft-200 text-sub-600'} disabled:pointer-events-none disabled:opacity-50"
              disabled={estaOpcaoDesabilitada(i, id)}>{valor}</button
            >
          {/each}
        </div>
      </div>
    {/each}
  {/if}
  {@render compraProduto()}
</div>

{#snippet detalhesDoProduto()}
  <div class="flex flex-col gap-3">
    <div class="flex flex-col items-start gap-2">
      <span
        class="border border-soft-200 rounded-[6px] py-1 px-2 text-11 text-sub-600 font-medium"
      >
        {produto.categoria.nome}
      </span>
      <p class="text-24 font-medium text-strong-950">{produto.nome}</p>
      <button class="flex items-center gap-1.5" onclick={() => (open = true)}>
        <RatingStars rating={produto.mediaAvaliacao} enableRating={false} />
        <span class="text-11 text-sub-600 font-medium underline"
          >({produto.mediaAvaliacao.toFixed(1)}) {produto.quantidadeAvaliacoes} avaliações</span
        >
      </button>
    </div>
    <div class="flex flex-col items-start gap-1">
      <p class="text-14 text-sub-600 font-normal">
        {!versionar ? encurtarTexto(produto.descricao, 150) : produto.descricao}
      </p>
      {#if produto.descricao.length > 150}
        <button
          class="text-12 font-medium text-strong-950"
          onclick={() => (versionar = !versionar)}
        >
          {!versionar ? "VER MAIS" : "VER MENOS"}
        </button>
      {/if}
    </div>
    <p class="text-32 font-medium text-strong-950">
      {#if selectedPrice !== null}
        R$ {formatarPreco(selectedPrice)}
      {:else if produto.variacoes && produto.variacoes.length > 0}
        R$ {formatarPreco(min)} - {formatarPreco(max)}
      {:else}
        R$ {formatarPreco(produto.preco)}
      {/if}
    </p>
  </div>
{/snippet}

{#snippet compraProduto()}
  <div class="flex items-start gap-2">
    <div class="flex w-52">
      <Number
        validate={() => {
          if (quantidade < 1) {
            return "Minimo de 1 item";
          }
          return "";
        }}
        limit={produto.estoque ? (produto.estoque.quantidade ?? 10000) : 10000}
        bind:value={quantidade}
        min={1}
        label={""}
      />
    </div>
    <div class="grid grid-cols-1 h-[40px] mt-1 max-h-[40px] w-[200px]">
      <Botao
        disabled={recemAdicionado || processandoAdicao}
        tema={recemAdicionado ? "green" : "primary"}
        onClick={adicionarCarrinho}
      >
        {#if recemAdicionado}
          <div
            class="absolute flex items-center gap-2"
            transition:fly={{ y: 50 }}
          >
            Adicionado
            <SvgCheckMin
              props={{
                class: "fill-white-0 w-4 h-4",
              }}
            />
          </div>
        {:else}
          <div class="absolute flex gap-2" transition:fly={{ x: 200 }}>
            <SvgCart cor={"#FFFFFF"} />
            Adicionar ao carrinho
          </div>
        {/if}
      </Botao>
    </div>
  </div>
{/snippet}

{#if produto.id !== 0}
  <SideAvaliarProduto bind:open produtoId={produto.id} />
{/if}
