<script lang="ts">
  import type { ProdutoDetalhado } from "$lib/api/modules/produto/produto.dto.svelte";
  import CardProduto from "./CardProduto.svelte";

  interface Props {
    produtos: ProdutoDetalhado[];
    title: string;
  }

  let { produtos, title }: Props = $props();
</script>

<div class="flex flex-col gap-3">
  <h5 class="font-medium text-24">{title}</h5>
  <div class="flex flex-wrap gap-y-3 w-full gap-6">
    {#each produtos.slice(0, 5) as produto}
      <CardProduto {produto} />
    {/each}
  </div>
</div>
