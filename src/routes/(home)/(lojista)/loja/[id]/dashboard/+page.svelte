<script lang="ts">
  import { afterNavigate, goto, onNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import BotaoDeslizante from "$components/assets/buttons/BotaoDeslizante.svelte";
  import BarLateral from "$components/assets/graphics/chartjs/BarLateral.svelte";
  import LinesGrafico from "$components/assets/graphics/chartjs/LinesGrafico.svelte";
  import Stackedbar from "$components/assets/graphics/chartjs/Stackedbar.svelte";
  import LinhaStacked from "$components/assets/graphics/linhazinha/LinhaStacked.svelte";
  import LoaderMinhocaExpend from "$components/assets/loading/LoaderMinhocaExpend.svelte";
  import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
  import SvgDescolado from "$components/assets/svg/historico/SvgDescolado.svelte";
  import SvgDinheiro from "$components/assets/svg/historico/SvgDinheiro.svelte";
  import SvgEnjoado from "$components/assets/svg/historico/SvgEnjoado.svelte";
  import SvgPresente from "$components/assets/svg/historico/SvgPresente.svelte";
  import SvgSeAchou from "$components/assets/svg/historico/SvgSeAchou.svelte";
  import SvgSad from "$components/assets/svg/min/SvgSad.svelte";
  import SvgAlien from "$components/assets/svg/SvgAlien.svelte";
  import SvgBell from "$components/assets/svg/SvgBell.svelte";
  import SvgCaret from "$components/assets/svg/SvgCaret.svelte";
  import SvgEmojiEstrelado from "$components/assets/svg/SvgEmojiEstrelado.svelte";
  import SvgMaoPidona from "$components/assets/svg/SvgMaoPidona.svelte";
  import BolinhaStatus from "$components/elements/card/BolinhaStatus.svelte";
  import CardTempo from "$components/elements/card/CardTempo.svelte";
  import BubbleWrapper from "$components/elements/wrappers/BubbleWrapper.svelte";
  import LabelSoft from "$components/elements/wrappers/LabelSoft.svelte";
  import Header from "$components/sections/header/Header.svelte";
  import { DashController } from "$lib/api/modules/dashboard/dashboard.controller";
  import type { RelatorioPedidoDto, TicketDashDto, VendasDashDto } from "$lib/api/modules/dashboard/dashboard.dto";
  import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
  import sanitizar from "$lib/sanitizers/sanitizer";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import { setDate } from "date-fns";
  import { onMount } from "svelte";
  
  type Product = {
    categoria: string;
    nome: string;
    preco: number;
    produtoId: number;
    vendas: number;
    imagens:{id:number,arquivoId:number}[]
  };

  let filtroRelatorio = $state("total")

  let filtroFaturamento = $state("total")
  let filtroTicket = $state("ticket")
  let filtroProdutos = $state("maisVendidos")

  let relatorioPedidos = $state<RelatorioPedidoDto>() 
  let graficosTickets =  $state<TicketDashDto>()
  let graficosClientes = $state<{
    clienteId:number,
    contato:string,
    nome:string,
    totalGasto:number
  }[]>()
  let vendas = $state<VendasDashDto>()
  let produtos = $state<{
        maisVendidos:Product[],
        menosVendidos:Product[]
  }>()
  let faturamentoGrafico =  $state<{
    categoria:string,
    total:number
  }[]>()
  let estoque = $state<{
    baixo:number,
    esgotado:number,
    ilimitado:number,
    ok:number,
    total:number
  }>()
  let loadingTickets = $state(true)

  let statusGrafico = $derived.by(()=>{
    if(!estoque) return []
    const tmp = [
        {
            bg:"bg-purple-600",
            value:estoque.ilimitado,
            label:"Ilimitado"
        },
        {
            bg:"bg-success-base",
            value:estoque.ok,
            label:"Ok"
        },
        {
            bg:"bg-yellow-600",
            value:estoque.baixo,
            label:"Baixo"
        },
        {
            bg:"bg-error-base",
            value:estoque.esgotado,
            label:"Esgotado"
        },    
    ]
    const filtered =  tmp.filter(item => item.value !== 0);
        console.log(filtered)
    return filtered
  })

  let dashController:DashController = new DashController(parseInt($idLoja))

  async function mountPedidos(){
    relatorioPedidos=undefined
    const [r,e] = await dashController.pegarGraficoPedidos({
        periodo: filtroRelatorio
    })
    relatorioPedidos = r.data
  }

  async function mountTickets(){
    let r,e
    graficosTickets=undefined
    graficosClientes=undefined
    loadingTickets=true;
    [r,e] = await dashController.pegarGraficoTicket()
    graficosTickets = r.data;
    [r,e] = await dashController.pegarClientesLista()
    console.log(r.data)
    graficosClientes = r.data
    loadingTickets=false
  }

  async function mountVendas(){
    const [r,e] = await dashController.pegarRelatoVendas()
    vendas = r.data
  }

  async function mountProdutos(){
    const [r,e] = await dashController.pegarRelatoProdutos()
    produtos = r.data
  }

  async function mountFaturamento(){
    const [r,e] = await dashController.pegarFaturamento({
        periodo:filtroFaturamento
    })
    faturamentoGrafico = r.data
  }

  async function mountEstoque(){
    const [r,e] = await dashController.pegarEstoque()
    estoque = r.data
  }

  $effect(()=>{
    if(filtroTicket){
        mountTickets()
    }
  })

  $effect(()=>{
    if(filtroRelatorio){
        mountPedidos()
    }
  })

  $effect(()=>{
    if(filtroFaturamento){
        mountFaturamento()
    }
  })

  
  $effect(()=>{
    if(page.url.pathname){
        dashController = new DashController(parseInt($idLoja))
        mountProdutos()
        mountVendas()
        mountEstoque()
        mountFaturamento()
        mountPedidos()
        mountTickets()

    }
  })


</script>

<div class="flex flex-col gap-5">
    <Header  label="Dashboard" desc="Visão geral da loja" snippetRight={btnsTop}/>
    <div class="grid grid-cols-3 gap-4 max-w-[1980px]">
        <div class="col-span-2 flex flex-col gap-2">
            {@render relatorio()}
            <div class="grow grid grid-cols-2 gap-4 w-full">
                {@render vendasLista()}
                {@render relatorioLista()}
            </div>
        </div>
        <div class="h-full flex flex-col gap-4">
            {@render tickets()}
            {@render faturamento()}
            {@render status()}
        </div>
    </div>
</div>


{#snippet status()}
<BubbleWrapper css="row-span-1  flex flex-col gap-4 px-5 p-3 h-[200px]">
    <div class="flex items-center justify-between border-b border-soft-200 pb-4">
        <div class="flex items-center gap-2">
            <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.00999 0.0900269L17.9191 1.36353L19.1917 10.2735L10.9189 18.5463C10.7501 18.715 10.5212 18.8098 10.2826 18.8098C10.0439 18.8098 9.81506 18.715 9.64629 18.5463L0.736286 9.63633C0.567562 9.46755 0.472778 9.23867 0.472778 9.00003C0.472778 8.76138 0.567562 8.5325 0.736286 8.36373L9.00999 0.0900269ZM9.64629 1.99983L2.64519 9.00003L10.2826 16.6365L17.2828 9.63633L16.3288 2.95383L9.64629 1.99983ZM11.5543 7.72743C11.2167 7.38967 11.027 6.93163 11.0271 6.45406C11.0271 6.21759 11.0738 5.98344 11.1643 5.76499C11.2548 5.54654 11.3875 5.34806 11.5547 5.18088C11.722 5.0137 11.9205 4.88109 12.139 4.79064C12.3575 4.70019 12.5916 4.65365 12.8281 4.65369C13.3057 4.65378 13.7637 4.84357 14.1013 5.18133C14.4389 5.51908 14.6286 5.97712 14.6285 6.4547C14.6284 6.93227 14.4386 7.39024 14.1008 7.72788C13.7631 8.06551 13.305 8.25514 12.8275 8.25506C12.3499 8.25497 11.8919 8.06518 11.5543 7.72743Z" fill="#525866"/>
            </svg>
            Status do produto
        </div>
        <Botao tema="gray-transparent" onClick={()=>{
            goto(`/loja/${idLoja}/produtos`)
        }}>
            Ver mais
        </Botao>
    </div>
    {#if statusGrafico.length===0}
        <span class="text-sub-600 flex flex-col h-full items-center justify-center">
            <SvgSad/>
            No momento esta loja não possui produtos.
        </span>
    {:else}
        <p class="text-[16px] font-medium">
            12 produtos 
            <span class="text-sub-600">
                esgotados 😱
            </span>
        </p>
        <LinhaStacked dataset={statusGrafico}/>
    {/if}
</BubbleWrapper>
{/snippet}

{#snippet faturamento()}
<BubbleWrapper css="row-span-2 flex flex-col gap-4 px-5 p-3 grow">
    <div class="flex items-center justify-between  border-b border-soft-200 pb-4">
        <div class="flex items-center gap-2">
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.375 3.25C5.375 2.42157 4.70343 1.75 3.875 1.75C3.04657 1.75 2.375 2.42157 2.375 3.25C2.375 4.07843 3.04657 4.75 3.875 4.75C4.70343 4.75 5.375 4.07843 5.375 3.25ZM6.875 3.25C6.875 4.90686 5.53186 6.25 3.875 6.25C2.21814 6.25 0.875 4.90686 0.875 3.25C0.875 1.59314 2.21814 0.25 3.875 0.25C5.53186 0.25 6.875 1.59314 6.875 3.25ZM14.75 1H8.75V2.5H14.75V1ZM14.75 6.25H8.75V7.75H14.75V6.25ZM14.75 11.5H8.75V13H14.75V11.5ZM3.875 12.25C3.04657 12.25 2.375 11.5785 2.375 10.75C2.375 9.92155 3.04657 9.25 3.875 9.25C4.70343 9.25 5.375 9.92155 5.375 10.75C5.375 11.5785 4.70343 12.25 3.875 12.25ZM3.875 13.75C5.53186 13.75 6.875 12.4068 6.875 10.75C6.875 9.09317 5.53186 7.75 3.875 7.75C2.21814 7.75 0.875 9.09317 0.875 10.75C0.875 12.4068 2.21814 13.75 3.875 13.75ZM3.875 4C4.28921 4 4.625 3.66421 4.625 3.25C4.625 2.83579 4.28921 2.5 3.875 2.5C3.46079 2.5 3.125 2.83579 3.125 3.25C3.125 3.66421 3.46079 4 3.875 4Z" fill="#525866"/>
            </svg>                            
            Faturamento x Categorias
        </div>
        <SelectBlock placeholder="Anual" bind:value={filtroFaturamento} options={[
            {
                label:"Total",
                value:"total"
            },
            {
                label:"Anual",
                value:"anual"
            },
            {
                label:"Semestral",
                value:"semestral"
            },

            {
                label:"Mensal",
                value:"mensal"
            }
        ]}  
        focusCss="relative ml-4 h-[36px] w-[140px]"/>
    </div>
    {#if faturamentoGrafico}
        <div class="w-full grow">
            {#if faturamentoGrafico.length===0}
                <span class="text-sub-600 flex flex-col items-center grow h-full justify-center">
                    <SvgSad/>
                    No momento esta loja não tem registro de faturamentos.
                </span>
            {:else}
                <BarLateral
                labels={faturamentoGrafico.map((obj)=>obj.categoria)}
                data={[
                {
                    label: "Faturamento",
                    bgColor: "#775CFF",
                    value: faturamentoGrafico.map((obj)=>obj.total),
                },
                
                ]}
                />
            {/if}       
        </div>
    {:else}
        <div class="grow w-full flex items-center justify-center">
            <LoaderMinhocaExpend label="Carregando dados de faturamento"/>
        </div>
    {/if}

</BubbleWrapper>
{/snippet}

{#snippet tickets()}
<BubbleWrapper css="row-span-3 flex flex-col gap-4 px-5 p-3 h-[319px]">
    <BotaoDeslizante opcoes={[
        {
            label:"Ticket Médio",
            value:"ticket"
        },
        {
            label:"Cliente",
            value:"cliente"
        },
    ]} bind:value={filtroTicket}/>
    {#if !loadingTickets && graficosTickets}
        {#if filtroTicket==="ticket"}
        <div class="flex justify-between items-center">
            <div class="flex items-center  grow gap-3">
                <div class="flex items-center justify-center bg-weak-50 w-[40px] aspect-square rounded-full">
                    <SvgAlien/>
                </div>
                <LabelSoft  label="Novos">
                    <b class="font-medium text-[14px] leading-3">
                        R$ {sanitizar.centavosToReais(graficosTickets.ticketMedioNovo)}
                    </b>
                </LabelSoft>
            </div>
            <div class="flex items-center grow gap-3">
                <div class="flex items-center justify-center bg-warning-lighter w-[40px] aspect-square rounded-full">
                    <SvgEmojiEstrelado/>
                </div>
                <LabelSoft  label="Fiéis">
                    <b class="font-medium text-[14px] leading-3">
                        R$ {sanitizar.centavosToReais(graficosTickets.ticketMedioFiel)}
                    </b>
                </LabelSoft>
            </div>
        </div>
        {/if}
    <div class="w-full h-[175px]">
        {#if filtroTicket==="ticket"}
            <LinesGrafico
            labels={graficosTickets.meses.map((obj)=>{
                return `${obj.ano}/${obj.mesIndex}`
            }).reverse()
            
            
            }
            data={[
            {
                label: "Novos",
                bgColor: "#775CFF",
                value: graficosTickets.meses.map((obj)=>{
                    return obj.relatorio[0].faturado
                }).reverse(),
            },
            {
                label: "Fiéis",
                bgColor: "#FF8447",
                value: graficosTickets.meses.map((obj)=>{
                    return obj.relatorio[1].faturado
                }).reverse(),
            }
            ]}
            />
        {:else if graficosClientes}
            <div class="flex flex-col gap-4 overflow-y-auto h-[319px]">
            {#each graficosClientes as cliente,i}
                <div class="flex justify-between gap-4 items-center">
                    <div class="flex items-center gap-2 shrink-0">
                        <div class="flex items-center justify-center bg-weak-50 w-[40px] aspect-square rounded-full shrink-0">
                            {#if i===0}
                                <SvgDescolado/>
                            {:else if i===1}
                                <SvgDinheiro/>
                            {:else}
                                <SvgSeAchou/>
                            {/if}
                        </div>
                        <div class="flex flex-col">
                            <b class="text-[14px] font-medium truncate w-[100%">{cliente.nome}</b>
                            <span class="text-[12px] text-sub-600 truncate w-[100%]">
                                {cliente.contato}
                            </span>
                        </div>
                    </div>                                            
                    <span class="text-sub-600 text-[12px] shrink-0">
                        R$ {sanitizar.centavosToReais(cliente.totalGasto)}
                    </span>
                </div>
            {/each}
            </div>
        {/if}
    </div>
    {#if filtroTicket==="cliente"}
        <div class="grid w-full h-[40px]">
            <Botao tema="gray-transparent" onClick={()=>{
                goto(`/loja/${$idLoja}/clientes`)
            }}>
                Ver mais
            </Botao>
        </div>
    {/if}
    {:else}
        <div class="grow w-full flex items-center justify-center">
            <LoaderMinhocaExpend label="Carregando dados de tickets"/>
        </div>
    {/if}
</BubbleWrapper>
{/snippet}
{#snippet relatorioLista()}
<BubbleWrapper css="flex flex-col gap-4 px-5 p-3">
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
            <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.400024 5.50001L8.00052 0.433012C8.14842 0.334337 8.32223 0.281677 8.50002 0.281677C8.67782 0.281677 8.85163 0.334337 8.99953 0.433012L16.6 5.50001V18.1C16.6 18.3387 16.5052 18.5676 16.3364 18.7364C16.1676 18.9052 15.9387 19 15.7 19H1.30002C1.06133 19 0.832411 18.9052 0.663628 18.7364C0.494846 18.5676 0.400024 18.3387 0.400024 18.1V5.50001ZM2.20002 6.46301V17.2H14.8V6.46301L8.50002 2.26361L2.20002 6.46301ZM4.90002 13.6H12.1V15.4H4.90002V13.6ZM4.90002 10.9H12.1V12.7H4.90002V10.9ZM8.50002 9.10001C8.02263 9.10001 7.5648 8.91037 7.22723 8.5728C6.88967 8.23524 6.70002 7.7774 6.70002 7.30001C6.70002 6.82262 6.88967 6.36478 7.22723 6.02722C7.5648 5.68965 8.02263 5.50001 8.50002 5.50001C8.97741 5.50001 9.43525 5.68965 9.77282 6.02722C10.1104 6.36478 10.3 6.82262 10.3 7.30001C10.3 7.7774 10.1104 8.23524 9.77282 8.5728C9.43525 8.91037 8.97741 9.10001 8.50002 9.10001Z" fill="#525866"/>
            </svg>                               
            Relátorio de produtos
        </div>
        <Botao tema="gray-transparent" onClick={()=>{}}>
            Ver mais
        </Botao>
    </div>
    {#if produtos}
    {@const listagemP = filtroProdutos==="maisVendidos" ? produtos.maisVendidos :  produtos.menosVendidos}
    <BotaoDeslizante opcoes={[
        {
            label:"Mais vendidos",
            value:"maisVendidos"
        },
        {
            label:"Menos vendidos",
            value:"menosVendidos"
        },
    ]} bind:value={filtroProdutos}/>
    <div class="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
        {#if listagemP.length===0}
            <span class="text-sub-600 h-[200px] flex flex-col items-center justify-center">
                <SvgSad/>
                Nenhum produto encontrado
            </span>
        {:else}
            {#each listagemP as p,i}
                <button class="flex justify-between items-center overflow-hidden text-left  " onclick={()=>{
                    goto("/")
                }}>
                    <div class="flex items-center gap-3">
                        <div class="flex items-center justify-center overflow-hidden p-1 border border-soft-200 w-[40px] aspect-square rounded-full">
                            <img src={p.imagens.length>0 
                            ? new ProdutoController().pegarImagem(p.produtoId,p.imagens[0].id) :
                            ""
                            } class="w-full aspect-square rounded-full" alt="">
                        </div>
                        <div class="flex flex-col">
                            <b class="text-[14px] font-medium truncate max-w-40">
                                {p.nome}
                            </b>
                            <span class="text-[12px] text-sub-600">
                                {p.categoria}
                            </span>
                        </div>
                    </div>    
                    <div class="flex items-center gap-2 shrink-0">
                        <div class="flex flex-col gap-0.5">
                            <b class="text-[14px] font-medium">
                                R$ {sanitizar.centavosToReais(p.preco)}
                            </b>
                            <span class="text-right text-[12px] text-sub-600">
                                X{p.vendas}
                            </span>
                        </div>
                        <SvgCaret props={{
                            class:"-rotate-90 fill-sub-600 w-2 h-2"
                        }}/>
                    </div>                                            
                </button>
            {/each}
        {/if}
    </div>
    {:else}
        <div class="grow w-full flex items-center justify-center">
            <LoaderMinhocaExpend label="Carregando produtos"/>
        </div>
    {/if}
</BubbleWrapper>
{/snippet}
{#snippet vendasLista()}
<BubbleWrapper css="flex flex-col gap-4 px-5 p-3 h-[464px]">
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
            <SvgMaoPidona/>
            Vendas
        </div>
        <Botao tema="gray-transparent" onClick={()=>{}}>
            Ver mais
        </Botao>
    </div>

    {#if vendas}
    <div class="flex flex-col gap-1 py-3 border-t border-b border-soft-200">
        <span class="text-[11px] font-normal text-sub-600">
            Última devolução
        </span>
        {#if vendas.ultimoCancelamento.nomeCliente}
            {@render emojiItemList(vendas.ultimoCancelamento.nomeCliente,vendas.ultimoCancelamento.itens,
                vendas.ultimoCancelamento.criadoEm)}
        {:else}
        <span class="text-sub-600 text-[12px] text-center my-2">
            Nada encontrado
        </span>
        {/if}
    </div>
    <div class="flex flex-col gap-2">
        <span class="text-[11px] font-normal text-sub-600">
            Pedidos
        </span>
        <div class="flex flex-col overflow-y-auto gap-4 max-h-[265px]">
            {#if vendas.ultimosPedidos.length==0}
                <span class="text-sub-600 text-[12px] text-center my-2 h-[200px] flex items-center justify-center">
                    No momento essa loja não teve nenhum pedido
                </span>
            {:else}
                {#each  vendas.ultimosPedidos as pedido}
                    {@render emojiItemList(pedido.nomeCliente,pedido.itens,pedido.criadoEm)}
                {/each}
            {/if}
        </div>
    </div>
    {:else}
        <div class="grow w-full flex items-center justify-center">
            <LoaderMinhocaExpend label="Carregando dados de venda"/>
        </div>
    {/if}
</BubbleWrapper>
{/snippet}

{#snippet relatorio()}
<BubbleWrapper css="flex flex-col gap-3 px-5 py-3 h-[378.4px]">
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.10003 4.5H9.90003V13.5H8.10003V4.5ZM11.7 8.1H13.5V13.5H11.7V8.1ZM4.50002 9.9H6.30002V13.5H4.50002V9.9ZM11.7 1.8H2.70002V16.2H15.3V5.4H11.7V1.8ZM0.900024 0.8928C0.900024 0.3996 1.30232 0 1.79912 0H12.6L17.1 4.5V17.0937C17.1009 17.2119 17.0784 17.3291 17.0339 17.4386C16.9895 17.5481 16.9239 17.6478 16.8409 17.7319C16.7579 17.8161 16.6591 17.8831 16.5503 17.9291C16.4414 17.9751 16.3245 17.9992 16.2063 18H1.79372C1.55736 17.9984 1.33114 17.9038 1.16392 17.7367C0.996701 17.5697 0.90191 17.3436 0.900024 17.1072V0.8928Z" fill="#525866"/>
            </svg>                            
            Relátorio de pedidos
        </div>
        <div class="flex items-center gap-5">
            <BolinhaStatus bg="bg-feature-base" label="Vendidos"/>
            <BolinhaStatus bg="bg-warning-base" label="Estornados"/>
            <SelectBlock placeholder="Anual" bind:value={filtroRelatorio} options={[
                {
                    label:"Total",
                    value:"total"
                },
                {
                    label:"Anual",
                    value:"anual"
                },
                {
                    label:"Semestral",
                    value:"semestral"
                },

                {
                    label:"Mensal",
                    value:"mensal"
                }
            ]}  
            focusCss="relative ml-4 h-[36px] w-[140px]"/>
        </div>
    </div>
    {#if relatorioPedidos}
    <div class="grid grid-cols-3 py-3 border-t border-b gap-8 border-soft-200">
        <div class="flex items-center gap-3 border-r border-soft-200">
            <div class="flex items-center justify-center bg-weak-50 w-[40px] aspect-square rounded-full">
                <SvgPresente/>
            </div>
            <LabelSoft  label="EM ESTOQUE">
                <b class="font-medium text-[16px]">
                    R$ {sanitizar.centavosToReais(relatorioPedidos.totEmEstoque)}
                </b>
            </LabelSoft>
        </div>
        <div class="flex items-center gap-3 border-r border-soft-200">
            <div class="flex items-center justify-center bg-weak-50 w-[40px] aspect-square rounded-full">
                <SvgDinheiro/>
            </div>
            <LabelSoft  label="VENDIDOS">
                <b class="font-medium text-[16px]">
                    R$ {sanitizar.centavosToReais(relatorioPedidos.totEmVendas)}
                </b>
            </LabelSoft>
        </div>
        <div class="flex items-center gap-3">
            <div class="flex items-center justify-center bg-weak-50 w-[40px] aspect-square rounded-full">
                <SvgEnjoado/>
            </div>
            <LabelSoft  label="ESTORNADOS">
                <b class="font-medium text-[16px]">
                    R$ {sanitizar.centavosToReais(relatorioPedidos.totDevolvido)}
                </b>
            </LabelSoft>
        </div>
    </div>
    <div class="w-full h-[220px] flex justify-center items-center">
        {#if Object.keys(relatorioPedidos.relatorio).length===0}
           <span class="text-sub-600 flex flex-col items-center justify-center">
                <SvgSad/>
                No momento esta loja não possui pedidos.
            </span>
        {:else}
            <Stackedbar
            labels={Object.keys(relatorioPedidos.relatorio).map((obj)=>{
            return obj
            })}
            data={[
                {
                label: "Vendidos",
                bgColor: "#775CFF",
                value: Object.keys(relatorioPedidos.relatorio).map((obj)=>{
                        return relatorioPedidos!.relatorio[obj].vendidos
                }),
                },
                {
                label: "Estornados",
                bgColor: "#FF8447",
                value: Object.keys(relatorioPedidos.relatorio).map((obj)=>{
                        return relatorioPedidos!.relatorio[obj].devolvidos
                }),

            },
            ]}
            />
        {/if}       
    </div>
    {:else}
        <div class="grow w-full flex items-center justify-center">
            <LoaderMinhocaExpend label="Carregando dados do relatorio"/>
        </div>
    {/if}
</BubbleWrapper>
{/snippet}



{#snippet btnsTop()}
    <div class="flex items-center gap-2">
        <div class="grid h-[40px]">
            <Botao onClick={()=>{

            }} tema="gray-transparent">
                Visualizar loja
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.05818 3.02003L1.49488 9.58333L0.416626 8.50508L6.97917 1.94177H1.19519V0.416666H9.58329V8.80476H8.05818V3.02003Z" fill="#525866"/>
                </svg>                
            </Botao>                
        </div>
        <div class="grid aspect-square h-[40px]">
            <Botao onClick={()=>{

            }} tema="gray-transparent">
                <SvgBell/>
            </Botao>                
        </div>

    </div>
{/snippet}


{#snippet emojiItemList(nome:string,desc:string,date:string)}
    <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
            <div class="flex items-center justify-center bg-weak-50 w-[40px] aspect-square rounded-full">
                <SvgEnjoado/>
            </div>
            <div class="flex flex-col">
                <b class="text-[14px] font-medium truncate max-w-40">{nome}</b>
                <span class="text-[12px] text-sub-600 truncate max-w-40">
                    {desc}
                </span>
            </div>
        </div>    
        <div class="flex ">
            <CardTempo dataPrevista={
                (()=>{
                    const date1 = new Date()
                    const date2 = new Date(date)
                    //@ts-ignore  
                    const diffTime = Math.abs(date1 - date2);
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
                    console.log(diffDays)
                    date1.setDate(date1.getDate()+diffDays);
                    console.log(date1)
                    return date1
                }
            )()
            } modo="passado"/>
        </div>                                            
    </div>
{/snippet}