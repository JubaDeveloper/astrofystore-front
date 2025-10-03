<script lang="ts">
  import type { Component } from "svelte";
  import SvgCopiar from "../svg/SvgCopiar.svelte";
  import SvgCheckMin from "../svg/SvgCheckMin.svelte";
  import { copiarTexto, copiarTextoHTTP } from "$lib/utils/utils.svelte";
  import { slide } from "svelte/transition";


    interface Props{
        icon?:Component,
        text:string,
        hide?:boolean
    }

    let {icon:Icon,text,hide=false}:Props = $props()

    let copiado = $state(false)

    function copiar(){
        copiarTextoHTTP(text)
        copiado=true
        setTimeout(()=>{
            copiado=false
        },2200)
    }

</script>


<div class="flex flex-col">
    <div class="px-2 pr-0 border {copiado ? "border-success-base text-success-base" : "border-soft-200"} rounded-lg  h-[40px] flex justify-between items-center w-full">
        {#if !hide}
        <div class="flex items-center gap-2 text-[14px] truncate w-2 grow">
            {#if Icon}
                <Icon props={{
                    class: copiado ? "fill-success-base  shrink-0" : "fill-sub-600 shrink-0"
                }}/>
            {/if}
            {text}
        </div>
        <button class="border-soft-200 h-full shrink-0 w-[40px] disabled:cursor-default flex justify-center items-center border-l" onclick={copiar} disabled={copiado}>
            {#if copiado}
                <div transition:slide class="absolute">    
                    <SvgCheckMin props={{
                        class:"fill-success-base w-3.5 h-3.5"
                    }}/>
                </div>
            {:else}
                <div transition:slide class="absolute">
                    <SvgCopiar/>
                </div>
            {/if}
        </button>
        {:else}
        <span class="overflow-hidden whitespace-nowrap pointer-events-none select-none">
            • • • • • • • • • • • • • • • • • • • • • • • • • • 
        </span>
        {/if}
    </div>
    {#if copiado}
    <span class="text-success-base text-[12px] font-normal" transition:slide={{axis:"y"}}>Texto copiado!</span>
    {/if}
</div>
