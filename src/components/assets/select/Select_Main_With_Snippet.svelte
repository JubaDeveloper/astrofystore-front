<script lang="ts">
    import SvgCaret from "$components/assets/svg/SvgCaret.svelte";	
    import {type Option,type MainComponentType, type OptionComponentType} from "$lib/utils/types"

    let {hasSelection,optionSelected,placeholder,isActive,disabled,hasError,onClick}:MainComponentType = $props()


</script>


<button class="text-[14px] rounded-[10px] font-normal py-2.5 px-3 flex items-center h-full justify-between gap-2 grow
not-disabled:outline outline-soft-200 
border border-transparent data-[active]:border-strong-950 data-[error]:border-error-base focus:border-strong-950 
text-sub-600 w-full disabled:text-disabled-300 
disabled:bg-weak-50 bg-white-0  overflow-hidden
disabled:pointer-events-none" 
data-error={hasError ? true :  null}
onclick={onClick} disabled={disabled} data-active={isActive ? true : null}>
    {#if optionSelected===null}
        <span class="">{placeholder}</span>
    {:else if !Array.isArray(optionSelected)}
        <div class="flex items-center gap-2 w-2 grow overflow-hidden">
            {@render snip()}
            <b class="font-medium truncate  ">{optionSelected.label}</b>    
        </div>
    {/if}

    <SvgCaret props={{
        class:`${isActive ? "rotate-[180deg]" : ""} ${hasSelection ? "fill-sub-600" : "fill-soft-400"}`,
        width:16,
        height:6

    }
    }/>

</button>

{#snippet snip()}
  {#if optionSelected && !Array.isArray(optionSelected) && optionSelected.snippet}
    {@render optionSelected.snippet()}
  {/if}
{/snippet}