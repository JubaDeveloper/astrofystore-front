<script lang="ts">
  import SvgXModal from "../svg/SvgXModal.svelte";
  import { fade } from "svelte/transition";

  interface Props {
    open: boolean;
  }

  let { open = $bindable() }: Props = $props();

  function toogle() {
    open = !open;
  }
</script>

<div
  class="w-full h-full flex justify-end items-end md:items-center md:justify-center z-10 fixed bottom-0 right-0 left-0 top-0 backdrop-blur-[1px] bg-static-black/30 dark:bg-static-white/10"
  transition:fade
>
  <div class="relative flex flex-col max-sm:w-full w-[500px]">
    <img class="w-full h-fit rounded-t-[10px]" src="/images/amigo.png" alt="" />
    <button
      class="bg-white-0 p-2 rounded-[8px] absolute right-0 m-3"
      onclick={toogle}
    >
      <SvgXModal />
    </button>
    <div
      class="bg-white-0 rounded-b-2xl flex flex-col items-center justify-center gap-4"
    >
      <div class="flex flex-col items-center justify-center w-full pt-6 p-4">
        <p class="text-20 font-medium text-strong-950">
          Valeu pela moral, camarada! 🤝
        </p>
        <p class="text-14 font-medium text-sub-600">
          Pode crer que ela é super importante pra gente!
        </p>
      </div>
      <div
        class="border-t border-soft-200 w-full flex items-center justify-center p-4"
      >
        <button
          class="bg-white-0 rounded-[8px] border border-soft-200 flex w-full py-2.5 items-center justify-center text-14 font-medium text-sub-600"
          onclick={toogle}
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</div>
