<script lang="ts">
    import Botao from "$components/assets/buttons/Botao.svelte";
    import SvgEmailCheck from "$components/assets/svg/SvgEmailCheck.svelte";
    import BlockInput from "$components/assets/input/BlockInput.svelte";
    import storageService from "$lib/utils/storageService";
    import CadastroController from "$lib/api/modules/cadastro/cadastro.controller.svelte";
    import toast from "$lib/utils/toast.svelte";
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";
    
    const cadastroController = new CadastroController()

    let token = $state<string>('');
    let email = $state<string>('');
    let loading = $state<boolean>(false);
    let tempoRestante = $state<number>(59);
    let intervaloContador: number;

    const tempoFormatado = $derived(tempoRestante.toString().padStart(2, '0'));
    const tempoAcabou = $derived(tempoRestante <= 0);

    function iniciarContador() {
        tempoRestante = 59;
        
        if (intervaloContador) clearInterval(intervaloContador);
        
        intervaloContador = setInterval(() => {
            tempoRestante--;
            
            if (tempoRestante <= 0) {
                clearInterval(intervaloContador);
            }
        }, 1000);
    }

    onMount(() => {
        iniciarContador();
        email = storageService.getStoredData('astronfy-email');
        return () => intervaloContador && clearInterval(intervaloContador);
    });

    async function enviar() {
        const [res, err] = await cadastroController.validarEmail(email, token)

        if(err){
            loading=false
            return toast.error("Erro na validação", err.message)
        }

        toast.success('Mensagem do sistema', res.message)

        goto('/cadastro-concluido')
    }

    async function reenviarCodigo() {
        const [res, err] = await cadastroController.reenviarCod(email)

        if(err){
            loading=false
            return toast.error("Erro no cadastro", err.message)
        }

        iniciarContador()
        token = ''

        toast.success('Mensagem do sistema', 'Código reenviado, verifique o e-mail cadastrado.')
    }

</script>

<div class="flex flex-col gap-2 w-full items-center justify-center">
    <div class="user-gradient rounded-full w-[96px] aspect-square flex justify-center items-center">
        <div class="rounded-full border border-soft-200 shadow-sm w-[64px] aspect-square bg-white-0 flex justify-center items-center">
            <SvgEmailCheck props={{
                class: "fill-primary-dark"
            }}/>
        </div>
    </div>
    <div class="flex flex-col text-center items-center">
        <h5 class="text-24 font-medium text-strong-950">
            Dê uma olhada no seu e-mail
        </h5>
        <span class="text-16 text-sub-600 font-medium">
            A gente enviou um código de 6 dígitos para o
        </span>
        <button class="text-16 text-sub-600 font-medium">
            {email}
        </button>
    </div>
    <div class="flex flex-col gap6">
        <div class="flex flex-col gap-[12px] w-full items-center mt-2">
            <BlockInput qtd={6} bind:value={token}/>
        </div>
        
        <div class="grid grid-cols-1 w-full h-[40px] mt-5">
            <Botao tema={token.length === 6 ? "primary-gradient" : "desabilitado"} onClick={enviar} loading={loading}>
                Verificar
            </Botao>
        </div>
        
        <div class="self-stretch inline-flex justify-between items-start mt-5">
            <div class="text-center justify-start text-sub-600 text-sm font-normal">Não recebeu o código?</div>
            <div class="flex justify-start items-center gap-1">
                {#if tempoAcabou}
                    <button onclick={reenviarCodigo} class="text-14 font-medium text-strong-950 underline">
                        Reenviar
                    </button>
                {:else}
                    <div class="justify-start text-soft-400 text-sm font-medium leading-tight">Reenviar em 00:{tempoFormatado}</div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .user-gradient{
        background: linear-gradient(180deg, rgba(113, 119, 132, 0.10) 0%, rgba(113, 119, 132, 0.00) 100%);
    }
</style>