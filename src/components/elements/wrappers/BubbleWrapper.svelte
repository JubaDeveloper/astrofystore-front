<script lang="ts">
  import type { Snippet } from "svelte";
  import { quadInOut } from "svelte/easing";
  import { fly, scale } from "svelte/transition";
  import LoaderSmooth from "../loading/LoaderSmooth.svelte";

    interface Props{
        children: Snippet,
        css?:string,
        loading?:boolean
        cssLoading?:string
        directionIn?:number
    }

    let {children,css="w-full",loading,cssLoading="",directionIn=1}:Props = $props()
</script>

<div class="flex flex-col border border-soft-200 overflow-hidden p-4  rounded-[16px] {css} {loading && cssLoading}"
in:fly|global={{duration:800,x:500*directionIn}}
out:scale|global={{duration:800}}
>
    {#if !loading}
        {@render children()}
    {:else}
        <div class="w-full h-full p-12 flex items-center justify-center">
            <LoaderSmooth cor="black" tamanho="w-8"/>
        </div>
    {/if}
</div>