<script lang="ts">
    import sanitizar from "$lib/sanitizers/sanitizer";
    import SelectBlock from "../logic/SelectBlock.svelte";
    import MainPhone from "../select/minimalist/MainPhone.svelte";
    import OptionPhone from "../select/minimalist/OptionPhone.svelte";
    import {onMount} from "svelte"
	import {countrysInfo} from "$lib/utils/values/country"
    import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import sinalizador from "$lib/utils/signal.svelte";

	interface Props{
		value?:string,
		valueWithCountry?:string,
		label:string,

		subLabel?:string;
		placeholder?:string,
		mandatory?:boolean,
		tip?:string,
		validate?:()=>string;
		disabled?:boolean,
		lockedIn?:string 
	}



	let {value = $bindable(),
		valueWithCountry = $bindable(),
		label,
		mandatory=false,
		subLabel,
		tip,
		lockedIn="+55", //Por padrão vamos deixar sempre travado para aceitar apenas numeros brasileiros
		validate = () => "",
		placeholder="(555) 0000-0000",
		disabled
	}:Props = $props()


	let countryCode = $state<string>("+55")
	let disableSelect = $state<boolean>(false)
	let error = $state("")

	$effect(()=>{
		if(value){
			value = sanitizar.telefone(value,false)
			valueWithCountry =  countryCode + value
		}
	})	
	$effect(()=>{
		if(sinalizador.signal.tipo==="validarInputs"){
		error=validate()
		}
	})

	onMount(()=>{
		if(lockedIn){
			disableSelect=true
			countryCode = lockedIn

		}
	})

</script>

<InputWrapper bind:error label={label} {subLabel} value={value ?? ""} mandatory={mandatory} tip={tip} >

	<div class="flex  h-[40px] max-h-[40px] text-[14px] font-normal items-center rounded-[10px] apply-class-focus"
	data-disabled={disabled ? true : null}
	data-error={(error && error.length>0) ? true : null}>
		<div class="shrink-0 h-full  flex items-center">
			<SelectBlock placeholder="+55" focusCss="relative h-full w-full" options={countrysInfo.map((obj)=>{
				return{
					label: obj.code,
					value:obj.code,
					icon:obj.icon
				}
			})} MainComponent={MainPhone} 
			OptionComponent={OptionPhone} bind:value={countryCode} removableOnClick={false} disabled={disableSelect}
			dropCss="absolute top-[125%] left-0 w-full max-h-[200px] rounded-lg overflow-y-auto bg-transparent border border-[rgba(0,0,0,.05)]  dark:border-none shadow-lg dark:shadow-none flex flex-col"/>			
		</div>
		<div class="h-full w-[1px] bg-soft-200 "></div>
		<input disabled={disabled} 
		type="tel" 
		name="input" 
		bind:value={value} 
		placeholder={placeholder} 
		class="w-full outline-none ml-3 text-[14px]"
		onfocus={()=> error=""}
		onblur={()=>{
			if(value)
				error = validate()
		}}
	  />
		
	</div>

</InputWrapper>