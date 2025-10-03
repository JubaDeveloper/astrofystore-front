<script lang="ts">
    import SvgCaret from "$components/assets/svg/SvgCaret.svelte";
    import Pesquisa from "$components/elements/search/Pesquisa.svelte";
    import sanitizar from "$lib/sanitizers/sanitizer";
    import handleDate from "$lib/sanitizers/time";
    import BotaoDeslizante from "$components/assets/buttons/BotaoDeslizante.svelte";
    import { sanitizeUrl } from "$lib/utils/utils.svelte";
    import NomeItem from "$components/elements/tabela/componentes/nomeItem.svelte";
    import PaginacaoCompleta from "$components/elements/pagination/PaginacaoCompleta.svelte";
    import LoaderMinhocaExpend from "$components/assets/loading/LoaderMinhocaExpend.svelte";
    import Header from "$components/sections/header/Header.svelte";
    import { denunciaAdminController, DenunciaLojistaController } from "$lib/api/modules/denuncias/denuncias.controller";
    import { DenunciaMotivosDto, DenunciaStatusDto, type DenunciaDto, type DenunciaLojistaDto } from "$lib/api/modules/denuncias/denuncias.dto";
    import Avatar from "$components/assets/avatar/Avatar.svelte";
    import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
    import CardIconStatus from "$components/elements/card/CardIconStatus.svelte";
    import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
    import { idLoja } from "$lib/utils/rotas.svelte";
    import ModalDenunciaLojista from "$components/sections/lojista/denuncias/ModalDenunciaLojista.svelte";
  import { ClientesController } from "$lib/api/modules/clientes/clientes.controller";
  import type { ClienteDto } from "$lib/api/modules/clientes/clientes.dto";
  import avatarController from "$lib/api/modules/avatar/avatar.controller";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import SvgBell from "$components/assets/svg/SvgBell.svelte";
  import { goto } from "$app/navigation";
    
    let lista = $state<ClienteDto[]>([]);
    let openModal = $state<boolean[]>([]);
    let filtros = $state({
      status:"",
      pesquisa:"",
      ordenarPor:""
    })
    let pagina = $state(1);
    let paginacao = $state({
      totalPaginas: 1,
      qtdPaginas: 10,
    });
    let loading = $state(false)

    const clienteController = new ClientesController(parseInt($idLoja));
    async function listar() {
      loading=true
      const [r, e] = await clienteController.listar({
        ...filtros,
        pagina,
        quantidade:paginacao.qtdPaginas
      });
      console.log(r,e)
      if (e) {
        return;
      }
      loading=false
      lista = r.data.resultado;
      paginacao.totalPaginas = r.data.totalPaginas
    }
  
    $effect(()=>{
      if(filtros){
          listar()
      }
    })
  </script>
  
  

<div class="flex flex-col justify-between grow h-full">
    <div class="flex flex-col gap-5">
      <Header  label="Gestão de Clientes" desc="Visualize os clientes da sua loja"/>
      {@render filtrosSec()}
      {#if loading}
        <div class="flex flex-col w-full mt-5 items-center">
          <LoaderMinhocaExpend label="Procurando por cliente" />
        </div>
      {:else if lista.length === 0}
        <div class="flex flex-col w-full items-center">
          <h5 class="font-semibold">Não encontramos nenhum cliente</h5>
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
        colSpan: "col-span-7",
        label: "Nome",
      },
      {
        colSpan: "col-span-1",
        label: "Compras",
      },
      {
        colSpan: "col-span-2",
        label: "Status",
      },
    ]}
    <div class="flex flex-col gap-2 pb-5 w-full">
      <div
        class="w-full px-3 py-[8px] text-[14px] font-light rounded-[8px] bg-weak-50 text-sub-600 grid grid-cols-10 gap-8"
      >
        {#each headers as h, i}
          <div class="flex items-center gap-2 {h.colSpan}">
            <p class="text-sub-600 text-14 font-normal">{h.label}</p>
          </div>
        {/each}
      </div>
      {#each lista as cliente, i}
        <button
          onclick={() => goto(`/loja/${$idLoja}/clientes/${cliente.clienteId}`)}
          class="w-full py-2 px-3 gap-8 hover:bg-soft-200/25 items-center grid grid-cols-10 text-sub-600 text-[14px] rounded-[8px]"
        >
          <div
            class="flex items-center gap-2 {headers[0].colSpan}"
          >
            <div class="shrink-0">
                <Avatar name={cliente.nome} src={avatarController.url("USUARIO",cliente.id)}/>
            </div>
            <div class="flex flex-col text-left">
                <b>
                    {cliente.nome}
                </b>
                <span class="truncate">
                    Cadastrado em {handleDate.formatISODate(cliente.criadoEm)}
                </span>
    
            </div>
          </div>
          <div class="flex {headers[1].colSpan} flex-col  text-left">
            <b>
                R${sanitizar.centavosToReais(cliente.totalPedidos)}
            </b>
            <span>
                {cliente.quantidadeItensPedidos} pedido(s)
            </span>
          </div>
          <div class="flex justify-between gap-2 {headers[2].colSpan}">
            <CardIconStatus status={cliente.status}/>
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
      {/each}
    </div>
  {/snippet}
  
  {#snippet filtrosSec()}
    <div class="flex w-full justify-between items-center gap-4">
        <BotaoDeslizante opcoes={[
            {
                label:"Todos",
                value:""

            },
            {
            label:"Ativos",
            value:"ATIVO"
            },
            {
            label:"Bloqueados",
            value:"INATIVO"
            },
        ]} bind:value={filtros.status}/>
        <div class="flex items-center gap-3">
            <Pesquisa
            onSearch={() => {
              pagina=1
            }}
            placeholder={"Digite o nome de um cliente"}
            bind:value={filtros.pesquisa}
            maxWidth="max-w-[300px]"
            />
            <SelectBlock placeholder="Ordenar por" options={[
                {
                    label:"Quantidade de Pedidos",
                    value:"QTD_PEDIDOS"
                },
                {
                    label:"Total de compras",
                    value:"TOT_COMPRAS"
                }
            ]} onSelect={()=>{
                pagina=1
            }} bind:value={filtros.ordenarPor} focusCss="relative w-[210px]"/>
        </div>

    </div>
  {/snippet}
  
{#snippet btnsTop()}
<div class="flex items-center gap-4">
    <div class="grid h-[40px] w-[150px]">
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