<script lang="ts">
    import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
    import sanitizar from "$lib/sanitizers/sanitizer";
    import DataRange from "../calendar/DataRange.svelte";
    import handleDate from "$lib/sanitizers/time";
  import SvgCalendar from "$components/assets/svg//SvgCalendar.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
  import { onMount } from "svelte";

	
	interface Props{
		value:string,
		label:string,
		range?:{start:Date | null,end:Date | null},
		valueFormat?: (v:{start:Date | null,end:Date | null})=>void,
		placeholder:string,
		mandatory?:boolean,

		validate?:()=>string;
		subLabel?:string;
		tip?:string,
		error?:string,
		disabled?:boolean,
		onlyOneDay?:boolean
	}

	let {
		value = $bindable(),
		subLabel,
		range=$bindable(),
		validate = () => "",
		label,
		mandatory=false,
		tip,
		error = $bindable(),
		placeholder,
		disabled,
		valueFormat = ()=>{},
		onlyOneDay=true
		}
	:Props = $props()

	let isVisible = $state<boolean>(false)
	
	const toggleCalendar = () => {
		isVisible=!isVisible
	}
	const select = (v:{start:Date | null,end:Date | null}) => {

		if(v.start && v.end){
			range = v
			if(!onlyOneDay){
				value = handleDate.formatDate(v.start)+" - "+  handleDate.formatDate(v.end)
				isVisible=false
				return
			}
			value = handleDate.formatDate(v.start)
			isVisible=false
			return
		}
	}

	$effect(()=>{
		if(range?.start || range?.end){
			valueFormat(range)
		}
	})

	$effect(()=>{
		if(sinalizador.signal.tipo==="validarInputs"){
		error=validate()
		}
	})


</script>

<InputWrapper bind:error label={label} {subLabel} value={value} mandatory={mandatory} tip={tip} >

	<button 
	class="flex px-3 text-[14px] h-[40px] max-h-[40px] font-normal items-center gap-2  rounded-[10px] apply-class-focus input" 
	data-disabled={disabled} data-error={(error && error.length>0) ? true : null} onclick={toggleCalendar}>

		<SvgCalendar props={{
			class: ""
		}}/>			

		<input 
		disabled={disabled}
		data-onlyOneDay={onlyOneDay===true ? true : null}
		oninput={(e)=>value = sanitizar.data((e.target as HTMLInputElement).value)} 
		type="text" 
		name="input" 
		bind:value={value}
		placeholder={placeholder} 
		class="w-full outline-none text-[14px] disabled:text-disabled-300"

		/>
		
	</button>
	<div class="absolute top-[70px]">
		<DataRange onSelecionar={(v:{start:Date | null,end:Date | null})=>select(v)} onlyOneDay={onlyOneDay} bind:isVisible/>
	</div>

</InputWrapper>
