<script lang="ts">
  import GridProdutos from "$components/sections/produtos/GridProdutos.svelte";
  import domainManager from "$lib/settings/domain.svelte";
  import toast from "$lib/utils/toast.svelte";

  import { LojaPublicaController } from "$lib/api/modules/loja-publica/loja.publica.controller";
  import type {
    Banners,
    ProdutoDetalhado,
  } from "$lib/api/modules/produto/produto.dto.svelte";
  import type { FiltrosLojaPublica } from "$lib/api/modules/loja-publica/loja.publica.dto";
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";

  const lojaPublicaController = new LojaPublicaController();

  let produtos = $state<ProdutoDetalhado[]>([]);
  let filtros = $state<FiltrosLojaPublica>({
    pesquisa: "",
    categoriaId: "",
    pagina: 1,
    quantidade: 10,
  });

  let banners = $state<Banners[]>([]);
  let bannerAtivo = $state(0);
  let dominio = $state("");
  let timer: any;

  async function listarProdutos() {
    const [res, err] = await lojaPublicaController.listarProdutos(
      dominio,
      filtros
    );
    if (err) return toast.error("Mensagem do sistema", err.message);
    produtos = res.data.resultado ?? [];
  }

  async function listarBanner() {
    const [res, err] = await lojaPublicaController.listarBanners(dominio);
    if (err) return toast.error("Mensagem do sistema", err.message);
    banners = res.data;
    timer = setInterval(() => {
      bannerAtivo = (bannerAtivo + 1) % banners.length;
    }, 7000);
  }

  onMount(() => {
    dominio = domainManager.ultimoDominioAcessado!;
    listarProdutos();
    listarBanner();
  });
  onDestroy(() => {
    clearInterval(timer);
  });
</script>

<div class="w-full flex flex-col gap-6 p-6">
  {#if domainManager.lojainfo !== undefined}
    <div
      class="w-full h-[400px] rounded-xl overflow-hidden bg-weak-50 relative"
    >
      {#if banners.length > 0}
        <img
          transition:fade
          src={banners[bannerAtivo].url}
          class="w-full h-full object-cover"
          alt="Banner da loja"
        />
        <div class="absolute w-full h-full left-0 top-0 bg-black/15"></div>
        <div
          class="absolute flex items-end w-full h-full left-0 bottom-[16px] translate-x-1/2 gap-2"
        >
          {#each banners as _, i}
            {#key i}
              <button
                onclick={() => (bannerAtivo = i)}
                aria-label="Banner {i}"
                class="w-2 h-2 rounded-full border border-[#99A0AE1A] {bannerAtivo ===
                i
                  ? 'bg-white'
                  : 'bg-[#99A0AE3D]'}"
              >
              </button>
            {/key}
          {/each}
        </div>
      {/if}
    </div>
    <GridProdutos title="Mais vendidos" {produtos} />
    <GridProdutos title="Melhor avaliados" {produtos} />
  {/if}
</div>
