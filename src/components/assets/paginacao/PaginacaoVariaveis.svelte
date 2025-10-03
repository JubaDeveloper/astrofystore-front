<script lang="ts">
  import SvgSetaDireita from "../svg/SvgSetaDireita.svelte";

  const { paginaAtual, totalPaginas, proxima, anterior }: {
    paginaAtual: number;
    totalPaginas: number;
    proxima: () => void;
    anterior: () => void;
  } = $props();
</script>

<div class="bg-weak-50 p-1.5 rounded-[8px] flex items-center justify-between mx-5">
  <button
    class="rotate-180 bg-white-0 p-0.5 rounded-[6px]"
    onclick={anterior}
    disabled={paginaAtual <= 1}
  >
    <SvgSetaDireita />
  </button>

  <p class="text-13 font-medium text-sub-600">
    Página {paginaAtual} de {totalPaginas}
  </p>

  <button
    class="bg-white-0 p-0.5 rounded-[6px]"
    onclick={proxima}
    disabled={paginaAtual >= totalPaginas}
  >
    <SvgSetaDireita />
  </button>
</div>