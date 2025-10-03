<script lang="ts">
  import { goto } from "$app/navigation";
  import FillText from "$components/assets/limiter/FillText.svelte";
  import Copy from "$components/assets/links/Copy.svelte";
  import LoaderMinhocaExpend from "$components/assets/loading/LoaderMinhocaExpend.svelte";
  import SvgPix from "$components/assets/svg/SvgPix.svelte";
  import type { PixDto } from "$lib/api/modules/pagamento/pagamento.dto";
  import { PedidoController } from "$lib/api/modules/pedido/pedido.controller";
  import type { PedidoDto } from "$lib/api/modules/pedido/pedido.dto";
  import { onDestroy } from "svelte";

  interface Props {
    pix: PixDto | undefined;
    pedido: PedidoDto | undefined;
  }

  let { pix, pedido }: Props = $props();

  const id = setInterval(mount, 2000);

  async function mount() {
    if (!pedido) return;
    const [r, e] = await new PedidoController().pegarPublico(pedido.id);
    if (e) {
      return;
    }
    pedido = r.data as PedidoDto;
    if (pedido?.status === "APROVADO") {
      goto("/concluido");
    }
  }

  onDestroy(() => clearInterval(id));
</script>

<div class="flex flex-col gap-4">
  <FillText texto="QR CODE" />
  {#if !pix}
    <LoaderMinhocaExpend label="Carregando QR CODE" />
  {:else}
    <div class="self-center">
      <img
        src={`data:image/png;base64,${pix.dados.qrCodeBase64}`}
        class="w-[240px] aspect-square"
        alt="QR Code"
      />
    </div>
    <FillText texto="COPIA E COLA" />
    <div class="flex flex-col px-4">
      <b class="text-[14px] font-medium">A câmera travando?</b>
      <p class="text-[12px] font-normal text-sub-600">
        Calma aí paizão! Copia o código aqui embaixo e cola no app do teu banco
        que vai funcionar do mesmo jeito 😉
      </p>
    </div>
    <div class="px-4">
      <Copy icon={SvgPix} text={pix.dados.qrCode} />
    </div>
  {/if}
</div>
