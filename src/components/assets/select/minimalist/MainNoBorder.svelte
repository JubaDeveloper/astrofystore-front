<script lang="ts">
    import SvgCaret from "$components/assets/svg/SvgCaret.svelte";	
    import {type Option,type MainComponentType, type OptionComponentType} from "$lib/utils/types"

    let {hasSelection,optionSelected,placeholder,isActive,disabled,hasError,onClick}:MainComponentType = $props()


</script>


<button class="text-[14px] rounded-[8px] font-normal py-1 px-2 pr-1.5  flex items-center  justify-between gap-1
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
        <div class="flex items-center gap-2 overflow-hidden">
            {@render icon()}
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

{#snippet icon()}
  {#if optionSelected && !Array.isArray(optionSelected) && optionSelected.icon}
      {#if typeof optionSelected.icon==="string"}
          <img src={optionSelected.icon} alt="Icone" class="w-[20px]"/>
      {:else}
          {@const Componente = optionSelected.icon}
          {@const size = 12}
          <Componente props={{
              width:size,
              height:size
          }}/>
      {/if}
  {/if}
{/snippet}