<script lang="ts">
  import dev from "$lib/settings/dev.svelte";
  import type {
    imagemId,
    ProdutoDetalhado,
  } from "$lib/api/modules/produto/produto.dto.svelte";
  import WrapperScroll from "./WrapperScroll.svelte";
  import { fade, slide } from "svelte/transition";
  import { LojaPublicaController } from "$lib/api/modules/loja-publica/loja.publica.controller";
  import toast from "$lib/utils/toast.svelte";
  import { onMount } from "svelte";

  interface Props {
    produtoId: number;
  }

  const { produtoId }: Props = $props();

  let imgController = new LojaPublicaController();
  let imagens: imagemId[] = $state([]);
  let index: number = $state(0);

  async function processImage() {
    if (produtoId === 0) return; // Skip if produtoId is not set
    const [res, err] = await imgController.imgsProduto(
      dev.keys.backend,
      produtoId
    );
    if (err) return toast.push("Mensagem do sistema", err.message);
    imagens = res.data.imagens;
  }

  const imagemPrincipal = $derived(
    imagens.length > 0 && index < imagens.length
      ? imagens[index].url
      : "/images/not-found.webp"
  );

  $effect(() => {
    if (produtoId !== 0) processImage();
  });
</script>

<div class="flex flex-col gap-5 w-1/2">
  <div
    class="flex w-full items-center justify-center rounded-[12px] h-[440px] overflow-hidden"
  >
    {#key index}
      <img
        src={imagemPrincipal}
        alt="Img principal"
        class="rounded-[12px] h-full transition-all duration-300"
        in:slide={{ duration: 400 }}
        out:slide={{ duration: 400 }}
      />
    {/key}
  </div>

  <WrapperScroll>
    {#each imagens as img, i}
      <div
        class="shrink-0 {index === i
          ? 'border border-primary-dark rounded-2xl'
          : ''}"
      >
        <button
          class="m-1 flex w-28 bg-weak-50 items-center justify-center rounded-[0.875rem]"
          onclick={() => (index = i)}
        >
          <img
            src={img.url !== "" ? img.url : "images/not-found.webp"}
            alt=""
            class="rounded-2xl h-20 w-full object-cover"
          />
        </button>
      </div>
    {/each}
  </WrapperScroll>
</div>
