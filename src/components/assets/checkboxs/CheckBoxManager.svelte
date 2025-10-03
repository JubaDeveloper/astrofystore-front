<script lang="ts">
    import { tooltip } from "$lib/actions/title.svelte";
    import {type AnyPrimitive} from "$lib/utils/types"
  import SvgCheckMin from "$components/assets/svg//SvgCheckMin.svelte";
  import Check from "./Check.svelte";
    
    interface Props{
    	options: {
    		label:string,
    		subLabel:string,
    		descricao:string,
    		value:AnyPrimitive,
    		tag?: string
    	}[],
    	values: AnyPrimitive[]
    }
    let {options,values = $bindable()}:Props  = $props()

    const select = (value:AnyPrimitive) => {
    	const jaMarcado = values.some(obj=>obj===value)
    	if(jaMarcado){
    		values = values.filter((obj)=>obj!==value)
    		return
    	}
    	values.push(value)
    }

</script>



<div class="flex flex-wrap w-full gap-2">
	{#each options as op}

		{@render checkbox(op.label,op.subLabel,op.descricao,op.tag ?? null,op.value)}
	
	{/each}
</div>




{#snippet checkbox(label:string,subLabel:string,descricao:string,tag:string | null,value:AnyPrimitive)}
	{@const checked = values.some(obj=>obj===value)}
	{@const styleBtn = checked===true ? "border-primary-base" : "border-soft-200"}

	<button class="rounded-[12px] p-4 py-3 flex group justify-between items-start border w-full
	bg-white-0 hover:bg-weak-50 {styleBtn} hover:border-transparent" 
	onclick={()=>select(value)}>

		<div class="flex flex-col gap-1">
			<div class="flex items-center flex-wrap gap-y-1 gap-2">
				<b class="text-[14px] text-strong-950 font-medium">{label}</b>
				<span class="text-[12px] font-normal text-sub-600">{subLabel}</span>			
				{#if tag}	
					<div class="flex px-2 py-[2px] text-[11px] leading-3.5  bg-information-light text-information-dark rounded-full">
						{tag}
					</div>
				{/if}
			</div>
			<p class="text-[12px] text-left text-sub-600">{descricao}</p>
		</div>
		<Check {checked}/>

	</button>

{/snippet}
