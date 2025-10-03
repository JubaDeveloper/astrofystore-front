<script lang="ts">
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import SidePop from "$components/assets/modals/SidePop.svelte";
  import SvgCart from "$components/assets/svg/SvgCart.svelte";
  import SvgTrash from "$components/assets/svg/SvgTrash.svelte";
  import SvgX from "$components/assets/svg/SvgX.svelte";

  import { CarrinhoController } from "$lib/api/modules/carrinho/carrinho.controller";
  import domainManager from "$lib/settings/domain.svelte";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import storageService from "$lib/utils/storageService";
  import toast from "$lib/utils/toast.svelte";
  import type { ItemCarrinhoDto } from "$lib/api/modules/carrinho/carrinho.dto";
  import { encurtarTexto } from "$lib/utils/utils.svelte";
  import { tooltip } from "$lib/actions/title.svelte";
  import Trash from "$components/assets/anim/Trash.svelte";

  const carrinhoController = new CarrinhoController(domainManager.lojaId!);
  
  
  let token = storageService.getStoredData("astronfy-token");

  interface Props {
    open: boolean;
  }

  let uuid = $state<string>("");
  let itensCarrinho = $state<ItemCarrinhoDto[]>([]);
  let { open = $bindable() }: Props = $props();
  let loading = $state<boolean>(true);
  let totalValor = $state(0);

  async function buscarCarrinho() {
    let res, err;
    token = storageService.getStoredData("astronfy-token");
    if (token) {
      [res, err] = await carrinhoController.listarLogado();
    } else {
      [res, err] = await carrinhoController.listar(
        storageService.getStoredData("uuid-carrinho")
      );
    }
    console.log(res,err)
    if (
      err &&
      (err.message === "Carrinho não encontrado" ||
        err.message === "Este cliente não possui um carrinho ativo.")
    ) {
      totalValor = 0;
      itensCarrinho = [];
      uuid = "";
      loading = false;
      storageService.clearData("uuid-carrinho");
      return;
    }
    if (err) return;
    totalValor = res.data.valorTotal;
    itensCarrinho = res.data.itens;
    uuid = res.data.uuid;
    loading = false;
  }
  async function deletarItemCarrinho(itemId: number) {
    const [_, err] = await carrinhoController.removerItem(uuid, itemId);
    if (err)
      return toast.error("Erro ao deletar item do carrinho", err.message);
    buscarCarrinho();
  }
  async function limparCarrinho() {
    const [_, err] = await carrinhoController.limpar(uuid);
    if (err)
      return toast.error("Erro ao deletar item do carrinho", err.message);
    itensCarrinho = [];
    totalValor = 0;
    uuid = "";
    storageService.clearData("uuid-carrinho");
  }

  $effect(() => {
    if (open) {
      buscarCarrinho();
    }
  });

  onMount(() => {
    uuid = storageService.getStoredData("uuid-carrinho") ?? "";
  });
</script>

<SidePop bind:open curved={true}>
  <div class="flex items-center justify-between px-4 w-full">
    <div class="flex flex-col">
      <span class="text-[18px]">Meu carrinho</span>
      <span class="text-[14px] text-sub-600"
        >{itensCarrinho.length} Produto(s)</span
      >
    </div>
    <button class="p-1" onclick={() => (open = false)}>
      <SvgX
        props={{
          class: "fill-sub-600 w-3 h-3",
        }}
      />
    </button>
  </div>
  {#if !loading && itensCarrinho.length > 0}
    <div class="flex flex-col w-full grow overflow-y-auto gap-y-4 px-4 mt-3">
      {#each itensCarrinho as { quantidade, produto, variacaoProduto, variado, id }, i}
        {@const itemAtual = variacaoProduto ? variacaoProduto : produto}
        {@render Item(itemAtual.nome, variado, quantidade, itemAtual.preco, id)}
        {#if i !== 3}
          <div
            class="w-full h-[1px] border-t-3 border-soft-200 border-dashed"
          ></div>
        {/if}
      {/each}
    </div>

    <div class="flex flex-col w-full">
      <div
        class="flex items-center justify-between w-full px-4 border-t border-b border-sub-300 mb-3 py-3"
      >
        <span class="text-[14px] text-sub-600 font-normal"> Subtotal </span>
        <span class="text-[14px] text-strong-950 font-medium">
          R$ {(totalValor / 100).toFixed(2).replace(".", ",")}
        </span>
      </div>

      <div class="grid grid-cols-2 h-[40px] gap-x-3 w-full px-3">
        <Botao tema="red-transparent-inverted" onClick={limparCarrinho}>
          Esvaziar carrinho
        </Botao>
        <Botao
          tema="green"
          onClick={() => {
            open = false;
            goto("/carrinho");
          }}
        >
          <SvgCart
            props={{
              class: "fill-white",
            }}
          />
          Finalizar compra
        </Botao>
      </div>
    </div>
  {/if}
</SidePop>

{#snippet Item(
  nome: string,
  variado: boolean,
  quantidade: number,
  preco: number,
  itemId: number
)}
  <div
    class="self-stretch h-14 inline-flex justify-between w-full items-center gap-4"
  >
    <div class="flex items-center gap-4">
      <Avatar src="" name={nome} rounded="rounded-lg" size="w-[56px]" />
      <div class="flex-1 inline-flex flex-col justify-center items-start">
        <div
          class="self-stretch h-6 inline-flex justify-start items-center gap-1"
        >
          <div
            class="justify-center text-strong-950 text-base font-medium leading-normal"
            use:tooltip={{ text: nome, posTriangulo: "bottom-middle" }}
          >
            {encurtarTexto(nome, 29)}
          </div>
          <!-- {#if variado}
            <div
              class="justify-center text-sub-600 text-sm font-normal leading-tight"
            >
              (1 assento | 1 mês)
            </div>
          {/if} -->
        </div>
        <div class="self-stretch inline-flex justify-start items-end gap-1">
          <div
            class="justify-center text-strong-950 text-lg font-medium leading-normal"
          >
            R$ {(preco / 100).toFixed(2).replace(".", ",")}
          </div>
          <div class="pb-[5px] flex justify-center items-center gap-2.5">
            <div
              class="justify-center text-sub-600 text-xs font-medium uppercase leading-3 tracking-tight"
            >
              (x{quantidade} und)
            </div>
          </div>
        </div>
      </div>
    </div>
    <Trash onClick={() => deletarItemCarrinho(itemId)} />
  </div>
{/snippet}
