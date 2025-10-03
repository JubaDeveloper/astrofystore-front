<script lang="ts">
    import SvgDefaultUser from "$components/assets/svg/SvgDefaultUser.svelte";
    import Input from "$components/assets/input/Input.svelte";
    import SvgEmail from "$components/assets/svg/SvgEmail.svelte";
    import Password from "$components/assets/input/Password.svelte";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import toast from "$lib/utils/toast.svelte";
    import CadastroController from "$lib/api/modules/cadastro/cadastro.controller.svelte";
    import CheckProgress from "$components/elements/progress/CheckProgress.svelte";
    import validacaoInputNormalizada from "$lib/utils/input.svelte";
    import Check from "$components/assets/checkboxs/Check.svelte";
    import { goto } from "$app/navigation";
    import { formCadastro, formCadastroCliente, type FormCadastro, type FormCadastroCliente } from "$lib/api/modules/cadastro/cadastro.form.svelte";
    import storageService from "$lib/utils/storageService";
    import domainManager from "$lib/settings/domain.svelte";
    
    let form = $state<FormCadastroCliente>(formCadastroCliente)

    let auxForm = $state<{
        repetirSenha:string,
    }>({
        repetirSenha:"",
    })
    
    let loading = $state<boolean>(false)
    
    const cadastroController = new CadastroController()

    const cadastrar = async()=>{
        loading=true

        if(!form.aceitouTermos){
            loading = false
            return toast.push(`Mensagem do sistema`, 'Aceite os termos de política para prosseguir.')
        }

        form.lojaId = domainManager.lojaId!
        delete form.aceitouTermos
        const [r,e] = await cadastroController.cadastroCliente(form)

        if(e){
            loading=false
            return toast.error("Erro no cadastro", e.message)
        }

        toast.push("Notificação do sistema", r.message)
        loading = false
        goto("/login")
    }
</script>

<div class="w-full h-full overflow-y-auto py-4 px-4 gap-2 flex flex-col items-center rounded-[16px]">
    <div class="w-[440px] flex flex-col items-center">
        <div class="user-gradient rounded-full w-[96px] aspect-square flex justify-center items-center">
            <div class="rounded-full border border-soft-200 shadow-sm w-[64px] aspect-square bg-white-0 flex justify-center items-center">
                <SvgDefaultUser variacao="normal"  props={{
                    class:"fill-primary-dark"
                }}/>
            </div>
        </div>
        <div class="flex flex-col items-center">
            <h5 class="mt-2">Dados Cadastrais</h5>
            <span class="text-[16px] text-sub-600">
                Preencha seus dados para criar uma conta.
            </span>    
        </div>
    
        <div class="flex flex-col gap-2 w-full">
            <Input Icon={SvgDefaultUser} label="Nome" placeholder="Digite seu nome" bind:value={form.nome}/>
            <Input Icon={SvgEmail} label="Email" placeholder="email@email.com.br" bind:value={form.email}/>
    
            <Password bind:value={form.senha} label="Senha" mandatory={true} placeholder="Digite sua senha"/>
    
            <Password bind:value={auxForm.repetirSenha} 
                validate={()=>validacaoInputNormalizada.Igual(form.senha,auxForm.repetirSenha,"Senhas não são iguais") } 
                label="Confirmação de senha" mandatory={true} 
                placeholder="Digite sua senha"
            />
    
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
        </div>
    
        <div class="grid gap-x-4 w-full h-[40px]">
            <button class="text-14 font-normal text-strong-950 flex items-center gap-2" onclick={()=> form.aceitouTermos = !form.aceitouTermos}>
                <Check checked={form.aceitouTermos ?? false}/>
                Li e concordo com as <span class="underline"> Políticas da Plataforma</span>
            </button>
        </div>
        
        <div class="grid gap-x-4 w-full h-[40px]">
            <Botao onClick={cadastrar} tema="primary-gradient" loading={loading}>
                Continuar
            </Botao>
        </div>
    
    </div>
</div>

<style>
    .user-gradient{
        background: linear-gradient(180deg, rgba(113, 119, 132, 0.10) 0%, rgba(113, 119, 132, 0.00) 100%);
    }
</style>