<script lang="ts">
  import type { Snippet } from "svelte";
  import { slide } from "svelte/transition";

    interface Props{
        options:{
            label:string,
            snippetLeft?:Snippet,
        }[],
        labelSelected:string,
    }

    let {options,labelSelected = $bindable()}:Props = $props()
    
</script>


<div class="flex items-start gap-5 w-full border-b px-3 border-soft-200">
    {#each options as op}
        <button class="flex flex-col gap-2 text-[14px] {op.label===labelSelected ? "text-strong-950" : "text-sub-600" } font-medium" onclick={()=>labelSelected=op.label}>
            {op.label}
            {#if op.label===labelSelected}
                <div class="w-full bg-primary-base h-0.5" transition:slide={{axis:"x"}}></div>
            {/if}
        </button>
    {/each}
</div>