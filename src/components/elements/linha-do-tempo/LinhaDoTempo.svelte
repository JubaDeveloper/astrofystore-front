<script lang="ts">
  import SvgDevolucaoMaozinha from "$components/assets/svg/SvgDevolucaoMaozinha.svelte";
  import SvgDivider from "$components/assets/svg/SvgDivider.svelte";
  import handleDate from "$lib/sanitizers/time";

  import type { CompraDetalhadaDto } from "$lib/api/modules/pedido/compras/compras.dto";
  import SvgTudoJoia from "$components/assets/svg/historico/SvgTudoJoia.svelte";
  import SvgMaozinha from "$components/assets/svg/SvgMaozinha.svelte";
  import SvgEnjoado from "$components/assets/svg/historico/SvgEnjoado.svelte";
  import SvgAlegria from "$components/assets/svg/historico/SvgAlegria.svelte";
  import SvgDescolado from "$components/assets/svg/historico/SvgDescolado.svelte";
  import SvgDinheiro from "$components/assets/svg/historico/SvgDinheiro.svelte";
  import SvgAdd from "$components/assets/svg/SvgAdd.svelte";
  import SvgAlertaStroke from "$components/assets/svg/SvgAlertaStroke.svelte";
  import SvgChorandinho from "$components/assets/svg/historico/SvgChorandinho.svelte";
  import SvgPartido from "$components/assets/svg/historico/SvgPartido.svelte";

  const ENUM_HISTORICO_TIPO = {
    PEDIDO_FEITO: "Pedido feito",
    PAGAMENTO_EM_ANALISE: "Pagamento em análise",
    PAGAMENTO_APROVADO: "Pagamento aprovado",
    PAGAMENTO_RECUSADO: "Pagamento recusado",
    PRODUTO_RESGATADO: "Produto resgatado",
    DEVOLUCAO_SOLICITADA: "Devolução solicitada",
    DEVOLUCAO_REALIZADA: "Devolução realizada",
    DEVOLUCAO_RECUSADA: "Devolução recusada",
  };
  const ENUM_HISTORICO_EMOJI = {
    [ENUM_HISTORICO_TIPO.PEDIDO_FEITO]: SvgDinheiro,
    [ENUM_HISTORICO_TIPO.PAGAMENTO_EM_ANALISE]: SvgDescolado,
    [ENUM_HISTORICO_TIPO.PAGAMENTO_APROVADO]: SvgAlegria,
    [ENUM_HISTORICO_TIPO.PAGAMENTO_RECUSADO]: SvgChorandinho,
    [ENUM_HISTORICO_TIPO.PRODUTO_RESGATADO]: SvgMaozinha,
    [ENUM_HISTORICO_TIPO.DEVOLUCAO_SOLICITADA]:SvgPartido,
    [ENUM_HISTORICO_TIPO.DEVOLUCAO_REALIZADA]: SvgTudoJoia,
    [ENUM_HISTORICO_TIPO.DEVOLUCAO_RECUSADA]: SvgEnjoado,
  };

  interface Props {
    historico: CompraDetalhadaDto["historico"];
  }

  let { historico }: Props = $props();

  // TODO: Trocar emojis do historico
</script>

<div class="flex flex-col w-full gap-2">
  {#each historico as timeline, i}
  {@const Icon = ENUM_HISTORICO_EMOJI[timeline.titulo]}
    <div class="flex items-start justify-start gap-4 w-full">
      <div class="flex flex-col items-center justify-center gap-2">
        <!-- o emoji deve vir aqui -->
         <Icon/>
        {#if i !== historico.length - 1}
          <SvgDivider />
        {/if}
      </div>
      <div class="flex flex-col w-full gap-1">
        <div class="flex items-center justify-between w-full">
          <p class="text-14 font-medium text-strong-950">{timeline.titulo}</p>
          <p class="text-12 font-normal text-sub-600">
            {handleDate
              .formatISODate(timeline.criadoEm, `dd MMM yyyy`)
              .toUpperCase()}
            , {handleDate.formatISODate(timeline.criadoEm, `HH':'mm'`)}
          </p>
        </div>
        {#if timeline.descricao}
          <p class="text-11 font-normal text-soft-400">
            {timeline.descricao}
          </p>
        {/if}
      </div>
    </div>
  {/each}
</div>
