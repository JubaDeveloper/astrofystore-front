<script lang="ts">
    import SvgDefaultUser from "$components/assets/svg/SvgDefaultUser.svelte";
    import Password from "$components/assets/input/Password.svelte";
    import Check from "$components/assets/checkboxs/Check.svelte";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import Input from "$components/assets/input/Input.svelte";
    import Link from "$components/assets/links/Link.svelte";

    import { goto } from "$app/navigation";
    import SvgEmail from "$components/assets/svg/SvgEmail.svelte";
    import { formAuth, type FormAuth } from "$lib/api/modules/auth/auth.form.svelte";
    import validateInputs from "$lib/sanitizers/validateFormats";
    import storageService from "$lib/utils/storageService";
    import sinalizador from "$lib/utils/signal.svelte";
    import toast from "$lib/utils/toast.svelte";
    import AuthController from "$lib/api/modules/auth/auth.controller.svelte";

    const authController = new AuthController()

    let lembrarSenha = $state<boolean>(false)
    let form = $state<FormAuth>(formAuth)
    let loading = $state<boolean>(false)

    async function logar(){
        if(validateEmail() || form.senha.length===0)
            return sinalizador.sendSignal("validarInputs")
        loading=true
		let [response,error] = await authController.login(form)

		if(error){
            if(error.statusCode === 403) {
                storageService.storeData('astronfy-email', form.email)
                storageService.storeData('astronfy-senha', form.senha)
                toast.push('Mensagem do sistema', 'valide seu e-mail para fazer login.')
                return goto('/autenticacao')
            } else {
                loading=false
                return toast.error("Falha ao autenticar",error.message)
            }
		}

		storageService.storeData("astronfy-user", {...response,email:form.email})
		storageService.storeData("astronfy-token", response.token)

        
    }

    const validateEmail = () => {
        if(validateInputs.email(form.email)){
            return ""
        }
        return "E-mail não é valido"
    }
    const validateSenha = () => {
        if(form.senha.length>0){
            return ""
        }
        return "Insira sua senha"
    }

</script>


<div class="flex flex-col w-[440px] items-center relative">

    <div class="absolute top-[-600px] left-[-900px] anim">
        <img src="/images/emoji-star.png" class="z-20 loop-anim w-[440px]" alt="">
    </div>
    
    <div class="user-gradient rounded-full w-[96px] aspect-square flex justify-center items-center">
        <div class="rounded-full border border-soft-200 shadow-sm w-[64px] aspect-square bg-white-0 flex justify-center items-center">
            <SvgDefaultUser variacao="normal"  props={{ class:"fill-primary-dark" }}/>
        </div>
    </div>

    <h5 class="mt-2">Fazer Login</h5>
    <span class="text-[16px] text-sub-600">Insira os seus dados</span>
    <div class="flex flex-col gap-[12px] w-full">
        <Input Icon={SvgEmail} validate={validateEmail} disabled={loading} placeholder="email@email.com.br" label="E-mail" mandatory={true} bind:value={form.email}/>
        <Password onEnter={logar}  placeholder="Insira sua senha" disabled={loading} validate={validateSenha} bind:value={form.senha} label="Senha" mandatory={true} />
    </div>

    <div class="flex items-center w-full justify-between text-[14px] mt-2">

        <button class="flex gap-2 items-center group" onclick={()=>lembrarSenha=!lembrarSenha}>
            <Check checked={lembrarSenha}/>
            Lembrar senha
        </button>

        <Link action={()=>goto("recuperar-conta")}>
            Esqueceu a senha?
        </Link>
    </div>

    <div class="grid grid-cols-1 w-full h-[40px] mt-3">
        <Botao tema="primary-gradient"  onClick={logar} loading={loading}>
            Login
        </Botao>
    </div>

    <div class="grid grid-cols-1 w-full h-[40px] mt-3">
        <Botao tema="transparent"  onClick={()=>goto("/cadastro")}>
            Criar conta
        </Botao>
    </div>
</div>