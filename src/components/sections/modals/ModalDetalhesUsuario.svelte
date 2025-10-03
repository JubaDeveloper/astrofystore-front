<script lang="ts">
    import Avatar from "$components/assets/avatar/Avatar.svelte";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import FillText from "$components/assets/limiter/FillText.svelte";
    import SidePop from "$components/assets/modals/SidePop.svelte";
    import SvgBanir from "$components/assets/svg/SvgBanir.svelte";
    import CardInfoGo from "$components/elements/card/CardInfoGo.svelte";
    import { ListarUsuarios } from "$lib/api/modules/usuarios/usuarios.controller.svelte";
    import handleText from "$lib/sanitizers/text";
    import toast from "$lib/utils/toast.svelte";
    import { fade, fly } from "svelte/transition";

    let listarUsuarios = new ListarUsuarios()

    interface Props{
        open:boolean,
        dados:any,
        click:VoidFunction,
    }

    let {open = $bindable(), dados, click}:Props = $props()
    
    let queroBanir = $state<boolean>(false)
    let loading = $state<boolean>(false)

    $effect(() => {
        if (!open) {
            queroBanir = false;
        }
    });

    async function banir(idUsuario:number, status:string) {
        loading = true
        const [res, err] = await listarUsuarios.banirUsuario(idUsuario, status)
        if(err) return toast.alert('Mensagem do sistema:', err.message)
        loading = false
        click()
        open = false
    }
</script>

<SidePop bind:open label="Detalhes de usuario" {loading}>

    <FillText texto={handleText.capitalizeFirstLetter(dados.perfil) ?? '--'}/>
    
    <div class="flex items-center gap-3 px-4 my-4">
        <Avatar  size="w-[48px]" src="" name={dados.nome ?? 'Usuário'}/>
        <div class="flex flex-col">
            <b class="text-[18px] font-medium">{dados.nome ?? '--'}</b>
            <span class="text-[14px] text-sub-600">Desde {dados.cadastro ?? '--'}</span>
        </div>
    </div>
    
    <FillText texto="DADOS"/>
    
    <div class="px-4 flex flex-col gap-2 mt-4 mb-4 w-full">
        {@render agrupamentoValor("CPF", dados.cpf ?? '--')}
        <div class="w-full h-[1px] bg-soft-200"></div>
        {@render agrupamentoValor("DATA DE NASCIMENTO", dados.nascimento ?? '--')}
        <div class="w-full h-[1px] bg-soft-200"></div>
        {@render agrupamentoValor("E-MAIL", dados.email ?? '--')}
        <div class="w-full h-[1px] bg-soft-200"></div>
        {@render agrupamentoValor("TELEFONE", dados.telefone ?? '--')}    
    </div>
    
    {#if dados.status === 'ATIVO'}
        {#if !queroBanir}
            {@render lojasSec()}
        {/if}

        {#if !queroBanir}
            <div class="w-full h-[1px] bg-soft-200"></div>
            <div class="grid h-[40px] w-full px-4 my-4">
                <Botao tema="red-transparent-inverted" onClick={()=>queroBanir=true}>
                    <SvgBanir/>
                    Banir Assinante
                </Botao>    
            </div>
        {/if}

        {#if queroBanir}
            {@render banirGroup()}
        {/if}
    {/if}

</SidePop>

{#snippet banirGroup()}
    <div class="px-4 absolute bottom-[20px]" in:fly={{x:800,duration:800}} out:fly={{x:-400,duration:800}}>
        <div class="flex flex-col w-full p-5 border border-soft-200 rounded-[8px]">
            <span class="text-[18px] leading-6 mb-1 font-medium">Tem certeza que deseja banir esse cliente?</span>
            <p class="text-[12px] text-sub-600 ">O usuário não terá mais o acesso vinculado a nenhuma loja da All in Hall.</p>
            <div class="grid grid-cols-2 gap-x-2 h-[40px] mt-2">
                <Botao tema="gray-transparent" onClick={()=>queroBanir=false}>
                    Cancelar
                </Botao>    
                <Botao tema="red" onClick={()=> banir(dados.id, 'INATIVO')}>
                    Banir Cliente
                </Botao>    
            </div>
        </div>    
    </div>
{/snippet}

{#snippet lojasSec()}
    <div class="flex flex-col w-full"transition:fade>
        <FillText texto="LOJAS"/>
        <div class="flex flex-col gap-2 px-4 my-4 w-full">
            <CardInfoGo label="Nome fantasia da loja" desc="Nome da loja" action={()=>{}}>
                <Avatar src="" name="Loja"/>
            </CardInfoGo>
            <CardInfoGo label="Nome fantasia da loja" desc="Nome da loja" action={()=>{}}>
                <Avatar src="" name="Loja"/>
            </CardInfoGo>
        </div>    
    </div>
{/snippet}

{#snippet agrupamentoValor(label:string, valor:string)}
    <div class="flex flex-col">
        <span class="text-soft-400 text-[12px] font-normal">{label}</span>
        <b class="text-[14px] font-medium">{valor}</b>
    </div>
{/snippet}