<script lang="ts">
    import SvgResize from "$components/assets/svg/SvgResize.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
    import Label from "../labels/Label.svelte";
    import Tip from "../labels/Tip.svelte";

	
	interface Props{
		value:string,
		label:string,
		placeholder:string,

		validate?:(v?:string)=>string;
		subLabel?:string,
		mandatory?:boolean,
		tip?:string,
		error?:string,
		disabled?:boolean,
		limit:number
	}

	let {value = $bindable(),validate = () => "",label,subLabel,mandatory=false,tip,error = $bindable(),placeholder,disabled,limit}:Props = $props()

	$effect(()=>{
    if(sinalizador.signal.tipo==="validarInputs"){
      error=validate()
    }
  })

	$effect(()=>{
		if(value){
			error=""
		}
	})	

</script>

<div class="flex flex-col gap-1 w-full
">
	<Label {label} {subLabel} {mandatory}/>
	
	<div class="flex p-2 text-[14px] font-normal items-center gap-2  rounded-[10px] apply-class-focus"
	data-disabled={disabled ? true : null}
	data-error={(error && error.length>0) ? true : null}>

		<textarea disabled={disabled}  
		onfocus={()=> error=""}
		onblur={()=>{
		  if(value.length>0)
			error = validate()
		}}
		maxlength={limit} name="input" bind:value={value} placeholder={placeholder} 
		class="w-full outline-none min-h-[80px] h-[80px] transition-none text-[14px]  p-1"></textarea>
		<SvgResize props={{
			class: "absolute right-3 bottom-2"
		}}/>
		<span class="absolute text-soft-400 right-7 font-medium text-[11px] bottom-1">
			{value ? value.length : 0}/{limit}
		</span>
	</div>

	{#if error}
		<Tip label={error} type="error"/>
	{/if}
	{#if (!error || error.length===0) && tip}
		<Tip label={tip} type="tip"/>
	{/if}
	
</div>
<style>
	::-webkit-resizer{
		opacity:0
	}

</style>