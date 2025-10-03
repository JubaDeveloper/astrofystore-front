<script lang="ts">
  import { goto } from "$app/navigation";
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import Check from "$components/assets/checkboxs/Check.svelte";
  import DropBlock from "$components/assets/logic/DropBlock.svelte";
  import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
  import PopUp from "$components/assets/modals/PopUp.svelte";
  import SvgAlerta from "$components/assets/svg/SvgAlerta.svelte";
  import SvgPlus from "$components/assets/svg/SvgPlus.svelte";
  import SvgThreeDots from "$components/assets/svg/SvgThreeDots.svelte";
  import LoaderSmooth from "$components/elements/loading/LoaderSmooth.svelte";
  import PaginacaoCompleta from "$components/elements/pagination/PaginacaoCompleta.svelte";
  import { EstoqueController } from "$lib/api/modules/lojas/estoque/estoque.controller";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import { untrack } from "svelte";
  import BadgeEmojiEstroque from "../loja/estoque/BadgeEmojiEstroque.svelte";
  import BotaoDeslizante from "$components/assets/buttons/BotaoDeslizante.svelte";
  import Pesquisa from "$components/elements/search/Pesquisa.svelte";
  import SvgLixeira from "$components/assets/svg/SvgLixeira.svelte";
  import ModalGenericAlert from "../generic-modals/ModalGenericAlert.svelte";

  type ProdutoEstoque = {
    id: number;
    tipoEstoque: "mensagem" | string;
    tipoProduto: "produto" | string;
    mensagem: string;
    totalItensDisponíveis: number;
    produto: {
      nome: string;
      id: number;
    };
    variacaoProdutoId: number | null;
    precoProduto: number | null;
    descontoProduto: number | null;
    lojaId: number;
    criadoEm: string; // ou `Date` se for convertido
    atualizadoEm: string; // ou `Date` se for convertido
    variacaoProduto: any;
    selected: boolean;
  };

  interface Props {
    activeTab: number;
  }

  const headers = [
    { label: "Item", colSpan: "col-span-8" },
    { label: "Estoque", colSpan: "col-span-3" },
    { label: "Produto Associado", colSpan: "col-span-6" },
  ];

  let tabsMenus = [
    { label: "Produtos", value: 0 },
    { label: "Estoque", value: 1 },
  ];

  let { activeTab = $bindable() }: Props = $props();

  let filtros = $state({
    pesquisa: "",
  });

  let estoque = $state<ProdutoEstoque[]>([]);

  let openDropDown = $state<boolean[]>([]);

  let openModalDeletar = $state<boolean>(false);

  let loading = $state(false);
  let loadingDelete = $state(false);

  let paginacao = $state({
    pagina: 1,
    qtdPaginas: 10,
    totalPaginas: 1,
  });

  let estoquesSelecionados = $derived.by(() => {
    return estoque.filter((obj) => obj.selected);
  });

  async function excluir() {
    estoquesSelecionados.forEach((obj) => {
      // const estoqueController = new EstoqueController(parseInt($idLoja),obj.produtoId)
      // const [r,e] = await estoqueController.deletar(idEstoque)
      // return [r,e]
    });
    estoque = estoque.filter(
      (item) =>
        !estoquesSelecionados.some((selecionado) => selecionado.id === item.id)
    );
    openModalDeletar = false;
  }

  async function listarEstoque() {
    const estoqueController = new EstoqueController(parseInt($idLoja), -1);
    loading = true;
    const [r, e] = await estoqueController.listarLoja({
      pagina: paginacao.pagina,
      quantidade: paginacao.qtdPaginas,
      termo: filtros.pesquisa,
    });
    loading = false;
    if (e) {
      return;
    }
    estoque = r.data.resultado;
    paginacao.totalPaginas = Math.ceil(r.data.total / paginacao.qtdPaginas);
  }

  $effect(() => {
    if (filtros) {
      listarEstoque();
    }
  });

  $effect(() => {
    if (filtros.pesquisa.length >= 0) {
      paginacao.pagina = 1;
    }
  });
</script>

<div class="flex flex-col gap-8 h-full">
  {@render header()}
  {@render filtrosSec()}
  <div
    class="flex flex-col justify-between gap-2 w-full h-full overflow-hidden"
  >
    {#if !loading}
      {#if estoque.length === 0}
        {@render zerado("Não foi possivel encontrar este estoque")}
      {:else}
        <div class="flex flex-col overflow-y-auto grow">
          {@render tabela()}
        </div>
        <PaginacaoCompleta
          bind:pagina={paginacao.pagina}
          onSelecionarPagina={listarEstoque}
          bind:qtdPaginas={paginacao.qtdPaginas}
          totalPaginas={paginacao.totalPaginas}
        />
      {/if}
    {:else}
      <div class="flex w-full grow justify-center items-center">
        <LoaderSmooth tamanho="w-8" cor="black" />
      </div>
    {/if}
  </div>
</div>

{#snippet tabela()}
  <div
    class="w-full px-3 py-[6px] text-[14px] font-light rounded-[8px] bg-weak-50 text-sub-600 grid grid-cols-18 gap-8"
  >
    {#each headers as h, i}
      <div class="flex items-center gap-2 {h.colSpan}">
        {#if i === 0}
          {@const allMarked = estoque.every((obj) => obj.selected)}
          <button
            onclick={() => {
              estoque = estoque.map((obj) => {
                return {
                  ...obj,
                  selected: allMarked ? false : true, //Se todos foram marcado, desmarca todos
                };
              });
            }}
          >
            <Check checked={allMarked} />
          </button>
        {/if}
        <p class="text-sub-600 text-14 font-normal">{h.label}</p>
      </div>
    {/each}
  </div>
  {#each estoque as item, i}
    <div
      class="w-full py-2 px-3 gap-8 items-center grid grid-cols-18 text-sub-600 text-[14px] rounded-[8px]"
    >
      <div class="flex gap-2 items-center {headers[0].colSpan}">
        <button onclick={() => (item.selected = !item.selected)}>
          <Check checked={item.selected ?? false} />
        </button>
        <Avatar
          rounded="rounded-[4px]"
          src=""
          size="w-[40px]"
          name={item.produto.nome}
        />
        <span class="flex flex-col">
          <p class="text-14 font-medium text-strong-950">
            {item.produto.nome}
          </p>
          <p class="text-12 font-medium text-sub-600">
            R$ {item.precoProduto
              ? (item.precoProduto / 100).toFixed(2)
              : "0,00"}
          </p>
        </span>
      </div>
      <div class="flex gap-2 {headers[1].colSpan}">
        <BadgeEmojiEstroque qtd={item.totalItensDisponíveis} />
      </div>
      <div class="flex gap-2 {headers[2].colSpan}">
        <div
          class="flex items-center gap-1 text-12 text-sub-600 font-medium border border-soft-200 py-1 px-2 rounded-[6px]"
        >
          {item.produto.nome}
        </div>
      </div>
      <div class="flex gap-2 col-span-1">
        <button
          class="flex-col py-2 px-2 hover:bg-weak-50 flex items-center justify-center text-center rounded-md"
          onclick={() => (openDropDown[i] = true)}
        >
          <SvgThreeDots />
        </button>
        <FocusBlock bind:isFocus={openDropDown[i]} className="relative">
          <DropBlock
            isDrop={openDropDown[i]}
            className="absolute top-0 right-12"
          >
            {@render dropDown(
              () => goto(`/loja/${$idLoja}/edicao-estoque/${item.produto.id}`),
              () => {
                estoque.forEach((obj) => (obj.selected = false));
                item.selected = true;
                openModalDeletar = true;
              }
            )}
          </DropBlock>
        </FocusBlock>
      </div>
    </div>
  {/each}
{/snippet}
{#snippet dropDown(onAtualizar: VoidFunction, onExcluir: VoidFunction)}
  {@const actions = [
    { label: "Atualizar estoque", action: onAtualizar },
    { label: "Excluir", action: onExcluir },
  ]}

  <div
    class="p-2 w-40 bg-white-0 rounded-2xl shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.10)] outline outline-offset-[-1px] outline-soft-200 inline-flex flex-col justify-start items-start gap-1 overflow-hidden"
  >
    {#each actions as ac}
      <button
        onclick={ac.action}
        class="self-stretch p-2 bg-white-0 hover:bg-weak-50 rounded-lg inline-flex justify-start items-center gap-2 overflow-hidden"
      >
        <div class="flex justify-start items-center gap-1">
          <div
            class="justify-start {ac.label === 'Excluir'
              ? 'text-error-base'
              : 'text-strong-950'} text-sm font-normal leading-tight"
          >
            {ac.label}
          </div>
        </div>
      </button>
    {/each}
  </div>
{/snippet}

<ModalGenericAlert
  btnLabel="Continuar e excluir"
  label={estoquesSelecionados.length > 1
    ? "Você tem certeza que deseja deletar estes estoques?"
    : `Tem certeza que deseja deletar o estoque de "${estoquesSelecionados[0] ? estoquesSelecionados[0].produto.nome : "null"}"`}
  sublabel={estoquesSelecionados.length > 1
    ? "Você está prestes a excluir permanentemente este estoque, deseja continuar?"
    : "Você está prestes a excluir multiplos estoques. Deseja continuar com a ação?"}
  action={excluir}
  loading={loadingDelete}
  cancel={() => {
    estoque.forEach((obj) => (obj.selected = false));
    openModalDeletar = false;
  }}
  bind:open={openModalDeletar}
/>

{#snippet zerado(label: string)}
  <div class="flex flex-col gap-4 justify-center items-center">
    <div class="flex flex-col items-center justify-center">
      <img
        class="max-w-[500px]"
        src="/images/anxious-face.png"
        alt="anxious-face"
      />
      <div class="flex flex-col gap-1">
        <p class="text-20 font-medium text-strong-950">{label}</p>
        <p class="text-14 font-medium text-sub-600">
          Crie produtos na sua loja para disponibiliza-los para venda.
        </p>
      </div>
    </div>
    <div class="grid h-[40px] w-[150px]">
      <Botao
        tema={"primary"}
        onClick={() => goto(`/loja/${$idLoja}/cadastro-produto`)}
      >
        <SvgPlus
          props={{
            class: "fill-white-0",
          }}
        />
        Produtos
      </Botao>
    </div>
  </div>
{/snippet}

{#snippet header()}
  <div class="border-b border-soft-200 pb-5 flex items-center justify-between">
    <div class="flex flex-col">
      <span class="text-[18px] font-medium"> Produtos </span>
      <p class="text-[14px] text-sub-600">Visualize os produtos da sua loja</p>
    </div>
    <div class="grid h-[40px]">
      <Botao
        tema={"primary"}
        onClick={() => goto(`/loja/${$idLoja}/cadastro-produto`)}
      >
        <SvgPlus props={{ class: "fill-white-0" }} />
        Produtos
      </Botao>
    </div>
  </div>
{/snippet}

{#snippet filtrosSec()}
  <div class="flex w-full justify-between items-center">
    <BotaoDeslizante
      opcoes={tabsMenus}
      bind:value={activeTab}
      onChange={() => {
        filtros.pesquisa = "";
      }}
    />
    <span class="flex gap-4 justify-end items-center w-1/2">
      {#if estoquesSelecionados.length > 0}
        <div class="grid h-[40px]">
          <Botao
            tema={"red"}
            onClick={() => {
              openModalDeletar = true;
            }}
          >
            Excluir <SvgLixeira />
          </Botao>
        </div>
      {:else}
        <Pesquisa
          onSearch={() => {}}
          placeholder={"Pesquiser por estoque"}
          bind:value={filtros.pesquisa}
        />
      {/if}
    </span>
  </div>
{/snippet}
