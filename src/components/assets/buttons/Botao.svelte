<script lang="ts">
    import LoaderSmooth from "$components/elements/loading/LoaderSmooth.svelte";
    import type { Component, Snippet } from "svelte";
    import type { SVGAttributes } from "svelte/elements";

	type Temas =  "primary" | "red" | "black" | "green" | "transparent" |
	"blue-transparent" | "red-transparent" | "black-transparent" |  
	"gray-transparent" | "primary-gradient" | "red-transparent-inverted" | 'desabilitado' | 'b-astronfy'
	| "discord" | "hostinger"
	
	interface Props{
		children:Snippet,
		tema: Temas,
		onClick:VoidFunction,
		disabled?:boolean,
		loading?:boolean,
		defaultPadding?:boolean
	}
	//Caso queira alterar a altura desse componente, é possivel fazer externamente a ele, use uma div flex e sete uma altura que ele se comporta de acordo
	//Caso precise de algum css especifico, adicione temas
	//Proibido botar: width,height,padding -> Sujeito a paulada
	
	let {children,tema,onClick,loading,disabled,defaultPadding=true}:Props = $props()


	const temaStyle = ():string => {
		if(tema==="blue-transparent"){
			return "text-primary-base  border border-primary-base hover:border-transparent hover:bg-primary-alpha-10 disabled:bg-primary-darker"
		}

		if(tema==="red-transparent"){
			return "text-error-base border border-error-base hover:border-transparent hover:bg-alpha-red-alpha-10 disabled:bg-red-600"		
		}

		if(tema==="red-transparent-inverted"){
			return "text-error-base border hover:border-error-base border-transparent hover:bg-transparent bg-alpha-red-alpha-10 disabled:bg-red-600"		
		}

		if(tema==="black-transparent"){
			return "text-strong-950 border border-strong-950 hover:border-transparent hover:bg-weak-50 disabled:bg-surface-800"
		}

		if(tema==="gray-transparent"){
			return "text-sub-600 border border-soft-200 hover:border-transparent hover:bg-soft-200 dark:hover:text-static-white hover:text-static-black"
		}

		if(tema==="transparent"){
			return "text-sub-600 hover:bg-soft-200 dark:hover:text-static-white hover:text-static-black border border-soft-200"
		}
		if(tema==="green")
			return "bg-success-base not-disabled:hover:bg-success-dark disabled:bg-success-darker disabled:text-white-0 text-static-white"

		if(tema==="primary"){
			return "text-static-white font-medium leading-tight tracking-wide bg-primary-base hover:bg-primary-darker disabled:text-disabled-300 disabled:bg-weak-50"
		}

		if(tema==="red"){
			return "text-static-white bg-error-base hover:bg-red-600 disabled:bg-red-600"		
		}

		if(tema==="hostinger"){
			return "text-static-white bg-primary-base"		
		}

		if(tema==="black"){
			return "text-static-white dark:text-static-black bg-strong-950 hover:bg-surface-800 disabled:bg-surface-800" 
		}

		if(tema==="primary-gradient"){
			return "text-static-white font-medium leading-tight tracking-wide primary-gradient"
		} 

		if(tema==="b-astronfy") return "text-static-white font-medium leading-tight tracking-wide bg-primary-base"

		if(tema==="desabilitado") return "bg-weak-50 text-disabled-300 pointer-events-none"

		if(tema==="discord") return "bg-[#5865F2] text-white hover:bg-primary-base"

		return ""
	}


</script>


<!-- 
  @component
	Cores de background,bordar e texto, são fixos baseados na variavel "tema"
	Caso queira adicionar icones, ou fazer qualquer botão complexo, sinta-se livre para utilizar divs complexas dentro do botão
  Uso:
    ```tsx
  <Botao onClick={function}>
	<Icone/>
	Texto Bacana
	<Icone/>
  </Botao>
		
-->


<button 
class="text-14 group cursor-pointer disabled:cursor-auto  relative flex items-center justify-center font-medium gap-2 {defaultPadding && "p-1 px-2"} leading-5.5 rounded-[10px] {temaStyle()}" 
onclick={onClick} 
disabled={(loading || disabled) ? true : null}

>
	{#if loading}
		<div class="w-20 flex items-center justify-center">
			<LoaderSmooth cor="text-black" tamanho={"w-[21px]"}/>		
		</div>
	{:else}
		{@render children()}
	{/if}
</button>

<style>
	.primary-gradient{
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.00) 100%), var(--color-primary-base, #775CFF);

		box-shadow: 0px 1px 2px 0px rgba(14, 18, 27, 0.24), 0px 0px 0px 1px var(--primary-base, #775CFF);
		border:1px solid  linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.00) 100%);
	}
</style>