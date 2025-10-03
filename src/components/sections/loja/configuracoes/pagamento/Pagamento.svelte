<script lang="ts">
  import { page } from "$app/state";
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Badge from "$components/assets/badge/Badge.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import SvgLink from "$components/assets/svg/SvgLink.svelte";
  import BubbleWrapper from "$components/elements/wrappers/BubbleWrapper.svelte";
  import pagamentoController from "$lib/api/modules/pagamento/pagamento.controller";
  import toast from "$lib/utils/toast.svelte";
  import { onMount } from "svelte";

  type taxaDTO = {
    taxaInterna: number;
    metodosPagamento: [
      {
        nome: "Crédito" | "Pix";
        tipoTaxa: "PERCENTUAL" | "FIXA";
        taxa: number;
      },
    ];
  };

  let idLoja = page.params.id;

  let urlMp: string = $state("");
  let statusMp: boolean | null = $state(null);

  let urlSt = window.location.href;
  let statusSt: boolean | null = $state(null);
  let urlRediSt: string = $state("");
  let taxaMP = $state<taxaDTO>();
  let hasTaxas = $state(false);

  async function mercadoPago() {
    const [res, err] = await pagamentoController.statusMercadoPago(
      parseInt(idLoja)
    );

    if (err) return toast.error("Mensagem do sistema.", err.message);

    statusMp = res.data.integrado;
  }

  async function pegarTaxas() {
    const [res, err] = await pagamentoController.pegarTaxas(parseInt(idLoja));
    if (err) return toast.error("Mensagem do sistema.", err.message);
    taxaMP = res.data.filter(
      (taxa: any) => taxa.integracao === "Mercado Pago"
    )[0];
    hasTaxas = true;
  }

  async function redirecionamentoMp() {
    const [res, err] = await pagamentoController.redirecionamentoMercadoPago(
      parseInt(idLoja)
    );

    if (err) return toast.error("Mensagem do sistema.", err.message);

    urlMp = res.data.url;
  }

  //   async function stripe() {
  //     const [res, err] = await pagamentoController.statusStripe(parseInt(idLoja));

  //     if (err) return toast.error("Mensagem do sistema.", err.message);

  //     statusSt = res.data.pagamentos;
  //   }

  //   async function redirecionamentoSt() {
  //     const [res, err] = await pagamentoController.redirecionamentoStripe(
  //       parseInt(idLoja),
  //       urlSt,
  //       urlSt
  //     );

  //     if (err) return toast.error("Mensagem do sistema.", err.message);

  //     urlRediSt = res.data.url;
  //   }

  onMount(() => {
    pegarTaxas();
    mercadoPago();
    setInterval(() => {
      mercadoPago();
    }, 2000);
    redirecionamentoMp();

    // stripe();
    // setInterval(() => {
    //   stripe();
    // }, 2000);
    // redirecionamentoSt();
  });
</script>

<BubbleWrapper css="w-full px-0 pb-0">
  <div class="flex flex-col px-4">
    <p class="text-16 font-medium text-strong-950">Pagamento</p>
    <p class="text-14 font-normal text-sub-600">Configurações de pagamento</p>
  </div>
  <div class="w-full h-[1px] bg-soft-200 mt-4"></div>
  <div class="flex flex-col gap-1">
    <div class="px-3 border-b border-soft-200 py-3">
      {@render mP()}
    </div>
    <!-- <div class="px-3 border-b border-soft-200 py-3">
            {@render st()}
        </div> -->
  </div>
</BubbleWrapper>

{#snippet mP()}
  <div class="flex items-center gap-2 justify-between">
    <div class="flex items-center gap-3">
      <Avatar src="/images/mercado-pago.png" name="MP" />
      <div class="flex flex-col leading-5.5">
        <p class="text-16 font-medium text-strong-950">Mercado Pago</p>
        <p class="text-14 font-medium text-sub-600">Conecte sua conta</p>
      </div>
    </div>
    {#if hasTaxas}
      <div class="flex items-center gap-6">
        <div class="flex flex-col gap-1.5">
          <div class="text-sub-600 text-[12px]">Taxa Fixa</div>
          <Badge tema="feature-base">astrofystore: {taxaMP!.taxaInterna!}%</Badge>
        </div>
        <div class="flex flex-col gap-1.5">
          <div class="text-sub-600 text-[12px]">Métodos</div>
          <div class="flex items-center gap-2">
            {#each taxaMP!.metodosPagamento as { nome, taxa }, i}
              {@const isPar = i % 2 === 0 ? "information-base" : "success-base"}
              <Badge tema={isPar}>{nome}: {taxa}%</Badge>
            {/each}
            <!-- <Badge tema="information-base">Crédito: 4%</Badge>
            <Badge tema="success-base">Pix: 4%</Badge> -->
          </div>
        </div>
      </div>
    {/if}
    <div
      class="grid {!statusMp ? 'grid-cols-2' : 'grid-cols-1'} gap-x-7 h-[32px]"
    >
      {#if !statusMp}
        <button
          onclick={() => {
            window.open(
              "https://www.mercadopago.com.br/hub/registration/fiscal-splitter?contextual=normal"
            );
          }}
          class="flex items-center gap-2 text-[14px] group text-sub-600 px-2 hover:text-strong-950"
        >
          <SvgLink
            props={{
              class: "group-hover:fill-strong-950 group-hover:rotate-45",
            }}
          />
          Criar conta
        </button>
      {/if}
      <Botao
        tema={statusMp ? "red" : "black"}
        onClick={() => {
          window.open(urlMp, "_blank");
        }}
      >
        {#if !statusMp}
          Conectar
        {:else}
          Desconectar
        {/if}
      </Botao>
    </div>
  </div>
{/snippet}

{#snippet st()}
  <div class="flex items-center gap-2 justify-between">
    <div class="flex items-center gap-3">
      <Avatar src="/images/stripe.png" name="MP" />
      <div class="flex flex-col leading-5.5">
        <p class="text-16 font-medium text-strong-950">Stripe</p>
        <p class="text-14 font-medium text-sub-600">Conecte sua conta</p>
      </div>
    </div>
    <div class="flex items-center gap-6">
      <div class="flex flex-col gap-1.5">
        <div class="text-sub-600 text-[12px]">Taxa Fixa</div>
        <Badge tema="feature-base">astrofystore: 4%</Badge>
      </div>
      <div class="flex flex-col gap-1.5">
        <div class="text-sub-600 text-[12px]">Métodos</div>
        <div class="flex items-center gap-2">
          <Badge tema="information-base">Crédito: 4%</Badge>
          <Badge tema="success-base">Pix: 4%</Badge>
        </div>
      </div>
    </div>
    <div
      class="grid {!statusSt ? 'grid-cols-2' : 'grid-cols-1'} gap-x-7 h-[32px]"
    >
      {#if !statusSt}
        <button
          onclick={() => {
            window.open(
              "https://www.mercadopago.com.br/hub/registration/fiscal-splitter?contextual=normal"
            );
          }}
          class="flex items-center gap-2 text-[14px] group text-sub-600 px-2 hover:text-strong-950"
        >
          <SvgLink
            props={{
              class: "group-hover:fill-strong-950 group-hover:rotate-45",
            }}
          />
          Criar conta
        </button>
      {/if}
      <Botao
        tema={statusSt ? "red" : "black"}
        onClick={() => {
          window.open(urlRediSt, "_blank");
        }}
      >
        {#if !statusSt}
          Conectar
        {:else}
          Desconectar
        {/if}
      </Botao>
    </div>
  </div>
{/snippet}
