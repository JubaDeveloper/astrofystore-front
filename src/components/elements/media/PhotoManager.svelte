<script lang='ts'>
    import Botao from "$components/assets/buttons/Botao.svelte";
    import { fileManager } from "$lib/actions/file.svelte";

	let data64 = $state("")

	let {tema="normal"}:{tema:"normal" | "minimal" } = $props()

	const triggerFileUpload = () => {
		document.getElementById("fileUpload")?.click()
	}

</script>

<div class="flex flex-col">
	<div class="flex gap-4 items-start">
		<button 
		id="fileUpload"
		class="w-[64px] aspect-square rounded-full overflow-hidden hover:brightness-110 bg-sub-300"
		aria-label="perfil imagem" 

		use:fileManager={{
			accept:".png,.jpg,.jpge,.webp",
			multipleFiles:false
		}}
		
		onfileupload={(e)=>{
			data64 = e.detail[0].data64
		}}>
		
			{#if data64}
				<img src={data64} alt="Perfil" class="object-cover h-full"/>
			{:else}
				<img src="/icons/usuario-default.svg" alt="usuario default"/>
			{/if}
			
		</button>

		<div class="flex {tema==="normal" ? "flex-col" : ""}">
			{#if tema==="normal"}
			<b class="text-[16px] text-strong-950">Inserir imagem</b>
			<span class="text-[14px] mt-[3px] text-sub-600">Minimo: 400x400, Formatos: JPG,PNG,WEBP</span>		
			{/if}
			{#if data64}
				<div class="flex items-center flex-wrap mt-2 gap-3">
					<Botao tema="red-transparent"  onClick={()=>data64=""} >
						Remover
					</Botao>
					<Botao tema="gray-transparent"  onClick={triggerFileUpload} >
						Trocar imagem
					</Botao>
				</div>
			{:else}			
				<div class="flex items-center mt-2">
					<Botao tema="gray-transparent"  onClick={triggerFileUpload} >
						Adicionar imagem
					</Botao>
				</div>
			{/if}
		</div>

	</div>
	
</div>





