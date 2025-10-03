<script lang="ts">
  import type { Snippet } from "svelte";

  let scrollContainer: HTMLDivElement | undefined;
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  function handleMouseDown(e: MouseEvent) {
    if (!scrollContainer) return;
    isDragging = true;
    startX = e.clientX;
    scrollStart = scrollContainer.scrollLeft;
    scrollContainer.style.cursor = "grabbing";
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging || !scrollContainer) return;
    const dx = e.clientX - startX;
    scrollContainer.scrollLeft = scrollStart - dx;
  }

  function handleMouseUp() {
    if (!scrollContainer) return;
    isDragging = false;
    scrollContainer.style.cursor = "grab";
  }

  interface Props {
    children: Snippet;
  }

  let {children}: Props = $props()
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={scrollContainer}
  class="overflow-x-auto overflow-y-hidden flex gap-4 no-scrollbar"
  onmousedown={handleMouseDown}
  onmousemove={handleMouseMove}
  onmouseup={handleMouseUp}
  onmouseleave={handleMouseUp}
>

{@render children()}

</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
    cursor: grab;
  }
</style>
