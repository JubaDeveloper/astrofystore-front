<script lang="ts">
    import { tooltip } from "$lib/actions/title.svelte";
    import {type AnyPrimitive} from "$lib/utils/types"
	import SvgCheckMin from "$components/assets/svg//SvgCheckMin.svelte";
	import Ratio from "$components/assets/ratio/Ratio.svelte";
	import type { SVGAttributes } from "svelte/elements";
	import type { Component, Snippet } from "svelte";
    
    interface Props{
    	options: {
    		label:string,
    		value:AnyPrimitive,
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

        <button class="flex items-center gap-2" onclick={()=>select(op.value)}>
            <Ratio checked={op.value===value}/>
            {op.label}
        </button>

	{/each}
</div>