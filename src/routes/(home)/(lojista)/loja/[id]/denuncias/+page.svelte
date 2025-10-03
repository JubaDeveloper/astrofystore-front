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
  import { differenceInCalendarDays, differenceInDays } from "date-fns";
  import CardTempoSimples from "$components/elements/card/CardTempoSimples.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
  
    let lista = $state<DenunciaLojistaDto[]>([]);
    let openModal = $state<boolean[]>([]);
    let filtros = $state({
      status:"",
      pesquisa:"",
      motivo:"",
    })
    let pagina = $state(1);
    let paginacao = $state({
      totalPaginas: 1,
      qtdPaginas: 10,
    });
    let loading = $state(false)

    const denunciaController = new DenunciaLojistaController(parseInt($idLoja))

    async function listar() {
      loading=true
      const [r, e] = await denunciaController.listar({
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
      if(sinalizador.signal.tipo==="reloadDenuncias"){
        listar()
      }
    })
  </script>
  
  

<div class="flex flex-col justify-between grow h-full">
    <div class="flex flex-col gap-5">
      <Header  label="Denuncias" desc="Visualize e gerencia as denuncias da plataforma"/>
      {@render filtrosSec()}
      {#if loading}
        <div class="flex flex-col w-full mt-5 items-center">
          <LoaderMinhocaExpend label="Procurando por denuncias" />
        </div>
      {:else if lista.length === 0}
        <div class="flex flex-col w-full items-center">
          <h5 class="font-semibold">Não encontramos nenhuma denuncia</h5>
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
        colSpan: "col-span-3",
        label: "Produto denunciado",
      },
      {
        colSpan: "col-span-1",
        label: "Prazo para resposta"
      },
      {
        colSpan: "col-span-1",
        label: "Data de denúncia",
      },
      {
        colSpan: "col-span-2",
        label: "Status",
      },
    ]}
    <div class="flex flex-col gap-2 pb-5 w-full">
      <div
        class="w-full px-3 py-[8px] text-[14px] font-light rounded-[8px] bg-weak-50 text-sub-600 grid grid-cols-7 gap-8"
      >
        {#each headers as h, i}
          <div class="flex items-center gap-2 {h.colSpan}">
            <p class="text-sub-600 text-14 font-normal">{h.label}</p>
          </div>
        {/each}
      </div>
      {#each lista as denuncia, i}
        <button
          onclick={() => (openModal[i] = true)}
          class="w-full py-2 px-3 gap-8 hover:bg-soft-200/25 items-center grid grid-cols-7 text-sub-600 text-[14px] rounded-[8px]"
        >
          <div
            class="flex items-center gap-2 {headers[0].colSpan}"
          >
            <div class="shrink-0">
                <Avatar 
                src={denuncia.produto.imagens[0] ? new ProdutoController().pegarImagem(denuncia.produto.produtoId,denuncia.produto.imagens[0].id) : ""} 
                name={denuncia.produto.nome} rounded="rounded-[4px]"/>    
            </div>
            <span class="truncate">
                {denuncia.produto.nome}
            </span>
          </div>
          <div
            class="flex flex-col items-start justify-start {headers[1].colSpan}"
          >
          {#if true}
            {@const dateNot = new Date(denuncia.notificadoEm)}
            {@const datePrev = (()=>{
              const d = new Date(dateNot)
              d.setDate(d.getDate()+denuncia.prazoResposta)
              return d
            })()}
            <CardTempoSimples diffDays={differenceInDays(datePrev,dateNot)} diffHours={0} diffMinutes={0}/>
          {/if}
        </div>
          <div class="flex {headers[2].colSpan}">
            {handleDate.formatISODate(denuncia.criadoEm as string)}
          </div>
          <div class="flex justify-between gap-2 {headers[3].colSpan}">
            <CardIconStatus status={denuncia.status}/>
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
        <ModalDenunciaLojista bind:open={openModal[i]} idDenuncia={denuncia.id}/>
      {/each}
    </div>
  {/snippet}
  
  {#snippet filtrosSec()}
    <div class="flex w-full justify-between items-center gap-4">
        <Pesquisa
            onSearch={() => {
              pagina=1
            }}
            placeholder={"Digite o nome de um produto"}
            bind:value={filtros.pesquisa}
            maxWidth="grow "
        />

        <SelectBlock placeholder="Motivo" options={DenunciaMotivosDto} onSelect={()=>{
            pagina=1
        }} bind:value={filtros.motivo} focusCss="relative w-[160px]"/>

        <SelectBlock placeholder="Status" options={DenunciaStatusLojistaDto} onSelect={()=>{
            pagina=1
        }} bind:value={filtros.status} focusCss="relative w-[160px]"/>
        
    </div>
  {/snippet}
  