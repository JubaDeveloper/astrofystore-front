<script lang="ts">
    import { tooltip } from "$lib/actions/title.svelte";
    import {type AnyPrimitive} from "$lib/utils/types"
	import SvgCheckMin from "$components/assets/svg//SvgCheckMin.svelte";
	import Ratio from "$components/assets/ratio/Ratio.svelte";
	import type { SVGAttributes } from "svelte/elements";
	import type { Component, Snippet } from "svelte";
  import { slide } from "svelte/transition";
    
    interface Props{
    	options: {
    		label:string,
    		value:AnyPrimitive,
            icon:Component,
            children?:Component | Snippet
    	}[],
    	value: AnyPrimitive,
    }
    let {options,value = $bindable()}:Props  = $props()

    const select = (v:AnyPrimitive) => {
        value=v
    }

</script>



<div class="flex flex-col w-full gap-2">
	{#each options as op}
    {@const Icon = op.icon}
    {@const Expanded = op.children}
        <div class="flex flex-col w-full border border-soft-200  px-0 rounded-2xl ">
            <button class=" flex items-center w-full py-4.5 justify-between gap-2 px-4" onclick={()=>select(op.value)}>
                <div class="flex items-center gap-2">
                    <div class="w-[40px] aspect-square rounded-full flex items-center justify-center border border-soft-200">
                        <Icon/>
                    </div>
                    {op.label}
    
                </div>
                <Ratio checked={op.value===value}/>
            </button>
            {#if op.value===value && Expanded}
                <div class="flex flex-col w-full mt-3 overflow-hidden pb-4.5 shrink-0" transition:slide={{axis:"y"}}>
                    <Expanded/>
                </div>
            {/if}
        </div>

	{/each}
</div>