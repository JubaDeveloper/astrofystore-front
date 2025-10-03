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
    		subLabel?:string,
    		descricao:string,
    		value:AnyPrimitive,
    		tag?: string,
			Icon?:  Component<{ props?: SVGAttributes<SVGSVGElement> }>
			LeftSnippet?:Snippet
    	}[],
    	value: AnyPrimitive,
    }
    let {options,value = $bindable()}:Props  = $props()

    const select = (v:AnyPrimitive) => {

        value=v
    }

</script>



<div class="flex flex-wrap w-full gap-2">
	{#each options as op}

		{@render checkbox(op.label,op.Icon,op.subLabel ?? "",op.descricao,op.tag ?? null,op.value,op.LeftSnippet)}
	
	{/each}
</div>




{#snippet checkbox(label:string,Icon: Component<{ props?: SVGAttributes<SVGSVGElement> }> | undefined,subLabel:string,descricao:string,
tag:string | null,v:AnyPrimitive,
leftSnippet:Snippet | undefined)
}
	{@const checked = v === value}
	{@const styleBtn = checked===true ? "border-primary-base" : "border-soft-200"}
	<button class="rounded-[12px] p-4 py-3 flex justify-between items-start border w-full
	bg-white-0 hover:bg-weak-50 {styleBtn} hover:border-transparent group" 
	onclick={()=>select(v)}>

		<div class="flex items-center flex-wrap gap-y-1 gap-2">
			<div class="flex items-start gap-y-1 gap-2">
				{#if leftSnippet}
					{@render leftSnippet()}
				{/if}
				{#if Icon}
					<Icon props={{
						class:"shrink-0"
					}}/>
				{/if}
				<div class="flex flex-col">
					<div class="flex items-center">
						<b class="text-[14px] text-strong-950 font-medium">{label}</b>
						{#if subLabel}
							<span class="text-[12px] font-normal text-sub-600">{subLabel}</span>			
						{/if}
						{#if tag}	
							<div class="flex px-2 py-[2px] text-[11px] leading-3.5  bg-information-light text-information-dark rounded-full">
								{tag}
							</div>
						{/if}

					</div>

					<p class="text-[12px] text-left text-sub-600">{descricao}</p>

	
				</div>
			</div>
		</div>
		<Ratio checked={checked}/>
	</button>

{/snippet}
