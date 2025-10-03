<script lang="ts">
    import Avatar from '$components/assets/avatar/Avatar.svelte';
    import SvgCaret from '$components/assets/svg/SvgCaret.svelte';
    import CardStatus from '$components/elements/card/CardStatus.svelte';
    import PaginacaoCompleta from '$components/elements/pagination/PaginacaoCompleta.svelte';
    import Tabela from '$components/elements/tabela/Tabela.svelte';
    import ModalDetalhesUsuario from '$components/sections/modals/ModalDetalhesUsuario.svelte';
    import LoaderSmooth from '$components/elements/loading/LoaderSmooth.svelte';
    import Botao from '$components/assets/buttons/Botao.svelte';
    import SvgPlus from '$components/assets/svg/SvgPlus.svelte';
    import SvgOlhoAberto from '$components/assets/svg/SvgOlhoAberto.svelte';
    import SvgCheck from '$components/assets/svg/SvgCheck.svelte';
  import { goto } from '$app/navigation';
  import PopUp from '$components/assets/modals/PopUp.svelte';
  import SvgAlerta from '$components/assets/svg/SvgAlerta.svelte';
  import SvgDiscord from '$components/assets/svg/SvgDiscord.svelte';
  import type { LojaFromListaDto } from '$lib/api/modules/lojas/lojas.dto';
  import { LojaController } from '$lib/api/modules/lojas/lojas.controller';
  import toast from '$lib/utils/toast.svelte';
  import handleDate from '$lib/sanitizers/time';
    import { onMount } from 'svelte';
    import sanitizar from '$lib/sanitizers/sanitizer';
    import SvgIconPix from '$components/assets/svg/SvgIconPix.svelte';
    import { consoleDev, copiarTexto } from '$lib/utils/utils.svelte';

    let loading = $state()
    let lojas = $state<LojaFromListaDto[]>([])
    let paginacao = $state({
        pagina:1,
        totalPaginas:1,
        quantidade: 10
    })

    let open = $state<boolean>(false)

    const lojaC = new LojaController()

    async function buscarDadostabela(){
        loading=true
        const [r,e] = await lojaC.listar({
            pagina:paginacao.pagina,
            quantidade:paginacao.quantidade
        })
        loading=false
        if(e){
            return toast.error("Erro no sistema",e.message)
        }
        lojas = r.resultado
        paginacao.totalPaginas = r.totalPaginas   
        consoleDev(r)
    }

    onMount(()=>buscarDadostabela())

</script>


<div class="flex flex-col gap-4 h-full max-h-full">
    <div class="border-b border-soft-200 pb-5 flex items-center justify-between">
        <div class="flex flex-col">
            <span class="text-[18px] font-medium">
                Gestão de lojas
            </span>
            <p class="text-[14px] text-sub-600">
                Descrição maneira
            </p>
        </div>
        <div class="grid h-[40px]">
            <Botao tema={'primary'} onClick={()=>goto("/cadastrar-lojas")}>
                Criar nova Loja
                <SvgPlus props={{ class:"fill-white-0" }} />
            </Botao>

        </div>
    </div>
    <div class="flex flex-col justify-between gap-2 grow">
        {#if !loading}
            
            <div class="flex flex-col overflow-y-auto h-0 grow ">
                {@render tabelaLojas()}
            </div>

        {:else}
            <div class="grow flex items-center justify-center">
                <LoaderSmooth cor="black" tamanho="w-10"/>
            </div>
        {/if}
        <PaginacaoCompleta 
                bind:qtdPaginas={paginacao.quantidade} 
                bind:pagina={paginacao.pagina} 
                totalPaginas={paginacao.totalPaginas} 
                onSelecionarPagina={buscarDadostabela} 
        />  
    </div>
</div>

{#snippet tabelaLojas()}
    {@const header = [
        {
            label:"Loja",
            colSpan:"col-span-4"
        },
        {
            label:"Estatísticas",
            colSpan:"col-span-1"
        },
        {
            label:"Visibilidade",
            colSpan:"col-span-1"
        },
        {
            label:"Status",
            colSpan:"col-span-1"
        }
    ]}
    {#if lojas.length > 0}
        <Tabela gridCols="grid-cols-7" header={header}> 
            {#each lojas as loja,i}
                <div class="flex items-center hover:bg-weak-50 px-3 rounded-[8px] gap-3">
                    <button class="border border-soft-200 hover:border-strong-950 rounded-[8px]" onmousedown={()=> copiarTexto(loja.url)}>
                        <SvgIconPix/>
                    </button>
                    <div class="w-full py-2  gap-8 items-center grid grid-cols-7 text-[14px] " role="button" tabindex="0" onmousedown={()=>goto(`/loja/${loja.id}/dashboard`)}>
                        <div class="flex gap-2 {header[0].colSpan}">
                            <Avatar src={loja.logo} size="w-[40px]" name={loja.nome}/>
                            <div class="flex flex-col items-start">
                                <b class="text-[14px] font-medium">{loja.nome}</b>
                                <span class="text-sub-600 text-[12px]">
                                    Criada em {handleDate.formatISODate(new Date().toISOString(),"dd 'de' MMM',' yyyy")}
                                </span>
                            </div>
                        </div>
                        <div class="flex flex-col {header[1].colSpan}">
                            <p class="text-14 font-normal text-strong-950">{sanitizar.reais(loja.estatisticas.totalFaturamento.toString())}</p>
                            <span class="text-12 font-medium text-sub-600">{loja.estatisticas.totalClientes} clientes</span>
                        </div>
                        <div class="flex w-full {header[2].colSpan}">
                            <CardStatus status={loja.status}>
                                <SvgOlhoAberto props={{width: 12}}/>
                            </CardStatus>
                        </div>
                        <div class="flex items-center justify-between w-full pr-6 {header[3].colSpan}">
                            <CardStatus status={loja.status}>
                                <SvgCheck props={{width: 12}}/>
                            </CardStatus>
                            <div class="p-2">
                                <!-- onclick={()=>{open=true}} -->
                                <SvgCaret props={{class:"rotate-[-90deg]"}}/>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="h-[1px] w-full bg-soft-200 my-2"></div>
            {/each}
        </Tabela>
    {:else}
        {@render zeroLojas()}
    {/if}
{/snippet}



{#snippet zeroLojas()}
    <div class="flex flex-col w-full h-full items-center justify-center">
        <img src="/images/anxious-face.png" alt="">
        <div class="flex flex-col items-center mb-5">
            <b class='font-medium text-[20px]'>
                Você ainda não tem uma loja
            </b>
            <span class="text-[14px] font-normal text-sub-600">
                Crie uma loja e aproveite todos os benefícios da Astronfy!
            </span>
        </div>              
        
        <Botao tema={'primary'} onClick={()=>{}}>
            Criar nova Loja
            <SvgPlus />
        </Botao>

    </div>
{/snippet}


<PopUp bind:open withCloseButton={false}>
    <div class="flex flex-col max-w-[440px]">


        <div class="flex items-start gap-4">
            <div class="p-2 rounded-md bg-error-light">
                <SvgAlerta props={{
                    width:22,
                    class:"fill-error-base"
                }}/>
            </div>
            <div class="flex flex-col gap-[2px] text-[16px]"> 
                <b class="font-medium leading-5 ">Loja bloqueada por fraude</b>
                <p class="text-[14px] text-sub-600 leading-5 font-normal">Entre em contato com nosso suporte via discord para mais informações.</p>
            </div>
        </div>

        <div class="relative h-3 mt-3">
            <div class="absolute left-[-50%] w-[200%] h-[1px] bg-soft-200">

            </div>    
        </div>
        <div class="grid grid-cols-2 w-full h-[40px] gap-x-2">
            <Botao onClick={()=>open = false} tema="gray-transparent">
                Fechar
            </Botao>
            <Botao onClick={()=>{}} tema="discord">
                <div class="p-1 aspect-square flex items-center bg-white rounded-md">
                    <SvgDiscord props={{
                        class:"file"
                    }}/>
                </div>
                Contactar Suporte
            </Botao>
        </div>

        
    </div>
</PopUp>
