<script lang="ts">
  import { portal } from "$lib/actions/portal.svelte";
  import type { Snippet } from "svelte";
  import { quadInOut } from "svelte/easing";
  import { fade, fly } from "svelte/transition";
  import SvgX from "$components/assets/svg//SvgX.svelte";

  interface Props {
    open: boolean;
    children: Snippet;
    target?: string;
    withCloseButton?: boolean;
    withDefaultPadding?:boolean;
    clickOutside?:VoidFunction
  }

  let {
    open = $bindable(),
    children,
    clickOutside = () => {},
    target = "body",
    withCloseButton = true,
    withDefaultPadding = true,
  }: Props = $props();
</script>

{#if open}
  <div
    class="w-screen h-svh flex justify-center items-center z-10 fixed left-0 top-0 p-4 xl:p-16 backdrop-blur-[1px]
	bg-static-black/30 dark:bg-static-white/10"
    use:portal={target}
    transition:fade>
    <div
      class="flex flex-col justify-start bg-white-0 items-start overflow-x-hidden overflow-y-auto
		xl:max-w-[700px] {withDefaultPadding && "p-4 px-5"} rounded-2xl relative z-20"
      transition:fly={{ y: 500, duration: 600, easing: quadInOut }}>
	  {#if withCloseButton}
      <button
        class="absolute top-0 right-0 m-4 p-2"
        onclick={() => (open = false)}>
        <SvgX props={{ class: "fill-black dark:fill-white" }} />
      </button>
	  {/if}
      {@render children()}
    </div>
    <button
      aria-label="Sair do Modal"
      class=" w-full absolute h-full top-0 left-0 z-0"
      onclick={() => (open = false,clickOutside())}>
    </button>
  </div>
{/if}
