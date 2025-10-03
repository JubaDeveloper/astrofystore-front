<script lang="ts">
    import SvgCaret from "$components/assets/svg/SvgCaret.svelte";
    import Pesquisa from "$components/elements/search/Pesquisa.svelte";
    import handleDate from "$lib/sanitizers/time";
    import PaginacaoCompleta from "$components/elements/pagination/PaginacaoCompleta.svelte";
    import LoaderMinhocaExpend from "$components/assets/loading/LoaderMinhocaExpend.svelte";
    import Header from "$components/sections/header/Header.svelte";
    import { denunciaAdminController, DenunciaLojistaController } from "$lib/api/modules/denuncias/denuncias.controller";
    import { DenunciaMotivosDto, DenunciaStatusDto, DenunciaStatusLojistaDto, type DenunciaDto, type DenunciaLojistaDto } from "$lib/api/modules/denuncias/denuncias.dto";
    import Avatar from "$components/assets/avatar/Avatar.svelte";
    import avatarController from "$lib/api/modules/avatar/avatar.controller";
    import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
    import ListAvatar from "$components/elements/card/ListAvatar.svelte";
    import CardIconStatus from "$components/elements/card/CardIconStatus.svelte";
    import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
    import ModalDenuncia from "$components/sections/admin/denuncias/ModalDenuncia.svelte";
    import { untrack } from "svelte";
    import { idLoja } from "$lib/utils/rotas.svelte";
    import CardTempo from "$components/elements/card/CardTempo.svelte";
    import ModalDenunciaLojista from "$components/sections/lojista/denuncias/ModalDenunciaLojista.svelte";
    import { differenceInCalendarDays, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
    import CardTempoSimples from "$components/elements/card/CardTempoSimples.svelte";
    import BotaoDeslizante from "$components/assets/buttons/BotaoDeslizante.svelte";
    import { DevolucaoLojistaController } from "$lib/api/modules/pedido/devolucoes/devolucoes.controller";
    import type { DevolucaoLojistaDto } from "$lib/api/modules/pedido/devolucoes/devolucoes.dto";
    import sanitizar from "$lib/sanitizers/sanitizer";
    import dev from "$lib/settings/dev.svelte";
    import CardStatus from "$components/elements/card/CardStatus.svelte";
  import ModalDevolucaoLojista from "$components/sections/devolucoes/ModalDevolucaoLojista.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
    
    let lista = $state<DevolucaoLojistaDto[]>([]);
    let openModal = $state<boolean[]>([]);
    let filtros = $state({
      status:"PENDENTE",
      pesquisa:"",
      motivo:"",
    })
    let pagina = $state(1);
    let paginacao = $state({
      totalPaginas: 1,
      qtdPaginas: 10,
    });
    let loading = $state(false)

    const devolucaoController = new DevolucaoLojistaController(parseInt($idLoja))

    async function listar() {
      loading=true
      const [r, e] = await devolucaoController.listar({
        ...filtros,
        pagina,
        quantidade:paginacao.qtdPaginas
      });

      console.log(r,e)
      if (e) {
        return;
      }
      loading=false
      paginacao.totalPaginas = r.data.totalPaginas
      lista = r.data.resultado;
    }
  
    $effect(()=>{
      if(filtros){
          listar()
      }
    })

    $effect(()=>{
        if(sinalizador.signal.tipo==="reloadDevolucoes"){
            listar();
        }
    })
  </script>
  
  

<div class="flex flex-col justify-between grow h-full">
    <div class="flex flex-col gap-5">
      <Header  label="Devoluções" desc="Gerencie os pedidos de devolução"/>
      {@render filtrosSec()}
      {#if loading}
        <div class="flex flex-col w-full mt-5 items-center">
          <LoaderMinhocaExpend label="Procurando por denuncias" />
        </div>
      {:else if lista.length === 0}
        <div class="flex flex-col w-full items-center">
          <h5 class="font-semibold">Não encontramos nenhum pedido</h5>
          <span class="text-sub-600 text-[14px]">
            Tente alterar os filtros para encontrar algo
          </span>
        </div>
      {:else}
        <div class="overflow-y-auto flex flex-col">
          {@render tabela()}
        </div>
      {/if}
    
    </div>
  
    {#if lista.length!==0}
      <PaginacaoCompleta
      bind:qtdPaginas={paginacao.qtdPaginas}
      bind:pagina
      totalPaginas={paginacao.totalPaginas}
      onSelecionarQuantidade={listar}
      onSelecionarPagina={listar}
      />
    {/if}
    
</div>
  
  
  {#snippet tabela()}
    {@const headers = [
      {
        colSpan: "col-span-2",
        label: "Cliente",
      },
      {
        colSpan: "col-span-2",
        label: "Produto"
      },
      {
        colSpan: "col-span-1",
        label: "Feita a",
      },
      {
        colSpan: "col-span-1",
        label: "Valor",
      },
      {
        colSpan: "col-span-2",
        label: "Status",
      },
    ]}
    <div class="flex flex-col gap-2 pb-5 w-full">
      <div
        class="w-full px-3 py-[8px] text-[14px] font-light rounded-[8px] bg-weak-50 text-sub-600 grid grid-cols-8 gap-8"
      >
        {#each headers as h, i}
          <div class="flex items-center gap-2 {h.colSpan}">
            <p class="text-sub-600 text-14 font-normal">{h.label}</p>
          </div>
        {/each}
      </div>
      {#each lista as devolucao, i}
        <button
          onclick={() => (openModal[i] = true)}
          class="w-full py-2 px-3 gap-8 hover:bg-soft-200/25 items-center grid grid-cols-8 text-sub-600 text-[14px] rounded-[8px]"
        >
          <div
            class="flex items-center gap-2 {headers[0].colSpan}"
          >
            <div class="shrink-0">
                <Avatar 
                src={""} 
                name={"C"} rounded="rounded-[4px]"/>    
            </div>
            <span class="truncate">
                Cliente Mockado
            </span>
          </div>
          <div
          class="flex items-center gap-2 {headers[1].colSpan}"
        >
          <div class="shrink-0">
              <Avatar 
              src={""} 
              name={devolucao.produto} rounded="rounded-[4px]"/>    
          </div>
          <span class="truncate">
            {devolucao.produto}
          </span>
        </div>
          <div class="flex {headers[2].colSpan}">
            {#if true}
                {@const dateNot = new Date(devolucao.criadoEm)}
                {@const datePrev = (()=>{
                    const d = new Date()
                    return d
                })()}
                <CardTempoSimples  modo="passado" diffDays={differenceInDays(datePrev,dateNot)} diffHours={differenceInHours(datePrev,dateNot)}
                diffMinutes={differenceInMinutes(datePrev,dateNot)}/>
            {/if}
          </div>
          <div class="flex justify-between gap-2 text-strong-950 text-[14px] {headers[3].colSpan}">
            R$ {sanitizar.centavosToReais(devolucao.valor)}
            </div>
          <div class="flex justify-between gap-2 text-[14px] {headers[4].colSpan}">
            <CardIconStatus status={devolucao.status}/>
            <div
              class="flex-col py-2 px-2 flex items-center justify-center text-center rounded-md"
            >
              <SvgCaret
                props={{
                  class: "-rotate-90",
                }}
              />
            </div>
          </div>
        </button>
        <ModalDevolucaoLojista idPedido={devolucao.id} bind:open={openModal[i]}/>
      {/each}
    </div>
  {/snippet}
  
  {#snippet filtrosSec()}
    <div class="flex w-full justify-between items-center gap-4">
        <BotaoDeslizante opcoes={[
            {
                label:"Solicitados",
                value:"PENDENTE"
            },
            {
                label:"Aprovados",
                value:"APROVADO"
            },
            {
                label:"Negados",
                value:"NEGADO"
            }
        ]} bind:value={filtros.status} onChange={()=>{
            pagina=1
            listar()
        }}/>
        <Pesquisa
            onSearch={() => {
              pagina=1
              listar()
            }}
            placeholder={"Digite o nome de um produto"}
            bind:value={filtros.pesquisa}
            maxWidth="max-w-[300px]"
        />
        
    </div>
  {/snippet}
  