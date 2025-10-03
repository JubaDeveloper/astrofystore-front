<script lang="ts">
    import SvgCaret from "$components/assets/svg/SvgCaret.svelte";	
  import SvgOrdenar from "$components/assets/svg/SvgOrdenar.svelte";
    import {type Option,type MainComponentType, type OptionComponentType} from "$lib/utils/types"

    let {hasSelection,optionSelected,placeholder,isActive,disabled,onClick}:MainComponentType = $props()

</script>


<button class="text-[14px] rounded-[8px] font-normal  w-full px-2 flex items-center h-full justify-between gap-1 grow
not-disabled:outline outline-soft-200 
border border-transparent data-[active]:border-strong-950 focus:border-strong-950 
text-sub-600  disabled:text-disabled-300 
disabled:bg-weak-50 bg-white-0  
disabled:pointer-events-none" 
onclick={onClick} disabled={disabled} data-active={isActive ? true : null}>
    {#if optionSelected===null}
        <span class="flex items-center gap-1 pl-1">
            <SvgOrdenar/>
            Ordenar


        </span>

    {:else if !Array.isArray(optionSelected)}
        <div class="flex items-center gap-2">
            {@render icon()}
            <b class="font-medium">{optionSelected.label}</b>    
        </div>
    {/if}

    <SvgCaret props={{
        class:`${isActive ? "rotate-[180deg]" : ""} ${hasSelection ? "fill-sub-600" : "fill-soft-400"}`,
        width:12,
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
          {@const size = 20}
          <Componente props={{
              width:size,
              height:size
          }}/>
      {/if}
  {/if}
{/snippet}