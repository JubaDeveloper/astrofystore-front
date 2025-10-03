<script lang="ts">
	import { onMount, type Component, type Snippet } from "svelte";
    import Label from "$components/assets/labels/Label.svelte";
    import Tip from "$components/assets/labels/Tip.svelte";
  import sinalizador from "$lib/utils/signal.svelte";

	
	interface Props{
		value:string | number | null,
		label:string,
		subLabel?:string,
		mandatory?:boolean,
		tip?:string,
		extraTip?:string,
		error?:string,
		children:Snippet
		rightSide?:Snippet,
		validateFunc?:(err?:string)=>string | Promise<string>
	}

	let {value,label,subLabel,rightSide,mandatory=false,tip,validateFunc,extraTip,error = $bindable(),children}:Props = $props()

	$effect(()=>{
		if(value){
			error=""
		}
	})	


	async function validarAll(){
		if(validateFunc){
	    	error= await validateFunc()
			setTimeout(()=>{
				error=""
			},2000)
		}
  	}

	$effect(()=>{
		if(sinalizador.signal.tipo==="validarInputs"){
		validarAll()
		}
	})

</script>

<!-- 
  @component
  Wrapper principal para os inputs do projeto

   Uso:
    ```tsx
	<InputWrapper bind:error {label} {value} {mandatory} {tip}>
		<div>
			<input type="text"/>
		</div>
	</InputWrapper>
-->


<div class="flex flex-col gap-1 w-full relative ">
	<div class="flex items-center justify-between">
		<Label label={label} extraTip={extraTip} subLabel={subLabel} mandatory={mandatory}/>
		{#if rightSide}
			{@render rightSide()}
		{/if}
	</div>
	
	{@render children()}
	
	<div class="">
		{#if error}
			<Tip label={error} type="error"/>
		{/if}
		{#if (!error || error.length===0) && tip}
			<Tip label={tip} type="tip"/>
		{/if}

	</div>
	
</div>
