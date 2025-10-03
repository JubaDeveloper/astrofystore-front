<script lang="ts">
    import { goto } from "$app/navigation";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import SvgConfirmacao from "$components/assets/svg/SvgConfirmacao.svelte";
    import AuthController from "$lib/api/modules/auth/auth.controller.svelte";
    import { formAuth, type FormAuth } from "$lib/api/modules/auth/auth.form.svelte";
    import storageService from "$lib/utils/storageService";
    import toast from "$lib/utils/toast.svelte";
    import { onMount } from "svelte";

    const authController = new AuthController()
    let form = $state<FormAuth>(formAuth)    
    let loading = $state(false)

    async function logar(){

        loading=true

		let [response,error] = await authController.login(form)

		if(error){
            loading=false
            return toast.error("Falha ao autenticar", error.message)
		}

		storageService.storeData("astronfy-user", {...response,email:form.email})
		storageService.storeData("astronfy-token", response.token)

		toast.success("Usuário autenticado com sucesso", 'Aguarde ser redirecionado para nossa página')

        loading = false

        if(response.perfil.toLowerCase()==="usuario"){
            goto("/marketing")
        } else {
            // perinquanto isso
            goto('/gestao-de-lojas')
        }
    }

    onMount(()=>{
        form.email = storageService.getStoredData('astronfy-email')
        form.senha = storageService.getStoredData('astronfy-senha')
    })
</script>

<div class="flex flex-col gap-2 items-center w-[440px] justify-center">
    <SvgConfirmacao/>
    <div class="flex flex-col text-center justify-center w-full">
        <p class="text-strong-950 font-medium text-24">Cadastro criado com sucesso!</p>
        <p class="text-16 font-medium text-sub-600">Você está pronto para acessar sua conta.</p>
    </div>
    <div class="grid grid-cols-1 w-full h-[40px] mt-3">
        <Botao tema="primary-gradient"  onClick={logar} loading={loading}>
            Fazer Login
        </Botao>
    </div>
</div>