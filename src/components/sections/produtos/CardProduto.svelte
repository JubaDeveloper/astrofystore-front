<script lang="ts">
  import dev from "$lib/settings/dev.svelte";
  import type { ProdutoDetalhado } from "$lib/api/modules/produto/produto.dto.svelte";
  import RatingStars from "$components/elements/rating/RatingStars.svelte";
  import { goto } from "$app/navigation";
  import { LojaPublicaController } from "$lib/api/modules/loja-publica/loja.publica.controller";
  import toast from "$lib/utils/toast.svelte";
  import { onMount } from "svelte";
  import { encurtarTexto } from "$lib/utils/utils.svelte";
  import { tooltip } from "$lib/actions/title.svelte";
  import { redirect } from "@sveltejs/kit";

  interface Props {
    produto: ProdutoDetalhado;
  }

  let { produto }: Props = $props();

  let imgController = new LojaPublicaController();

  let imagem: string = $state("");
  let imagens: string[] = $state([""]);
  let pos: number = $state<number>(0);

  function formatMoney(value: number | null) {
    if (!value) return "0";
    return (value / 100).toString();
  }

  async function processImage() {
    const [res, err] = await imgController.imgsProduto(
      dev.keys.backend,
      produto.id
    );
    if (err) return toast.push("Mensagem do sistema", err.message);

    imagem = res.data.imagens[0].url;
    imagens = res.data.imagens.map((obj: any) => obj.url);
    setInterval(() => {
      if (imagens[pos] && imagens[pos + 1]) {
        pos++;
      } else {
        pos = 0;
      }
    }, 1500);
  }

  onMount(() => {
    processImage();
  });
</script>

{#snippet precoProduto(preco: number | null)}
  <div class="relative w-fit">
    <p class="text-24 font-medium text-strong-950">
      R$ {formatMoney(preco).split(".")[0]}
    </p>
    <p class="text-11 font-medium text-strong-950 absolute top-1 right-[-14px]">
      {formatMoney(preco).split(".")[1]}
    </p>
  </div>
{/snippet}

<div class="relative w-[400px] bg-white-0 rounded-xl group flex justify-center">
  <div
    class="absolute pointer-events-none delay-75 group-hover:delay-700 flex flex-col z-10 group-hover:translate-y-0 group-hover:opacity-100
opacity-0 translate-y-[100%] shadow-xl w-[400px] h-[300px] overflow-hidden justify-center items-center grow-0 shrink-0
top-[-50%] border border-soft-200 bg-white text-strong-950 font-medium rounded-lg text-center self-center"
  >
    <img
      src={imagens[pos] ?? "images/not-found.webp"}
      class="max-w-full max-h-full object-contain"
      alt=""
    />
  </div>
  <button
    onclick={() => goto(`/produto/${produto.urlAmigavel}`)}
    class="w-full h-[300px] bg-white-0 z-2 border border-soft-200 group-hover:border-soft-400 rounded-xl overflow-hidden"
  >
    <div class="h-[150px] relative">
      <img
        src={imagem !== "" ? imagem : "images/not-found.webp"}
        class="w-full h-full object-cover"
        alt=""
      />
      <div
        class="absolute bg-white-0 bottom-[-12px] left-4 px-2 py-1 border border-soft-200 rounded-[6px]"
      >
        <p class="text-sub-600 text-[11px]">
          {produto.categoria ? produto.categoria.nome : "SEM CATEGORIA"}
        </p>
      </div>
    </div>
    <div class="p-4 pt-6 flex flex-col gap-3 h-[150px]">
      <div class="flex flex-col gap-1 items-start">
        <RatingStars rating={produto.mediaAvaliacao} enableRating={false} />
        <p
          class="text-14 text-left font-medium text-strong-950 truncate w-full"
        >
          {produto.nome}
        </p>
      </div>
      {#if produto.desconto}
        <p class="text-sub-600 text-12 line-through">
          R${formatMoney(produto.preco)}
        </p>
      {/if}
      <div class="flex gap-6 items-center">
        {#if produto.variacoes && produto.variacoes.length > 0}
          {@const menorPreco = Math.min(
            ...produto.variacoes
              .map((v) => v.preco)
              .filter((p): p is number => p !== null)
          )}
          <span class="flex flex-col gap-0">
            <p class="text-[8px] text-strong-600 -mb-1">A PARTIR DE:</p>
            {@render precoProduto(menorPreco)}
          </span>
        {:else}
          {@render precoProduto(produto.preco)}
        {/if}
        {#if produto.desconto}
          <p class="text-14 font-medium text-success-base">
            {produto.desconto}% OFF
          </p>
        {/if}
      </div>
    </div>
  </button>
</div>
