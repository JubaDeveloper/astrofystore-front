<script lang='ts'>
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet;
        gridCols:string
        header:{
            label:string,
            colSpan:string
        }[]
    }

    let {children,gridCols,header}:Props = $props();
</script>

<div class="flex flex-col gap-2">
    <div class="w-full px-3 py-2 text-[14px] font-light rounded-[8px] bg-weak-50 text-sub-600 grid gap-8 {gridCols}">
        {#each header as h}
            <div class="flex {h.colSpan}">
                {h.label}
            </div>
        {/each}
    </div>
    <div class="flex flex-col text-[14px]">
        {@render children()}
    </div>
</div>


