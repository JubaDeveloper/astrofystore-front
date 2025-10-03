<script lang="ts">
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import Search from "$components/assets/input/Search.svelte";
  import SvgAdd from "$components/assets/svg/SvgAdd.svelte";
  import SvgBell from "$components/assets/svg/SvgBell.svelte";
  import type { Component, Snippet } from "svelte";

  interface Props{
    label:string,
    desc:string,
    snippetRight?:Component | Snippet
  }

  let {label,desc,snippetRight:Snip}:Props = $props()

</script>

<div class="border-b border-soft-200 pb-5 flex items-center justify-between">
  <div class="flex flex-col">
      <span class="text-[18px] font-medium">
        {label}
      </span>
      <p class="text-[14px] text-sub-600">
        {desc}
      </p>
  </div>
  {#if Snip}
    <Snip/>
  {/if}
</div>