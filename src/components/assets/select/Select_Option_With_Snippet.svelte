<script lang="ts">
    import SvgCheckMin from "$components/assets/svg/SvgCheckMin.svelte";
    import {type Option,type MainComponentType, type OptionComponentType} from "$lib/utils/types"
    
    let {data,isSelected,onClick}:OptionComponentType = $props()

</script>

<button 
onclick={onClick} 
class="p-3 px-2 border-none bg-white-0 dark:hover:bg-gray-900   hover:bg-slate-100 text-strong-950 text-[14px] 
flex items-center justify-between" data-option={data.value}>

    <div class="flex gap-2 text-center items-center w-full ">
        {@render snip()}
        {data.label}
    </div>

    {#if isSelected}
        <SvgCheckMin props={{
            class:"fill-black w-[20px]",
            fill:"black"
        }}/>
    {/if}

</button>

{#snippet snip()}
  {#if data.snippet}
    {@render data.snippet()}
  {/if}
{/snippet}