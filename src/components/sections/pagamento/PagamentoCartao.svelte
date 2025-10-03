<script lang="ts">
  import pagamentoController from "$lib/api/modules/pagamento/pagamento.controller";
  import CartaoCredito from "$components/assets/visual/CartaoCredito.svelte";
  import SvgCheck from "$components/assets/svg/SvgCheck.svelte";
  import Label from "$components/assets/labels/Label.svelte";
  import storageService from "$lib/utils/storageService";
  import toast from "$lib/utils/toast.svelte";

  import type { PagamentoBodyDto } from "$lib/api/modules/pagamento/pagamento.dto";
  import { loadMercadoPago } from "@mercadopago/sdk-js";
  import { PUBLIC_MP_KEY } from "$env/static/public";
  import { goto } from "$app/navigation";

  const formFields = {
    id: "form-checkout",
    cardNumber: {
      id: "form-checkout__cardNumber",
      placeholder: "Número do Cartão",
    },
    expirationDate: {
      id: "form-checkout__expirationDate",
      placeholder: "MM/AA",
    },
    securityCode: {
      id: "form-checkout__securityCode",
      placeholder: "CVV",
    },
    cardholderName: {
      id: "form-checkout__cardholderName",
      placeholder: "Nome do titular",
    },
    issuer: {
      id: "form-checkout__issuer",
      placeholder: "Issuing bank",
    },
    installments: {
      id: "form-checkout__installments",
      placeholder: "Installments",
    },
    identificationType: {
      id: "form-checkout__identificationType",
      placeholder: "Documento do titular do cartão",
    },
    identificationNumber: {
      id: "form-checkout__identificationNumber",
      placeholder: "Número do documento",
    },
    cardholderEmail: {
      id: "form-checkout__cardholderEmail",
      placeholder: "Email",
    },
  };

  interface Props {
    formCartao: {
      numeroCartao: string;
      vencimento: string;
      titular: string;
      cvv: string;
    };
    tokenCartao: string;
    valor: string | undefined;
  }

  const classDefault =
    "inline-block h-[40px] border border-soft-200 w-full p-2 rounded-[10px]";

  let processandoPagamento = $state<boolean>(false);
  let renderForm = false;
  let cardForm: any;
  let {
    formCartao = $bindable(),
    valor = $bindable(),
    tokenCartao = $bindable(),
  }: Props = $props();

  function lidarComStatus(stts: string) {
    if (stts === "pending" || stts === "in_process") {
      toast.alert(
        "Aguardando pagamento",
        "O pagamento ainda nao foi confirmado pelo banco, verifique 'Minhas Compras' em alguns instantes"
      );
      return goto("/concluido");
    }
    if (stts === "approved" || stts === "authorized") return goto("/concluido");
    cardForm.reset();
    return toast.error("Erro ao processar pagamento", "Tente novamente");
  }

  async function loadMP() {
    renderForm = true;
    await loadMercadoPago();
    const mp = new (window as any).MercadoPago(PUBLIC_MP_KEY);
    cardForm = mp.cardForm({
      amount: valor,
      iframe: true,
      form: formFields,
      callbacks: {
        onFormMounted: (error: any) => {
          if (error) return toast.error("Form Mounted handling error: ", error);
        },
        onSubmit: (event: any) => {
          processandoPagamento = true;
          event.preventDefault();

          const { paymentMethodId, installments, token } =
            cardForm.getCardFormData();

          const body = {
            idMetodoPagamento: paymentMethodId,
            quantidadeParcelas: Number(installments),
            tokenCartao: token,
            metodo: "credit_card" as "credit_card",
          };

          pagar(body);
        },
      },
    });
  }
  async function pagar(body: PagamentoBodyDto) {
    const [res, err] = await pagamentoController.processarPagamento(
      storageService.getStoredData("id-pedido-pendente"),
      body
    );

    if (err) {
      toast.error("Erro ao processar pagamento", err.message);
      processandoPagamento = false;
      return;
    }

    processandoPagamento = false;
    lidarComStatus(res.data.status);
  }

  $effect(() => {
    if (valor && !renderForm) loadMP();
  });
</script>

<div class="flex flex-col gap-4 px-4">
  <CartaoCredito
    nome={formCartao.titular}
    numero={formCartao.numeroCartao.length > 0
      ? formCartao.numeroCartao
      : "0000000"}
    vencimento={formCartao.vencimento.length
      ? formCartao.vencimento
      : "00/0000"}
  />
  <form id="form-checkout" class="w-full flex flex-col gap-4">
    <div class="flex gap-3">
      <div class="flex flex-col gap-1 w-full">
        <Label label={"Número do cartão"} mandatory={true} />
        <div id="form-checkout__cardNumber" class={classDefault}></div>
      </div>
      <div class="flex flex-col gap-1 w-[150px]">
        <Label label={"Vencimento"} mandatory={true} />
        <div id="form-checkout__expirationDate" class={classDefault}></div>
      </div>
    </div>
    <div class="flex gap-3">
      <div class="flex flex-col gap-1 w-full">
        <Label label={"Nome do titular"} mandatory={true} />
        <input
          type="text"
          id="form-checkout__cardholderName"
          class={classDefault}
        />
      </div>
      <div class="flex flex-col gap-1 w-[150px]">
        <Label label={"CVV"} mandatory={true} />
        <div id="form-checkout__securityCode" class={classDefault}></div>
      </div>
    </div>
    <div class="flex gap-3">
      <div class="flex flex-col gap-1 w-[150px]">
        <Label label={"Documento"} mandatory={true} />
        <select id="form-checkout__identificationType" class={classDefault}
        ></select>
      </div>
      <div class="flex flex-col gap-1 w-full">
        <Label label={"Número do documento do titular"} mandatory={true} />
        <input
          type="text"
          id="form-checkout__identificationNumber"
          class={classDefault}
        />
      </div>
    </div>
    <input type="email" id="form-checkout__cardholderEmail" class="hidden" />
    <select id="form-checkout__issuer" class="hidden"></select>
    <select id="form-checkout__installments" class="hidden"></select>
    <button
      disabled={processandoPagamento}
      type="submit"
      id="form-checkout__submit"
      class="rounded-lg p-[10px] flex items-center justify-center gap-3 {processandoPagamento
        ? 'bg-weak-50'
        : 'bg-success-base'}"
    >
      {#if !processandoPagamento}
        <SvgCheck props={{ class: "fill-white" }} />
        <p class="text-white text-14 font-medium">Finalizar compra</p>
      {:else}
        <p class="text-white text-14 font-medium">Processando pagamento...</p>
      {/if}
    </button>
    <progress value="0" class="progress-bar hidden">Loading...</progress>
  </form>
</div>
