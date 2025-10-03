<script lang="ts">
  import { goto } from "$app/navigation";
  import Botao from "$components/assets/buttons/Botao.svelte";
</script>

<div class="flex flex-col gap-6 items-center justify-center h-full">
  <span class="flex flex-col items-center gap-2">
    <img src="/icons/presente-icon.svg" alt="" class="w-[96px]" />
    <span class="flex flex-col gap-1 items-center">
      <h5 class="text-strong-950 text-24 font-medium">
        Pronto, compra realizada com sucesso
      </h5>
      <p class="text-sub-600 text-16 font-medium">
        Seu pedido te espera em "minhas compras", é só clicar! 👌
      </p>
    </span>
  </span>
  <button
    class="bg-primary-base text-white-0 p-[10px] rounded-lg w-fit"
    onclick={() => goto("/minhas-compras")}
  >
    Ver meu pedido agora
  </button>
</div>
