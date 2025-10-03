<script lang="ts">
    import Botao from "$components/assets/buttons/Botao.svelte";
    import Input from "$components/assets/input/Input.svelte";
import PopUp from "$components/assets/modals/PopUp.svelte";
  import SvgConfig from "$components/assets/svg/SvgConfig.svelte";
  import SvgEmail from "$components/assets/svg/SvgEmail.svelte";
    import toast from "$lib/utils/toast.svelte";

	let {open = $bindable()} = $props()

	let loading = $state<boolean>(false)

    let form  = $state({
        email:"",
        cep:""
    })

    let statusForm  = $state({
        email:"",
        cep:""
    })
	
</script>



<PopUp bind:open>
	<div class="flex flex-col gap-4 xl:min-w-[400px]">
		<div class="flex gap-2 items-center">
			<div class="p-2 rounded-full border border-soft-200">
				<SvgConfig/>
			</div>
			<div class="flex flex-col">
				<b class="text-strong-950 text-[14px]">Label</b>
				<span class="text-sub-600 text-[12px]">Insert your text here</span>
			</div>
		</div>
		{@render linha()}
		<div class="flex flex-col gap-4">
			
    	    <Input bind:value={form.email} label="E-mail" mandatory={true} 
	        Icon={SvgEmail} tip="Insira um e-mail bacana" placeholder="fulano@email.com"/>
		</div>
		{@render linha()}
		<div class="grid grid-cols-2 gap-4">
			<Botao onClick={()=>{open=false}} tema="gray-transparent" >
				Cancelar
			</Botao>
			<Botao onClick={()=>{
				loading=true
				setTimeout(()=>{
					open=false
					toast.success("Tudo certissimo senhor","Para mais detalhes confira especificamente os detalhes de seu babuga")
					loading=false
				},1000)
			}} loading={loading} tema="primary">
				Confirmar
			</Botao>
		</div>
		
	</div>
</PopUp>



{#snippet linha()}
	<div class="relative w-full">
		<div class="absolute left-[-50%] w-[200%] h-[1px] bg-soft-200">
		</div>
	</div>
{/snippet}