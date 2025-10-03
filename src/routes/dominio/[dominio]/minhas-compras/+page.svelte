<script lang="ts">
  import { comprasController } from '$lib/api/modules/pedido/compras/compras.controller';
  import type { CompraDto } from '$lib/api/modules/pedido/compras/compras.dto';
  import SvgCart from '$components/assets/svg/SvgCart.svelte';
  import SvgDevolucao from '$components/assets/svg/SvgDevolucao.svelte';
  import { page } from '$app/state';
  import StepIndicator from '$components/elements/progress/StepIndicator.svelte';
  import BubbleWrapper from '$components/elements/wrappers/BubbleWrapper.svelte';
  import Pedidos from '$components/sections/compras/Pedidos.svelte';
  import Devolucoes from '$components/sections/compras/Devolucoes.svelte';

  let lista = $state<CompraDto[]>([])

  const buttons = [
    { label: "Pedidos", icon: SvgCart },
    { label: "Devoluções", icon: SvgDevolucao },
  ];

  let currentStep = $state<number>(
    page.url.pathname === "/minhas-compras" ? 1 : 2
  );

</script>

<div class="flex items-start gap-6 p-6 h-full grow w-full">
  <BubbleWrapper css="w-[256px] px-0">
    <span class="text-sub-600 text-[12px] px-4 font-normal mb-2"
      >MINHAS COMPRAS</span
    >
    <div class="px-2">
      <StepIndicator
        format="col"
        indicator="icon"
        steps={buttons}
        bind:currentStep
        click={true}
      />
    </div>
  </BubbleWrapper>
  <div class="flex flex-col grow h-full gap-5 w-full">
    {#if currentStep === 1}
      <Pedidos />
    {:else}
      <Devolucoes />
    {/if}
  </div>
</div>
