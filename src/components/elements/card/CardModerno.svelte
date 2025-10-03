<script lang="ts">

    import SvgExemplo from "$components/assets/svg/SvgExemplo.svelte";
    import type { Component, SvelteComponent } from "svelte";

    interface Props{
    	label?:string, // 
    	Icon?:Component //Passamos o SVG como um componente normal, (lembre de adicionar props como parametro)
        onClick:VoidFunction
    }

    let {label="Exemplo",Icon=SvgExemplo,onClick}:Props = $props()
	
</script>

<button class="flex flex-col w-[144px] h-[144px]  flex-shrink-0 rounded-md 
items-center justify-center gap-4 text-lg font-normal text-sub-600 hover:text-disabled-300 bg-weak-50 hover:bg-strong-950 group" onclick={onClick}>
	<Icon props={{class:"group-hover:fill-white"}}/> 
	{label}
</button>	
