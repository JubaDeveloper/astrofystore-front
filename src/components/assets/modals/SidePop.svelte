<script lang="ts">
  import { portal } from "$lib/actions/portal.svelte";
  import type { Snippet } from "svelte";
  import { quadInOut } from "svelte/easing";
  import { fade, fly } from "svelte/transition";
  import SvgX from "$components/assets/svg//SvgX.svelte";
  import LoaderSmooth from "$components/elements/loading/LoaderSmooth.svelte";

  interface Props {
    open: boolean;
    children: Snippet;
    target?: string;
    label?: string;
    loading?: boolean;
    curved?: boolean;
    withDefaultPadding?: boolean;
    withCloseButton?: boolean;
  }

  let {
    open = $bindable(),
    withDefaultPadding = true,
    curved = false,
    children,
    label,
    loading,
    target = "body",
    withCloseButton = true,
  }: Props = $props();
</script>

{#if open}
  <div
    class="
      w-screen h-svh
      flex justify-end z-10 fixed left-0 top-0
      {curved ? 'p-2 pr-3' : ''}
      backdrop-blur-[1px] bg-static-black/30 dark:bg-static-white/10"
    use:portal={target}
    transition:fade
  >
    <div
      class="flex flex-col justify-start bg-white-0 {curved
        ? 'rounded-[20px]'
        : ''} items-start h-full overflow-x-hidden overflow-y-auto
          max-w-[400px] min-w-[400px] pb-5 pt-5 relative z-20 overflow-hidden"
      transition:fly={{ x: 500, duration: 300, easing: quadInOut }}
    >
      {#if label}
        <div
          class="flex mb-4 px-4 items-center font-medium justify-between text-[18px] w-full overflow-hidden"
        >
          {label}
          {#if withCloseButton}
            <button class="p-2" onclick={() => (open = false)}>
              <SvgX
                props={{
                  class: "fill-black dark:fill-white",
                  width: 12,
                  height: 12,
                }}
              />
            </button>
          {/if}
        </div>
      {/if}
      {#if !loading}
        {@render children()}
      {:else}
        <div class="flex items-center justify-center h-full w-full">
          <LoaderSmooth tamanho="32px" cor="black" />
        </div>
      {/if}
    </div>
    <button
      aria-label="Sair do Modal"
      class=" w-full absolute h-full top-0 left-0 z-0"
      onclick={() => (open = false)}
    >
    </button>
  </div>
{/if}
