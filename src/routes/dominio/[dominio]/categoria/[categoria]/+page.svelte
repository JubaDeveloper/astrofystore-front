<script lang="ts">
  import CardProduto from "$components/sections/produtos/CardProduto.svelte";
  import RatingStars from "$components/elements/rating/RatingStars.svelte";
  import Paginacao from "$components/elements/pagination/Paginacao.svelte";
  import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
  import RatioList from "$components/elements/ratio/RatioList.svelte";
  import Pesquisa from "$components/elements/search/Pesquisa.svelte";
  import SvgFilter from "$components/assets/svg/SvgFilter.svelte";
  import SvgTrash from "$components/assets/svg/SvgTrash.svelte";
  import Slider from "$components/assets/slider/Slider.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import domainManager from "$lib/settings/domain.svelte";
  import toast from "$lib/utils/toast.svelte";

  import { LojaPublicaController } from "$lib/api/modules/loja-publica/loja.publica.controller";
  import type { ProdutoDetalhado } from "$lib/api/modules/produto/produto.dto.svelte";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import type { FiltrosLojaPublica } from "$lib/api/modules/loja-publica/loja.publica.dto";
  import LoaderMinhocaExpend from "$components/assets/loading/LoaderMinhocaExpend.svelte";
  import sanitizar from "$lib/sanitizers/sanitizer";

  const lojaPublicaController = new LojaPublicaController();

  const valorMaximo = 400000  

  let produtos = $state<ProdutoDetalhado[]>([]);
  let itensPorPagina = $state(10);
  let totalPaginas = $state(2);
  let idCategoria = $state(0);
  let dominio = $state("");
  let banner = $state("");

  let filtros = $state<FiltrosLojaPublica>({
    valorMaximo: valorMaximo,
    avaliacaoMinima: 0,
    pesquisa: "",
    pagina: 1,
  });
  let loading = $state(false);

  function limparFiltros() {
    filtros = {
      valorMaximo: valorMaximo/50,
      avaliacaoMinima: 0,
      pesquisa: "",
      pagina: 1,
    };
    pegarProdutosCategoria();
  }


  async function pegarProdutosCategoria() {
    loading = true;

    const valorConvertido = Math.trunc(
      ((filtros.valorMaximo as number) * valorMaximo) / 100
    );

    const querys: FiltrosLojaPublica = {
      valorMaximo: valorConvertido.toString(),
      avaliacaoMinima: filtros.avaliacaoMinima!.toString(),
      pesquisa: filtros.pesquisa,
      categoriaId: idCategoria.toString(),
      pagina: filtros.pagina,
      ordenacao: filtros.ordenacao,
    };
    const [res, err] = await lojaPublicaController.listarProdutos(
      dominio,
      querys
    );
    if (err) return toast.error("Mensagem do sistema.", err.message);
    produtos = res.data.resultado;
    loading = false;
    totalPaginas = Math.round(res.data.total / res.data.quantidade);
  }
  async function pegarBanner() {
    const [res, err] = await lojaPublicaController.listarBanners(dominio);
    if (err) return toast.error("Mensagem do sistema.", err.message);
    const bannerCategoria = res.data.filter(
      (banner: any) =>
        !banner.uri.includes("/produto/") &&
        banner.uri.includes(`categoria/${idCategoria}`)
    );
    if (bannerCategoria[0]) banner = bannerCategoria[0].url;
  }

  onMount(() => {
    const categoriaFiltrada = domainManager.lojainfo?.categorias.find(
      (cat: any) => cat.nome.trim() === page.params.categoria
    );
    dominio = domainManager.ultimoDominioAcessado!;
    idCategoria = categoriaFiltrada.id;
    pegarProdutosCategoria();
    pegarBanner();
  });
</script>

<div class="flex flex-col gap-6 px-6 py-6 grow">
  <div
    class="{banner
      ? 'bg-black'
      : 'bg-primary-base'} w-full h-[140px] border border-soft-200 rounded-[12px] flex items-center justify-center relative overflow-hidden"
  >
    <span class="text-white-0 text-[40px] font-semibold z-[1]">
      {page.params.categoria}
    </span>
    <div class=" absolute w-full h-full left-0 opacity-50">
      {#if banner}
        <img src={banner} class="w-full h-full object-cover" alt="" />
      {:else}
        <div class="absolute inset-0 z-0  overflow-hidden">
          <div
            class="w-[200%] h-[200%] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-[spin_10s_linear_infinite] rounded-full blur-2xl opacity-40"
          ></div>
        </div>
      {/if}
    </div>
  </div>

  <div class="flex gap-4 w-full">
    <div
      class="bg-white-0 w-[330px] shrink-0 border border-soft-200 p-3 px-4 rounded-[8px] flex flex-col h-[410px] gap-4"
    >
      {@render filtrosSnippet()}
    </div>
    <div class="flex flex-col gap-2 grow border-soft-200 rounded-[8px]">
      {@render filtrosCima()}
      {#if loading}
        <div class="grow">
          <LoaderMinhocaExpend label="Procurando produtos" />
        </div>
      {:else if produtos.length > 0}
        <div class="flex flex-col justify-between grow">
          {@render listagem()}
          <div class="self-center">
            <Paginacao
              bind:pagina={filtros.pagina!}
              bind:totalPaginas
              onSelecionarPagina={pegarProdutosCategoria}
            />
          </div>
        </div>
      {:else}
        <span
          class="flex flex-col gap-2 items-center justify-center w-full text-center font-medium text-[20px] text-sub-950"
        >
          <img src="/images/anxious-face.png" alt="" />
          Nenhum produto encontrado
        </span>
      {/if}
    </div>
  </div>
</div>

{#snippet filtrosCima()}
  <div class="flex items-center gap-3 w-full">
    <div class="grow flex flex-col">
      <Pesquisa
        maxWidth=""
        placeholder="Pesquisar produto dentro da categoria"
        onSearch={() => {}}
        bind:value={filtros.pesquisa!}
      />
    </div>
    <div class="w-[150px]">
      <SelectBlock
        options={[
          {
            label: "Descrescente",
            value: "desc",
          },
          {
            label: "Crescente",
            value: "asc",
          },
        ]}
        bind:value={filtros.ordenacao}
        placeholder="Ordenar por"
      />
    </div>
  </div>
{/snippet}

{#snippet listagem()}
  <div class="flex flex-wrap gap-6">
    {#each produtos as p, i}
      <!-- <div class="grid grid-cols-3 gap-6"> -->
      <CardProduto produto={p} />
      <!-- </div> -->
    {/each}
  </div>
{/snippet}

{#snippet filtrosSnippet()}
  <div class="flex items-center w-full justify-between">
    <div class="flex items-center gap-2">
      <SvgFilter />
      Filtros
    </div>
    <Botao tema="gray-transparent" onClick={limparFiltros}>
      <SvgTrash />
      Limpar
    </Botao>
  </div>

  <div class="w-full h-[1px] bg-soft-200"></div>

  <div class="flex flex-col">
    <Slider
      {valorMaximo}
      labelDireita="R$ 0,00"
      labelEsquerda={`R$ ${sanitizar.centavosToReais(valorMaximo as number)}`}
      bind:value={filtros.valorMaximo as number}
      limit={100}
    />
  </div>

  <div class="w-full h-[1px] border-t border-soft-200 border-dashed"></div>

  <div class="flex flex-col gap-2">
    <b>Disponibilidade</b>
    <RatioList
      options={[
        {
          label: "Todos",
          value: "todos",
        },
        {
          label: "Apenas disponiveis",
          value: "apenas",
        },
      ]}
      value={"todos"}
    />
  </div>

  <div class="w-full h-[1px] border-t border-soft-200 border-dashed"></div>
  <div class="flex flex-col gap-2">
    <b>Avaliação mínima</b>
    <div class="flex items-center gap-2 text-[14px]">
      <RatingStars bind:rating={filtros.avaliacaoMinima as number} />
      ou +
    </div>
  </div>
  <div class="grid h-[40px]">
    <Botao tema="primary" onClick={pegarProdutosCategoria}>Aplicar filtro</Botao
    >
  </div>
{/snippet}
