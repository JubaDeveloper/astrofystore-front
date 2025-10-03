<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import BotaoDeslizante from "$components/assets/buttons/BotaoDeslizante.svelte";
  import Check from "$components/assets/checkboxs/Check.svelte";
  import DropBlock from "$components/assets/logic/DropBlock.svelte";
  import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
  import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
  import SvgLixeira from "$components/assets/svg/SvgLixeira.svelte";
  import SvgPlus from "$components/assets/svg/SvgPlus.svelte";
  import SvgThreeDots from "$components/assets/svg/SvgThreeDots.svelte";
  import CardStatus from "$components/elements/card/CardStatus.svelte";
  import LoaderSmooth from "$components/elements/loading/LoaderSmooth.svelte";
  import PaginacaoCompleta from "$components/elements/pagination/PaginacaoCompleta.svelte";
  import Pesquisa from "$components/elements/search/Pesquisa.svelte";
  import TabelaEstoque from "$components/sections/estoque/TabelaEstoque.svelte";
  import ModalGenericAlert from "$components/sections/generic-modals/ModalGenericAlert.svelte";
  import categoriaController from "$lib/api/modules/categoria/categoria.controller";
  import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
  import type {
    Produto,
    ProdutosForm,
  } from "$lib/api/modules/produto/produto.dto.svelte";
  import { ProdutoUtils } from "$lib/api/modules/produto/produto.utils";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import toast from "$lib/utils/toast.svelte";
  import type { Option } from "$lib/utils/types";
  import { onMount } from "svelte";

  const produtoController = new ProdutoController();
  const produtoUtils = new ProdutoUtils();

  let tabsMenus = [
    { label: "Produtos", value: 0 },
    { label: "Estoque", value: 1 },
  ];
  let openDropDown = $state<boolean[]>([]);
  let produtos = $state<Produto[]>([]);
  let openModalDeletar = $state<boolean>(false);
  let categorias = $state<Option[]>([]);
  let loading = $state(false);
  let loadingDelete = $state(false);
  let activeTab = $state(0);

  let paginacao = $state({
    pagina: 1,
    qtdPaginas: 10,
    totalPaginas: 1,
  });
  let filtros = $state({
    pesquisa: "",
    categoriaId: "",
  });
  let produtosSelecionados = $derived.by(() => {
    return produtos.filter((obj) => obj.selected);
  });

  function getType(produto: Produto) {
    if (produto.variacoes.length > 0)
      return produto.variacoes.length + " variações";
    if (produto.estoque && produto.estoque.tipoProduto === "simples")
      return "Único";
    return "Sem estoque atribuído";
  }

  async function excluir() {
    produtosSelecionados.forEach(async (obj) => {
      const produtoController = new ProdutoController();
      const [r, e] = await produtoController.deletar(parseInt($idLoja), obj.id);
    });
    produtos = produtos.filter(
      (item) =>
        !produtosSelecionados.some((selecionado) => selecionado.id === item.id)
    );
    openModalDeletar = false;
  }

  async function listar() {
    loading = true;
    const [res, err] = await produtoController.listarProdutos(
      parseInt(page.params.id),
      {
        ...filtros,
        pagina: paginacao.pagina,
        quantidade: paginacao.qtdPaginas,
      }
    );
    loading = false;
    if (err) return toast.error("Mensagem do sistema.", err.message);
    const tmp = res.data.resultado;
    await Promise.all(
      tmp.map(async (obj: Produto) => {
        const [tmpImagens, e] = await produtoController.listarImagens(obj.id);
        if (!e) {
          obj.imagensId = tmpImagens.imagens;
        }
      })
    );
    produtos = tmp;
    paginacao.totalPaginas = res.data.totalPaginas;
  }

  async function buscarCategorias() {
    const [res, err] = await categoriaController.listar(
      parseInt(page.params.id),
      {}
    );
    if (err) return toast.error("Mensagem do sistema.", err.message);
    const received = res.resultado;
    categorias = received.map((obj: any) => {
      return { label: obj.nome, value: obj.id };
    });
  }

  $effect(() => {
    if (filtros) {
      listar();
    }
  });

  onMount(() => {
    listar();
    buscarCategorias();
  });
</script>

<div class="flex flex-col gap-8 h-full">
  {#if activeTab == 1}
    <TabelaEstoque bind:activeTab />
  {/if}

  {#if activeTab == 0}
    {@render header()}
    {@render filtrosSec()}
    {#if produtos.length === 0}
      {@render zerado("Produtos não encontrados")}
    {:else}
      <div
        class="flex flex-col justify-between gap-2 w-full h-full overflow-hidden"
      >
        {#if !loading}
          <div class="flex flex-col overflow-y-auto grow">
            {@render tabelaLojas()}
          </div>
          <PaginacaoCompleta
            bind:pagina={paginacao.pagina}
            onSelecionarPagina={() => ""}
            bind:qtdPaginas={paginacao.qtdPaginas}
            totalPaginas={paginacao.totalPaginas}
          />
        {:else}
          <div class="flex w-full grow justify-center items-center">
            <LoaderSmooth tamanho="w-8" cor="black" />
          </div>
        {/if}
      </div>
    {/if}
  {/if}
</div>

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
      {#if produtosSelecionados.length > 0}
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
          onSearch={listar}
          placeholder={activeTab === 0
            ? "Pesquisar por produto"
            : "Pesquiser por estoque"}
          bind:value={filtros.pesquisa}
        />
        {#if activeTab === 0}
          <div class="grid h-[43px] min-w-[200px]">
            <SelectBlock
              bind:options={categorias}
              bind:value={filtros.categoriaId}
              placeholder="Categoria"
              dropCss="absolute top-[120%] right-0 w-[300px] max-h-[200px] rounded-lg overflow-y-auto bg-transparent border border-[rgba(0,0,0,.05)] 
                    dark:border-none outline-none shadow-lg dark:shadow-none flex flex-col gap-1 p-2"
            />
          </div>
        {/if}
      {/if}
    </span>
  </div>
{/snippet}

{#snippet tabelaLojas()}
  {@const headers = produtoUtils.headersProdutos}
  <div class="flex flex-col gap-2 pb-5 w-full">
    <div
      class="w-full px-3 py-[6px] text-[14px] font-light rounded-[8px] bg-weak-50 text-sub-600 grid grid-cols-18 gap-8"
    >
      {#each headers as h, i}
        <div class="flex items-center gap-2 {h.colSpan}">
          {#if i === 0}
            {@const allMarked = produtos.every((obj) => obj.selected)}
            <button
              onclick={() => {
                produtos = produtos.map((obj) => {
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
    {#each produtos as produto, i}
      {@const categoria = produto.categoria}
      <div
        class="w-full py-2 px-3 gap-8 items-center grid grid-cols-18 text-sub-600 text-[14px] rounded-[8px]"
      >
        <div class="flex gap-2 items-center {headers[0].colSpan}">
          <button onclick={() => (produto.selected = !produto.selected)}>
            <Check checked={produto.selected ?? false} />
          </button>
          <Avatar
            src={produto.imagensId && produto.imagensId[0]
              ? produtoController.pegarImagem(
                  produto.id,
                  produto.imagensId[0].id
                )
              : ""}
            size="w-[40px]"
            name={produto.nome}
          />
          <span class="flex flex-col">
            <p class="text-14 font-medium text-strong-950">
              {produto.nome}
            </p>
            <p class="text-12 font-medium text-sub-600">
              {getType(produto)}
            </p>
          </span>
        </div>
        <div class="flex flex-col {headers[1].colSpan}">
          <b class="font-medium text-strong-950">0 und.</b>
          <p class="text-12 font-normal text-sub-600">
            {"R$ " + (produto.preco / 100).toFixed(2)}
          </p>
        </div>
        <div class="flex gap-2 {headers[2].colSpan}">
          {categoria ? categoria.nome : "Sem categoria"}
        </div>
        <div class="flex gap-2 {headers[3].colSpan}">
          <CardStatus status={produto.ativo ? "Ativo" : "Inativo"}>
            <div
              class="m-1 flex-shrink-0 h-1.5 w-1.5 rounded-full {produto.ativo
                ? 'bg-green-500'
                : 'bg-red-500'}"
            ></div>
          </CardStatus>
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
              {@render dropDown(i, () => goto(`edicao-produto/${produto.id}`))}
            </DropBlock>
          </FocusBlock>
        </div>
      </div>
    {/each}
  </div>
{/snippet}

{#snippet dropDown(index: number, onEditar: VoidFunction)}
  {@const actions = [
    { label: "Editar", action: onEditar },
    {
      label: "Atualizar estoque",
      action: () =>
        goto(`/loja/${$idLoja}/edicao-estoque/${produtos[index].id}`),
    },
    {
      label: "Excluir",
      action: () => {
        openModalDeletar = true;
      },
    },
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
  label={produtosSelecionados.length > 1
    ? "Tem certeza que deseja deletar os itens da loja?"
    : `Tem certeza que deseja deletar o Item da Loja?`}
  sublabel={produtosSelecionados.length > 1
    ? "Você está prestes a excluir permanentemente este produto, deseja continuar?"
    : "Você está prestes a excluir multiplos produtos. Deseja continuar com a ação?"}
  action={excluir}
  loading={loadingDelete}
  cancel={() => {
    produtos.forEach((obj) => (obj.selected = false));
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
