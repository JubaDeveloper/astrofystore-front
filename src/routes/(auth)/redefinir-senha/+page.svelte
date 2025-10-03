<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import Password from "$components/assets/input/Password.svelte";
    import SvgKey from "$components/assets/svg/SvgKey.svelte";
    import CheckProgress from "$components/elements/progress/CheckProgress.svelte";
    import AuthController from "$lib/api/modules/auth/auth.controller.svelte";
    import query from "$lib/api/query";
    import sinalizador from "$lib/utils/signal.svelte";
    import toast from "$lib/utils/toast.svelte";
    import { onMount } from "svelte";

    let form = $state({
        token:"",
        senha:"",
        repetirSenha:""
    })

    let loading = $state(false)

    const validateSenhasIguais = () => {
        if(form.senha===form.repetirSenha){
            return ""
        }
        return "Senhas não são identicas"
    }

    const validateSenha = () => {
        if(!/[A-Z]/.test(form.senha) ||  !/\d/.test(form.senha) || form.senha.length<7){
            return "Senha não é forte suficiente"
        }
        return ""
    }

    const salvar = async() => {
        if(validateSenha() || validateSenhasIguais()){
            sinalizador.sendSignal("validarInputs")
            return
        }
        const authController = new AuthController()
        loading=true
        const [r,e] = await authController.redefinirSenha({
            token:form.token,
            senha:form.senha
        })
        loading=false
        if(e){
            return toast.error("Notificação do sistema",e.message)
        }

        toast.success("Notificação do sistema","Senha alterada com sucesso")
        return goto("/login")
    }

    onMount(()=>{
        if(!query.getQueryKey("token")){
            goto("/login")
        }
        form.token = query.getQueryKey("token")!
    })

</script>

<div class="w-[440px] flex flex-col items-center">
<div class="w-full overflow-hidden py-4 items-center flex flex-col rounded-[16px]">
    
    <div class="user-gradient rounded-full w-[96px] aspect-square flex justify-center items-center">
        <div class="rounded-full border border-soft-200 shadow-sm w-[64px] aspect-square bg-white-0 flex justify-center items-center">
            <SvgKey props={{
                class:"fill-primary-dark"
            }}/>
        </div>
    </div>

    <h5 class="mt-2">Redefinir Senha</h5>
    <span class="text-[16px] text-sub-600">Digite sua nova senha e, em seguida, confirme-a.</span>
    
    <div class="flex flex-col w-full px-4 gap-2 mt-3">
        <Password bind:value={form.senha} disabled={loading} label="Senha" validate={validateSenha} mandatory={true}
        placeholder="@Senha123"/>
    
        <Password bind:value={form.repetirSenha} onEnter={salvar} disabled={loading} validate={validateSenhasIguais} label="Repetir senha" mandatory={true} 
        placeholder="@Senha123"/>
        <CheckProgress 
            label="Sua senha deve conter:"
            steps={(()=>{
                return [
                    {
                        label: "1 letra maiúscula",
                        pass: /[A-Z]/.test(form.senha), 
                        color: "bg-error-base"
                    },
                    {
                        label: "1 número",
                        pass: /\d/.test(form.senha),
                        color: "bg-warning-base"
                    },
                    {
                        label: "8 caracteres",
                        pass: form.senha.length>7,
                        color:"bg-success-base"
                    }
                ];
        })()}
        />
        
        <div class="grid h-[40px] mt-2">

            <Botao onClick={salvar} {loading} tema="primary-gradient">
                Salvar
            </Botao>
        
        </div>
    
    </div>
</div>
</div>

<style>
    .user-gradient{
        background: linear-gradient(180deg, rgba(113, 119, 132, 0.10) 0%, rgba(113, 119, 132, 0.00) 100%);
    }
</style>
