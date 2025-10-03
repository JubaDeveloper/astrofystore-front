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
  import { ClientesController } from "$lib/api/modules/clientes/clientes.controller";
  import sanitizar from "$lib/sanitizers/sanitizer";
  import BotaoDeslizante from "$components/assets/buttons/BotaoDeslizante.svelte";
  
    let lista = $state<any[]>([]);
    let openModal = $state<boolean[]>([]);
    let filtros = $state({
      status:"",
      pesquisa:"",
      motivo:"PRODUTOS_ILEGAIS",
    })
    let pagina = $state(1);
    let paginacao = $state({
      totalPaginas: 1,
      qtdPaginas: 10,
    });
    let loading = $state(false)

    const clienteController = new ClientesController(parseInt($idLoja))

    async function listar() {
      loading=true
      const [r, e] = await clienteController.listar({
        pagina,
        quantidade:paginacao.qtdPaginas
      });

      console.log(r,e)
      if (e) {
        return;
      }
      loading=false
      paginacao.totalPaginas = r.data.totalPaginas
      lista = [1,2,3]
    }
  
    $effect(()=>{
      if(filtros){
          listar()
      }
    })
  </script>
  
  

<div class="flex flex-col justify-between grow h-full">
    <div class="flex flex-col gap-5">
      {@render filtrosSec()}
      {#if loading}
        <div class="flex flex-col w-full mt-5 items-center">
          <LoaderMinhocaExpend label="Procurando por pedidos" />
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
        label: "Pedido",
      },
      {
        colSpan: "col-span-1",
        label: "Total"
      },
      {
        colSpan: "col-span-1",
        label: "Data e hora",
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
                <ListAvatar
                maskSize = "circle at 40px,transparent 13px"
                size="w-8"
                users={lista.map((obj) => {
                  return {
                    name: "Nome",
                    src:"",
                  };
                })}
              />
            </div>
          </div>
          <div
            class="flex flex-col items-start justify-start {headers[1].colSpan}"
          >
            R$ {sanitizar.centavosToReais(555)}
        </div>
          <div class="flex flex-col {headers[2].colSpan} text-left text-strong-950 text-[14px] font-normal">
            {handleDate.formatISODate(new Date().toISOString())}
            <span class="text-sub-600 text-[12px]">
                às  {handleDate.formatISODate(new Date().toISOString(),"hh':'mm")}
            </span>
          </div>
          <div class="flex justify-between gap-2 {headers[3].colSpan}">
            <CardIconStatus status="ATIVO"/>
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
        <BotaoDeslizante opcoes={[
            {
                label:"Todos",
                value:"",
            },
            {
                label:"Realizados",
                value:"realizados"
            },
            {
                label:"Recusados",
                value:"recusados"
            }
        ]} bind:value={filtros.status}/>
        
        <Pesquisa
            onSearch={() => {
              pagina=1
            }}
            placeholder={"Digite o nome de um produto"}
            bind:value={filtros.pesquisa}
            maxWidth="max-w-[400px]"
        />        
    </div>
  {/snippet}
  