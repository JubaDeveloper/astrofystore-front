<script lang="ts">
    import SvgQuestionario from "$components/assets/svg/SvgQuestionario.svelte";
    import SelectCidade from "$components/sections/select/SelectCidade.svelte";
    import SvgLocalizacao from "$components/assets/svg/SvgLocalizacao.svelte";
    import SvgDesmarcado from "$components/assets/svg/SvgDesmarcado.svelte";
    import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
    import SvgMarcado from "$components/assets/svg/SvgMarcado.svelte";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import toast from "$lib/utils/toast.svelte";
    import api from "$lib/api/api";

    import { estadosOptions } from "$lib/utils/values/estados";
    import { goto } from "$app/navigation";

    let passo = $state<number>(1)

    let form = $state({
        estado: '',
        cidade: '',
        ondeConheceu: ''
    })

    let questionario = [
        {
            icon:'/images/google.png',
            label: 'Google',
            valor: 'google'
        },
        {
            icon:'/images/telegram.png',
            label: 'Telegram',
            valor: 'telegram'
        },
        {
            icon:'/images/instagram.png',
            label: 'Instagram',
            valor: 'instagram'
        },
        {
            icon:'/images/indicacao.png',
            label: 'Indicação',
            valor: 'indicacao'
        },
        {
            icon:'/images/outro.png',
            label: 'Outro',
            valor: 'outro'
        },
    ]

    async function  salvarPesquisa() {
        let body = form

        const [res, err] = await api.put('/pesquisa-marketing', body)

        if(err) return toast.error('Mensagem do sistema', err.message)

        toast.success('Mensagem do sistema', 'Redirecionando usuário...')

        goto('/gestao-de-lojas')
    }
</script>

{#if passo === 1}
    <div class="flex flex-col justify-center items-center border border-soft-200 rounded-2xl p-6 gap-6 max-w-[440px]">
        <SvgLocalizacao />
        <div class="flex flex-col text-center">
            <p class="text-20 font-medium text-strong-950">Qual a sua localização?</p>
            <p class="text-16 font-medium text-sub-600">Fique tranquilo, utilizamos dados de localização apenas para achar pessoas como você interessadas em nossa plataforma.</p>
        </div>
        <div class="flex flex-col gap-4 w-full">
            <div class="flex flex-col gap-1">
                <p class="text-14 font-medium text-strong-950">Estado</p>
                <SelectBlock bind:value={form.estado} options={estadosOptions} placeholder="Selecione seu estado"/>
            </div>
            <div class="flex flex-col gap-1">
                <p class="text-14 font-medium text-strong-950">Cidade</p>
                <SelectCidade uf={form.estado} bind:value={form.cidade}/>
            </div>
        </div>
        <div class="flex flex-col w-full gap-6">
            <Botao tema={form.estado !== '' && form.cidade !== '' ? "primary-gradient" : "desabilitado"} onClick={()=> passo++}>
                Continuar
            </Botao>
            <button class="underline text-14 font-medium text-sub-600" onclick={()=> goto('/gestao-de-lojas')}>
                Responder depois
            </button>
        </div>
    </div>
{:else}
    <div class="flex flex-col justify-center items-center border border-soft-200 rounded-2xl p-6 gap-6 max-w-[440px]">
        <SvgQuestionario/>
        <div class="flex flex-col text-center">
            <p class="text-20 font-medium text-strong-950">Como você nos conheceu?</p>
            <p class="text-16 font-medium text-sub-600">Conta pra gente o que fez você chegar até aqui.</p>
        </div>
        <div class="flex flex-col gap-4 w-full">
            {#each questionario as {icon, label, valor}, i}
                <button class="flex items-center justify-between border border-soft-200 rounded-[10px] py-2.5 px-3 hover:bg-weak-50" onclick={()=> form.ondeConheceu = valor}>
                    <div class="flex items-center gap-1">
                        <img src={icon} alt="img">
                        <p class="text-14 font-medium text-sub-600">{label}</p>
                    </div>
                    
                    {#if form.ondeConheceu === valor}
                        <SvgMarcado/>
                    {:else}
                        <SvgDesmarcado/>
                    {/if}
                </button>
            {/each}
        </div>
        <div class="flex flex-col w-full gap-6">
            <Botao tema={ form.ondeConheceu !== '' ? "primary-gradient" : "desabilitado"}  onClick={()=> salvarPesquisa()}>
                Finalizar
            </Botao>
            <button class="underline text-14 font-medium text-sub-600" onclick={()=> goto('/gestao-de-lojas')}>
                Responder depois
            </button>
        </div>
    </div>
{/if}