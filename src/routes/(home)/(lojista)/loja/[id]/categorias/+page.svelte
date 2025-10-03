<script lang="ts">
  import { page } from "$app/state";
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import Check from "$components/assets/checkboxs/Check.svelte";
  import Input from "$components/assets/input/Input.svelte";
  import DropBlock from "$components/assets/logic/DropBlock.svelte";
  import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
  import PopUp from "$components/assets/modals/PopUp.svelte";
  import SvgAlerta from "$components/assets/svg/SvgAlerta.svelte";
  import SvgCategoria from "$components/assets/svg/SvgCategoria.svelte";
  import SvgLixeira from "$components/assets/svg/SvgLixeira.svelte";
  import SvgOrdenaCategoria from "$components/assets/svg/SvgOrdenaCategoria.svelte";
  import SvgOrdenar from "$components/assets/svg/SvgOrdenar.svelte";
  import SvgPlus from "$components/assets/svg/SvgPlus.svelte";
  import SvgThreeDots from "$components/assets/svg/SvgThreeDots.svelte";
  import PaginacaoCompleta from "$components/elements/pagination/PaginacaoCompleta.svelte";
  import Pesquisa from "$components/elements/search/Pesquisa.svelte";
  import ModalCriarCategoria from "$components/sections/categorias/ModalCriarCategoria.svelte";
  import categoriaController from "$lib/api/modules/categoria/categoria.controller";
  import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
  import type { Categoria } from "$lib/api/modules/produto/produto.dto.svelte";
  import { ProdutoUtils } from "$lib/api/modules/produto/produto.utils";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import toast from "$lib/utils/toast.svelte";
  import { generateSlug } from "$lib/utils/utils.svelte";
  import { onMount } from "svelte";
  import { dndzone, type DndEvent } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import { fly, scale } from "svelte/transition";

  const produtoUtils = new ProdutoUtils();
  const produtoController = new ProdutoController();

  let openDropDown = $state<boolean[]>([]);
  let categorias = $state<Categoria[]>([]);
  let categoriaSelecionada = $state<Categoria>();
  let cadastrarCategoria: boolean = $state(false);
  let loading: boolean = $state(false);
  let openModalDeletar = $state<boolean[]>([]);
  let deleteUnico = $state<boolean>(false);
  let loadingDelete = $state(false);

  let form = $state({
    nome: "",
    slug: "",
  });

  let paginacao = $state({
    pagina: 1,
    qtdPaginas: 10,
    totalPaginas: 1,
  });

  let filtros = $state({
    pesquisa: "",
  });

  async function listar() {
    const [res, err] = await categoriaController.listar(
      parseInt(page.params.id),
      {
        ...filtros,
        pagina: paginacao.pagina,
        quantidade: paginacao.qtdPaginas,
      }
    );

    if (err) return toast.error("Mensagem do sistema.", err.message);

    categorias = res.resultado;
    paginacao.totalPaginas = res.totalPaginas;
  }

  async function deletarCategoria() {
    loadingDelete = true;
    categorias
      .filter((obj) => obj.selected)
      .forEach(async (obj, i) => {
        await categoriaController.deletar(parseInt($idLoja), obj.id);
        if (i == categorias.filter((obj) => obj.selected).length - 1) {
          listar();
          loadingDelete = false;
        }
      });
  }

  function handleDndConsider(e: CustomEvent<DndEvent<Categoria>>) {
    categorias = e.detail.items;
  }
  function handleDndFinalize(e: CustomEvent<DndEvent<Categoria>>) {
    categorias = e.detail.items;
    categorias.forEach(async (obj, i) => {
      const [r, e] = await categoriaController.ordenar(
        parseInt($idLoja),
        obj.id,
        i
      );
    });
  }

  $effect(() => {
    if (form.nome) form.slug = generateSlug(form.nome);
    if (filtros) listar();
  });

  onMount(() => {
    listar();
  });
</script>

<div class="flex flex-col gap-4 h-full">
  {@render header()}
  {@render filtrosSec()}
  {#if categorias.length < 1}
    <div class="flex flex-col gap-4 justify-center items-center">
      <div class="flex flex-col items-center justify-center text-center">
        <img
          class="max-w-[500px]"
          src="/images/anxious-face.png"
          alt="anxious-face"
        />
        <div class="flex flex-col gap-1">
          <p class="text-20 font-medium text-strong-950">
            Você ainda não tem categorias criadas
          </p>
          <p class="text-14 font-medium text-sub-600">
            Crie categorias na sua loja e adicione produtos para facilitar a
            navegação na sua loja.
          </p>
        </div>
      </div>
      <div class="grid h-[40px] w-[160px]">
        <Botao
          tema={"primary"}
          onClick={() => (cadastrarCategoria = !cadastrarCategoria)}
        >
          <SvgPlus props={{ class: "fill-white-0" }} />
          Criar Categoria
        </Botao>
      </div>
    </div>
  {:else}
    <div
      class="flex flex-col justify-between gap-2 w-full h-full overflow-hidden"
    >
      <div class="flex flex-col overflow-y-auto grow">
        {@render tabela()}
      </div>
      <PaginacaoCompleta
        bind:pagina={paginacao.pagina}
        onSelecionarPagina={() => ""}
        bind:qtdPaginas={paginacao.qtdPaginas}
        totalPaginas={paginacao.totalPaginas}
      />
    </div>
  {/if}

  <ModalCriarCategoria
    bind:categoria={categoriaSelecionada}
    bind:open={cadastrarCategoria}
    onSalvar={listar}
  />
</div>

{#snippet header()}
  <div class="border-b border-soft-200 pb-5 flex items-center justify-between">
    <div class="flex flex-col">
      <span class="text-[18px] font-medium"> Categorias </span>
      <p class="text-[14px] text-sub-600">
        Visualize as categorias da sua loja
      </p>
    </div>
    <div class="grid h-[40px]">
      <Botao
        tema={"primary"}
        onClick={() => (cadastrarCategoria = !cadastrarCategoria)}
      >
        <SvgPlus props={{ class: "fill-white-0" }} />
        Categoria
      </Botao>
    </div>
  </div>
{/snippet}

{#snippet filtrosSec()}
  <div class="flex w-full justify-between items-center">
    <Pesquisa
      onSearch={() => ""}
      placeholder="Procurar por categoria"
      bind:value={filtros.pesquisa}
    />
  </div>
{/snippet}

{#snippet tabela()}
  {@const headers = produtoUtils.headersCategorias}
  <div class="flex flex-col pb-5 w-full">
    <div
      class="w-full px-3 py-[6px] text-[14px] font-light rounded-[8px] bg-weak-50 text-sub-600 grid grid-cols-18 gap-8"
    >
      {#each headers as h, i}
        <div class="flex items-center gap-2 {h.colSpan}">
          <p class="text-sub-600 text-14 font-normal">{h.label}</p>
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col gap-2"
      use:dndzone={{
        items: categorias,
        flipDurationMs: 400,
      }}
      onconsider={handleDndConsider}
      onfinalize={handleDndFinalize}
    >
      {#each categorias as categoria, i (categoria.id)}
        <div
          class="w-full py-2 px-3 gap-8 items-center cursor-grab grid grid-cols-18 text-sub-600 text-[14px] border-b border-soft-200"
          animate:flip={{ duration: 400 }}
        >
          <div class="flex gap-2 items-center {headers[0].colSpan}">
            <SvgOrdenaCategoria />
            <p class="text-14 font-medium text-strong-950">
              {categoria.nome}
            </p>
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
                className="absolute bottom-0 right-12"
              >
                {@render dropDown(
                  () => {
                    deleteUnico = true;
                    openModalDeletar[i] = true;
                  },
                  () => {
                    categoriaSelecionada = categoria;
                    cadastrarCategoria = true;
                  }
                )}
              </DropBlock>
            </FocusBlock>
          </div>

          <PopUp
            bind:open={openModalDeletar[i]}
            withCloseButton={false}
            withDefaultPadding={false}
          >
            <div class="flex flex-col w-[440px]">
              <div class="flex gap-4 px-4 mt-4">
                <div
                  class="bg-error-light mt-1 shrink-0 rounded-md w-[40px] h-[40px] aspect-square flex items-center justify-center"
                >
                  <SvgAlerta
                    props={{
                      class: "fill-error-base w-[24px] h-[24px]",
                    }}
                  />
                </div>
                <div class="flex-col justify-start items-start gap-1.5">
                  <div
                    class="justify-start leading-5 text-[16px] text-strong-950 text-base font-medium"
                  >
                    Exclusão de categoria
                  </div>
                  <div
                    class="justify-start text-sub-600 text-[14px] text-sm font-light"
                  >
                    {#if deleteUnico}
                      Atenção! Ao excluir esta categoria, os produtos vinculados
                      ficarão sem categoria, a menos que estejam associados a
                      outra.
                    {:else}
                      Você está prestes a excluir multiplas categorias. Deseja
                      continuar com a ação?
                    {/if}
                  </div>
                </div>
              </div>
              <div class="w-[100%] left-[0] my-3 h-[1px] bg-soft-200"></div>
              <div class="grid grid-cols-2 mb-4 w-full h-[36px] gap-x-3 px-4">
                <Botao
                  tema="gray-transparent"
                  onClick={() => {
                    openModalDeletar[i] = false;
                  }}
                >
                  Cancelar
                </Botao>
                <Botao
                  tema="red"
                  onClick={async () => {
                    loadingDelete = true;
                    if (!deleteUnico) {
                      await deletarCategoria();
                      loadingDelete = false;
                      openModalDeletar[i] = false;
                      return;
                    }
                    await categoriaController.deletar(
                      parseInt($idLoja),
                      categoria.id
                    );
                    loadingDelete = false;
                    openModalDeletar[i] = false;
                    listar();
                  }}
                  loading={loadingDelete}
                >
                  Excluir definitivamente
                </Botao>
              </div>
            </div>
          </PopUp>
        </div>
      {/each}
    </div>
  </div>
{/snippet}

{#snippet dropDown(onExcluir: VoidFunction, onEditar: VoidFunction)}
  {@const actions = [
    { label: "Editar", action: onEditar },
    { label: "Excluir", action: onExcluir },
  ]}

  <div
    class="p-2 w-40 bg-white-0 rounded-2xl shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.10)] outline outline-offset-[-1px] outline-soft-200 inline-flex flex-col justify-start items-start gap-1 overflow-hidden"
  >
    {#each actions as ac}
      <button
        class="self-stretch p-2 bg-white-0 hover:bg-weak-50 rounded-lg inline-flex justify-start items-center gap-2 overflow-hidden"
        onclick={ac.action}
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
