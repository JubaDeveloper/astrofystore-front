<script lang="ts">
  import SvgEnter from "$components/assets/svg/SvgEnter.svelte";
  import SvgX from "$components/assets/svg/SvgX.svelte";
  import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import ModalGenericAlert from "$components/sections/generic-modals/ModalGenericAlert.svelte";
  import { EstoqueController } from "$lib/api/modules/lojas/estoque/estoque.controller";
  import { EstoqueItemController } from "$lib/api/modules/lojas/estoque/item/estoque.item.controller";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import { slide } from "svelte/transition";

  interface Props {
    tags: {
      value: string;
      selected: boolean;
      id?: number;
    }[];
    idEstoque?: number;
  }

  let { tags = $bindable([]), idEstoque }: Props = $props();

  let value = $state<string>("");

  let open = $state(false);
  let loadingDelete = $state(false);

  let modoEdicao = $derived.by(() => {
    const selecionados = tags.filter((obj) => obj.selected);
    if (selecionados.length === 1) {
      return true;
    }
    return false;
  });

  const add = () => {
    const novasTags = format(value);
    const adicionar = novasTags.filter(
      (obj) => !tags.some((obj2) => obj2.value === obj.value)
    );
    for (let i = 0; i < adicionar.length; i++) {
      if (idEstoque && idEstoque > 0) {
        const estoqueItens = new EstoqueItemController(
          idEstoque,
          parseInt($idLoja)
        );
        estoqueItens.criar({ conteudo: adicionar[i].value });
      }
    }
    tags = [...tags, ...adicionar];
    value = "";
  };

  const editar = () => {
    const selecionados = tags.filter((obj) => obj.selected);
    selecionados[0].value = value;
    if (selecionados[0].id && idEstoque && idEstoque > 0) {
      const estoqueItens = new EstoqueItemController(
        idEstoque,
        parseInt($idLoja)
      );
      estoqueItens.editar(selecionados[0].id, {
        conteudo: selecionados[0].value,
      });
    }
    setTimeout(() => {
      tags.forEach((obj) => {
        obj.selected = false;
      });
      value = "";
    }, 100);
  };

  const format = (s: string): { value: string; selected: boolean }[] => {
    return [
      ...new Set(
        s
          .split(/[,;\n]/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
      ),
    ].map((obj) => ({
      value: obj,
      selected: false,
    }));
  };

  const remover = () => {
    const selecionados = tags.filter((obj) => obj.selected);
    selecionados.forEach((obj) => {
      if (obj.id && idEstoque && idEstoque > 0) {
        const estoqueItens = new EstoqueItemController(
          idEstoque,
          parseInt($idLoja)
        );
        estoqueItens.deletar(obj.id);
      }
    });
    if (selecionados.length === 0) {
      tags = [];
    } else {
      tags = tags.filter((obj) => !obj.selected);
    }
    open = false;
  };
</script>

<InputWrapper
  label="Itens de Estoque"
  mandatory={true}
  extraTip="Adicione um item por linha. Cada um será uma unidade no seu estoque."
  subLabel={`(${tags.length})`}
  value=""
  rightSide={deleteBtn}
>
  <div
    class="flex items-center justify-between px-3 pr-2 overflow-hidden apply-class-focus rounded-[8px] grow-0 h-[38px]"
  >
    <textarea
      bind:value
      onkeydown={(e) => {
        if (e.key === "Enter" && !modoEdicao) {
          e.preventDefault();
          add();
        }
        if (e.key === "Enter" && modoEdicao) {
          e.preventDefault();
          editar();
        }
      }}
      class="w-full outline-none h-[30px] pt-[4px] overflow-y-auto border-none text-[14px]"
      placeholder="Digite..."
    ></textarea>
    <button class="shrink-0 p-1" onclick={add}>
      <SvgEnter />
    </button>
  </div>
  <div class="flex flex-wrap items-center gap-y-1">
    {#each tags as tag, i (tag.value)}
      {@const selecionados = tags.filter((obj) => obj.selected)}
      <div class="relative flex items-center" transition:slide={{ axis: "x" }}>
        <button
          onclick={() => {
            tag.selected = !tag.selected;
            if (selecionados.length === 1) {
              value = selecionados[0].value;
            } else {
              value = "";
            }
          }}
          data-selected={tag.selected ? true : null}
          class="flex whitespace-nowrap
                hover:bg-soft-200 data-[selected]:border-sub-600 data-[selected]:bg-soft-200 data-selected:text-strong-950
                overflow-hidden mr-2 text-[12px] items-center gap-1 border border-soft-200 pl-2 py-1 leading-5 pr-6 rounded-md text-sub-600"
        >
          {tag.value}
        </button>
        <button
          class="p-1 z-[2] group absolute right-3"
          onclick={() => {
            tags.forEach((obj) => (obj.selected = false));
            tag.selected = true;
            open = true;
          }}
        >
          <SvgX
            props={{
              class: "fill-sub-600 group-hover:fill-error-base",
            }}
          />
        </button>
      </div>
    {/each}
  </div>
</InputWrapper>

{#snippet deleteBtn()}
  {@const selecionados = tags.filter((obj) => obj.selected)}
  <button
    class="text-[12px] text-error-base underline"
    onclick={() => {
      if (selecionados.length === 0) {
        tags.forEach((obj) => (obj.selected = true));
      }
      open = true;
    }}
  >
    {#if selecionados.length === 0}
      Limpar estoque
    {:else}
      Remover {selecionados.length} itens
    {/if}
  </button>
{/snippet}

<ModalGenericAlert
  cancel={() => tags.forEach((obj) => (obj.selected = false))}
  loading={loadingDelete}
  action={remover}
  btnLabel="Excluir Permanentemente"
  label="Atenção! Essa ação é irreversível"
  sublabel={`Você perderá permanentemente às informações cadastradas. <br/> <span class='text-error-base'>${tags.filter((obj) => obj.selected).length} item(s) selecionado.</span>`}
  bind:open
/>

<style>
  ::-webkit-resizer {
    opacity: 0;
    pointer-events: none;
  }
</style>
