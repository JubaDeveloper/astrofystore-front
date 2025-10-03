<script lang="ts">
  import RatioExpandedList from "$components/elements/ratio/RatioExpandedList.svelte";
  import PagamentoCartao from "$components/sections/pagamento/PagamentoCartao.svelte";
  import DetalhesCompra from "$components/sections/dominio/DetalhesCompra.svelte";
  import BubbleWrapper from "$components/elements/wrappers/BubbleWrapper.svelte";
  import carrinhoData from "$lib/api/modules/carrinho/carrinho.data.svelte";
  import QrCode from "$components/sections/pagamento/QRCode.svelte";
  import SvgCartao from "$components/assets/svg/SvgCartao.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import SvgPix from "$components/assets/svg/SvgPix.svelte";
  import domainManager from "$lib/settings/domain.svelte";
  import storageService from "$lib/utils/storageService";

  import { ComprasController } from "$lib/api/modules/pedido/compras/compras.controller";
  import { CarrinhoController } from "$lib/api/modules/carrinho/carrinho.controller";
  import pagamentoController from "$lib/api/modules/pagamento/pagamento.controller";
  import type { PedidoDto } from "$lib/api/modules/pedido/pedido.dto";
  import type {
    PagamentoBodyDto,
    PixDto,
  } from "$lib/api/modules/pagamento/pagamento.dto";
  import toast from "$lib/utils/toast.svelte";
  import { goto } from "$app/navigation";
  import { onDestroy, onMount } from "svelte";
  import Number from "$components/assets/input/Number.svelte";

  const carrinhoController = new CarrinhoController(domainManager.lojaId!);
  const compraControlller = new ComprasController(domainManager.lojaId!);
  const liberated = $state(false);

  let metodoEscolhido = $state<"pix" | "cartao" | undefined>();
  let tipo = $state<"cartao" | "pix">("cartao");
  let pedido = $state<PedidoDto | undefined>();
  let pix = $state<PixDto | undefined>();
  let tokenCartao = $state<string>("");
  let idPendente = $state<number>();
  let valor = $state<string>();
  let loading = $state(false);
  let compra = $state<any>();
  let formCartao = $state({
    numeroCartao: "",
    vencimento: "",
    titular: "",
    cvv: "",
  });

  async function selecionar() {
    loading = true;
    metodoEscolhido = tipo;
    if (!idPendente) await finalizarCarrinho();
    if (metodoEscolhido === "pix") await gerarPix();
    loading = false;
  }
  async function finalizarCarrinho() {
    const body = {
      cupom: carrinhoData.cupomAplicado
        ? carrinhoData.cupomAplicado.codigo
        : undefined,
      uuid: storageService.getStoredData("uuid-carrinho"),
    };
    if (!body.cupom) delete body.cupom;
    if (!body.uuid) {
      const [r, e] = await carrinhoController.listarLogado();
      body.uuid = r.data.uuid;
    }
    const [r, e] = await carrinhoController.finalizar(body);
    if (e) {
      toast.error("Erro inesperado ao finalizar o carrinho", e.message);
      goto("/carrinho");
      return;
    }
    pedido = r.data as PedidoDto;
  }
  async function gerarPix() {
    if(!pedido){
      toast.error("Erro inesperado ao finalizar o carrinho","");
      goto("/carrinho");
      return;
    }
    const [res, e] = await pagamentoController.processarPagamento(
      idPendente ? idPendente : pedido!.id,
      { metodo: "pix" }
    );
    if(e){
      toast.error("Erro inesperado ao finalizar o carrinho", e.message);
      goto("/carrinho");
      return;
    }
    pix = res.data as PixDto;
  }

  onMount(async () => {
    idPendente = storageService.getStoredData("id-pedido-pendente");
    if (!idPendente) return;
    const [res, err] = await compraControlller.pegar(idPendente);
    if (err) {
      toast.error("Mensagem do sistema", err.message);
      storageService.clearData("id-pedido-pendente");
      return goto("/minhas-compras");
    }
    compra = res.data;
    valor = (compra.preco / 100).toFixed(2);
  });
  onDestroy(() => {
    storageService.clearData("id-pedido-pendente");
  });
</script>

<div
  class="flex content-start items-start justify-center w-full p-4 gap-4 relative"
>
  <div class="relative w-[420px]">
    {#if metodoEscolhido}
      {@const isPix = metodoEscolhido === "pix"}
      <BubbleWrapper directionIn={-1} css="px-0 flex flex-col gap-3 w-[420px]">
        <h3 class="text-[18px] px-4">
          {#if isPix}
            Faça o pagamento via pix
          {:else}
            Faça o pagamento via cartão
          {/if}
        </h3>
        <div class="w-full h-[1px] bg-soft-200"></div>
        <div class="">
          {#if isPix}
            <QrCode {pedido} {pix} />
          {:else if formCartao}
            <PagamentoCartao bind:formCartao bind:valor bind:tokenCartao />
          {/if}
        </div>
      </BubbleWrapper>
    {:else}
      <BubbleWrapper css="px-0 flex flex-col gap-3 w-[420px] absolute">
        <h3 class="text-[18px] px-4">Escolha o método de pagamento</h3>
        <div class="w-full h-[1px] bg-soft-200"></div>
        <div class="px-4">
          <RatioExpandedList
            options={[
              {
                icon: SvgPix,
                label: "Pix",
                value: "pix",
              },
              {
                icon: SvgCartao,
                label: "Cartão de crédito",
                value: "cartao",
              },
            ]}
            bind:value={tipo}
          />
        </div>
        <div class="grid self-end w-full px-4 h-[40px]">
          <Botao tema="green" onClick={selecionar}>
            Prosseguir para o pagamento
          </Botao>
        </div>
      </BubbleWrapper>
    {/if}
  </div>
  <DetalhesCompra
    bind:compra
    modo={metodoEscolhido && idPendente ? "visualizacao" : "edicao"}
  />
</div>
