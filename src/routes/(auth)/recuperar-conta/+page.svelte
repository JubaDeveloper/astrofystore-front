<script lang="ts">
    import { formAuth, type FormAuth } from "$lib/api/modules/auth/auth.form.svelte";
    import AuthController from "$lib/api/modules/auth/auth.controller.svelte"
    import toast from "$lib/utils/toast.svelte";
    import storageService from "$lib/utils/storageService";
    import SvgUsuario from "$components/assets/svg/SvgUsuario.svelte";
    import SvgDefaultUser from "$components/assets/svg/SvgDefaultUser.svelte";
    import Input from "$components/assets/input/Input.svelte";
    import SvgEmail from "$components/assets/svg/SvgEmail.svelte";
    import Password from "$components/assets/input/Password.svelte";
    import validateInputs from "$lib/sanitizers/validateFormats";
    import Check from "$components/assets/checkboxs/Check.svelte";
    import Link from "$components/assets/links/Link.svelte";
    import { goto } from "$app/navigation";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import SvgDoorLock from "$components/assets/svg/SvgDoorLock.svelte";
    import sinalizador from "$lib/utils/signal.svelte";

    let form = {
        email:""
    }
    
    let loading = $state<boolean>(false)

    const authController = new AuthController()

	async function recuperar(){
        goto("/confirmacao")
        if(validateEmail()){
            sinalizador.sendSignal("validarInputs")
            return
        }
        loading=true
        const [res, err] = await authController.enviarEmailRecuperacao(form)
        loading=false
        if(err){
            toast.error("Notificação do sistema", "E-mail não encontrado na base de dados")
            return
        }
        toast.success("Cheque seu correio eletronico", 'Se o e-mail que enviou tem um conta no nosso site, verifique sua caixa de entrada')
	}

    const validateEmail = () => {
        if(validateInputs.email(form.email)){
            return ""
        }
        return "E-mail não é valido"
    }
</script>

<div class="w-[440px] flex flex-col items-center">
<div class="user-gradient rounded-full w-[96px] aspect-square flex justify-center items-center">
    <div class="rounded-full border  border-soft-200 shadow-sm w-[64px] aspect-square bg-white-0 flex justify-center items-center">
        <SvgDoorLock props={{
            class:"fill-primary-dark"
        }}/>
    </div>
</div>

<h5 class="mt-2">Recuperar Conta</h5>
<span class="text-[16px] text-sub-600">Digite o seu e-mail para redefinir a senha.</span>
<div class="flex flex-col gap-[12px] w-full">
    <Input Icon={SvgEmail} validate={validateEmail} onEnter={recuperar} 
    tip="Insira o email que você se cadastrou"
    placeholder="email@email.com.br" label="E-mail" mandatory={true} bind:value={form.email}/>
</div>

<div class="grid grid-cols-1 w-full h-[40px] mt-3">
    <Botao tema="primary-gradient"  onClick={recuperar} loading={loading}>
        Envia link de redefinição
    </Botao>
</div>
</div>

<style>
    .user-gradient{
        background: linear-gradient(180deg, rgba(113, 119, 132, 0.10) 0%, rgba(113, 119, 132, 0.00) 100%);
    }
</style>