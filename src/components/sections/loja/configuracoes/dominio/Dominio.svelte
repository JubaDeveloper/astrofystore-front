<script lang="ts">
  import Botao from "$components/assets/buttons/Botao.svelte";
  import Site from "$components/assets/input/Site.svelte";
  import FillText from "$components/assets/limiter/FillText.svelte";
  import PopUp from "$components/assets/modals/PopUp.svelte";
  import SvgHostinger from "$components/assets/svg/SvgHostinger.svelte";
  import SvgMundo from "$components/assets/svg/svgMundo.svelte";
  import { formAuth } from "$lib/api/modules/auth/auth.form.svelte";
  import { LojaController } from "$lib/api/modules/lojas/lojas.controller";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import { onMount } from "svelte";
  import ModalSubdominio from "./ModalSubdominio.svelte";
  import SvgPlay from "$components/assets/svg/SvgPlay.svelte";

  const market = [
    {
      img: "/images/dolar-emoji.png",
      titulo: "Maior chances de vendas",
      desc: "Clientes tendem a confiar mais em empresas com domínios exclusivos.",
    },
    {
      img: "/images/star-emoji.png",
      titulo: "Fácil memorização",
      desc: "Domínios exclusivos são mais fáceis de lembrar, pois são mais curtos.",
    },
    {
      img: "/images/biceps-emoji.png",
      titulo: "Seu site mais seguro",
      desc: "Subdomínios gratuitos podem sofrer instabilidades, afetando suas vendas.",
    },
  ];

  const lojaC = new LojaController();

  let botoes = $state([
    {
      justLabel: "DOMÍNIO",
    },
    {
      label: "Subdominio grátis",
      subLabel: "Carregando subdominio",
      labelBtn: "Editar",
      disabled: false,
      action: () => (openSubdominioGratis = true),
    },
    {
      label: "Domínio Exclusivo",
      subLabel: "Sem domínio exclusivo configurado",
      labelBtn: "Configurar",
      disabled: true,
      action: () => {},
    },
    {
      justLabel: "TUTORIAIS",
    },
    {
      label: "Como comprar",
      subLabel: "Veja como comprar seu próprio domínio",
      icon: SvgPlay,
      labelBtn: "Assistir",
      disabled: true,
      action: () => {},
    },
    {
      label: "Como configurar",
      subLabel: "Veja como configurar o seu domínio",
      icon: SvgPlay,
      labelBtn: "Assistir",
      disabled: true,
      action: () => {},
    },
  ]);

  let openSubdominioGratis = $state(false);

  onMount(async () => {
    const [data, error] = await lojaC.pegar(parseInt($idLoja));
    if (data.subdominioPersonalizado) {
      botoes[1].subLabel =
        data.subdominioPersonalizado.subdominio + ".astrofystore.com";
    } else {
      botoes[1].subLabel = "Nenhum subdominio configurado";
    }
  });
</script>

<div class="flex gap-6 w-full items-start">
  {@render conteudo()}
  {@render marketing()}
</div>

{#snippet conteudo()}
  <div
    class="w-full border border-soft-200 max-w-[440px] rounded-2xl flex flex-col"
  >
    <div class="p-4">
      <p class="text-16 font-medium text-strong-950">
        Configuração de domínios
      </p>
      <p class="text-14 font-normal text-sub-600">
        Personalize o subdomínio ou o domínio exclusivo da sua loja.
      </p>
    </div>
    {#each botoes as btn, i}
      {#if btn.justLabel}
        <div class="w-full my-1">
          <FillText texto={btn.justLabel} />
        </div>
      {:else}
        <div class="flex flex-col gap-2 px-4 py-2 pb-1">
          <div class="flex items-center justify-between w-full">
            <div>
              <p class="text-14 font-medium text-strong-950">{btn.label}</p>
              <p class="text-12 font-medium text-sub-600">{btn.subLabel}</p>
            </div>
            <button
              class=" flex items-center gap-0.5 border border-soft-200 disabled:cursor-not-allowed py-1 px-2.5 rounded-[8px] text-sub-600 text-14 font-medium"
              disabled={btn.disabled}
              onclick={btn.action}
            >
              {#if btn.icon}
                {@const Icon = btn.icon}
                <Icon />
              {/if}
              {btn.labelBtn}
            </button>
          </div>
          {#if i < botoes.length - 1 && !botoes[i + 1].justLabel}
            <div class="w-full h-[1px] bg-soft-200"></div>
          {/if}
        </div>
      {/if}
    {/each}
    <div class="w-full h-[1px] bg-soft-200 mt-2"></div>

    <div class="px-3 my-3 w-full h-[40px] grid">
      <Botao
        onClick={() => window.open("https://www.hostinger.com.br/", "_blank")}
        tema={"hostinger"}
      >
        Adquirir domínio via Hostinger <SvgHostinger />
      </Botao>
    </div>
  </div>
{/snippet}

{#snippet marketing()}
  <div
    class="w-full border border-soft-200 max-w-[400px] rounded-2xl flex flex-col items-center justify-center"
  >
    <div
      class="m-4 pb-4 flex items-center gap-2 border-b border-soft-200 w-full justify-center"
    >
      <SvgMundo />
      <p class="text-16 font-medium text-strong-950">
        Porque ter um domínio exclusivo?
      </p>
    </div>
    <img class="max-w-[342px]" src="/images/trio-emoji.png" alt="" />
    <div class="flex flex-col gap-3 p-5">
      {#each market as { img, titulo, desc }}
        <div
          class="p-4 rounded-[12px] border border-soft-200 flex items-center gap-3.5"
        >
          <img src={img} alt="img" />
          <div class="flex flex-col">
            <p class="text-14 font-medium text-strong-950">{titulo}</p>
            <p class="text-12 font-medium text-sub-600">{desc}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/snippet}

<ModalSubdominio bind:open={openSubdominioGratis} />
