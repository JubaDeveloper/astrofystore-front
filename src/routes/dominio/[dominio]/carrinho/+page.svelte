<script lang="ts">
  import { goto } from "$app/navigation";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import LoaderMinhoca from "$components/assets/loading/LoaderMinhoca.svelte";
  import LoaderMinhocaExpend from "$components/assets/loading/LoaderMinhocaExpend.svelte";
  import DropBlock from "$components/assets/logic/DropBlock.svelte";
  import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
  import SvgCart from "$components/assets/svg/SvgCart.svelte";
  import LoaderSmooth from "$components/elements/loading/LoaderSmooth.svelte";
  import BubbleWrapper from "$components/elements/wrappers/BubbleWrapper.svelte";
  import Cupom from "$components/sections/dominio/Cupom.svelte";
  import DetalhesCompra from "$components/sections/dominio/DetalhesCompra.svelte";
  import ItemCarrinho from "$components/sections/dominio/ItemCarrinho.svelte";
  import { CarrinhoController } from "$lib/api/modules/carrinho/carrinho.controller";
  import carrinhoData from "$lib/api/modules/carrinho/carrinho.data.svelte";
  import type { CarrinhoResponseDto } from "$lib/api/modules/carrinho/carrinho.dto";
  import domainManager from "$lib/settings/domain.svelte";
  import storageService from "$lib/utils/storageService";
  import { type Snippet } from "svelte";

  const carrinhoController = new CarrinhoController(domainManager.lojaId!);

  let carrinho = $state<CarrinhoResponseDto>();
  let loading = $state(true);

  async function deletarItemCarrinho(i: number) {
    carrinho!.data.itens = carrinho!.data.itens.filter(
      (obj, index) => index !== i
    );
    if (carrinho!.data.itens.length === 0) {
      carrinho = undefined;
      storageService.clearData("uuid-carrinho");
    }
  }

  async function listar() {
    const uuid = storageService.getStoredData("uuid-carrinho");
    if (!uuid) return;
    const [r, e] = await carrinhoController.listar(uuid);
    carrinho = r;
  }

  async function listarLogado() {
    const [r, e] = await carrinhoController.listarLogado();
    carrinho = r;
  }

  async function mount() {
    storageService.clearData("id-pedido-pendente");
    if (storageService.getStoredData("astronfy-token")) {
      await listarLogado();
    } else {
      await listar();
    }
    loading = false;
  }

  mount();
</script>

<div
  class="flex content-start items-start grow justify-between w-full p-4 gap-4"
>
  {#if loading}
    <LoaderMinhocaExpend label="Carregando" />
  {:else if !carrinho}
    <div class="flex flex-col w-full items-center justify-center mt-4 absolute">
      <h5 class="font-semibold">O seu carrinho está vazio.</h5>
      <span class="text-sub-600 text-[14px]">
        Deseja olhar outros produtos?
      </span>
      <div class="grid h-[48px] mt-2 w-[300px]">
        <Botao tema="primary" onClick={() => goto("/")}>
          <SvgCart
            props={{
              fill: "white",
              class: "w-5 h-5",
            }}
          />
          <span class="text-[20px]"> Continuar comprando </span>
        </Botao>
      </div>
    </div>
  {:else if carrinho}
    <BubbleWrapper css="px-0 flex flex-col gap-3 w-[880px] grow">
      <h3 class="text-[18px] px-4">Carrinho de produtos</h3>
      <div class="w-full h-[1px] bg-soft-200"></div>
      {#if loading}
        <div class="w-full h-30 flex items-center justify-center">
          <LoaderSmooth tamanho="w-8" />
        </div>
      {/if}
      <div class="flex flex-col gap-4 px-4 w-full">
        {#each carrinho.data.itens as item, i}
          <ItemCarrinho
            uuid={carrinho.data.uuid}
            onExcluir={() => deletarItemCarrinho(i)}
            bind:item={carrinho.data.itens[i]}
          />
          {#if i !== 3 && i !== carrinho.data.itens.length - 1}
            <div
              class="w-full h-[1px] border-t-2 border-soft-200 border-dashed"
            ></div>
          {/if}
        {/each}
      </div>
    </BubbleWrapper>
    <DetalhesCompra compra={null} modo="edicao" />
  {/if}
</div>
