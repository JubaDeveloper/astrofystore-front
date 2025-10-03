<script lang="ts">
  import SvgCaret from "$components/assets/svg/SvgCaret.svelte";
  import Pesquisa from "$components/elements/search/Pesquisa.svelte";
  import sanitizar from "$lib/sanitizers/sanitizer";
  import handleDate from "$lib/sanitizers/time";
  import BotaoDeslizante from "$components/assets/buttons/BotaoDeslizante.svelte";
  import { sanitizeUrl } from "$lib/utils/utils.svelte";
  import { devolucaoClienteController } from "$lib/api/modules/pedido/devolucoes/devolucoes.controller";
  import type { DevolucaoDto } from "$lib/api/modules/pedido/devolucoes/devolucoes.dto";
  import NomeItem from "$components/elements/tabela/componentes/nomeItem.svelte";
  import PaginacaoCompleta from "$components/elements/pagination/PaginacaoCompleta.svelte";
  import LoaderMinhocaExpend from "$components/assets/loading/LoaderMinhocaExpend.svelte";
  import handleText from "$lib/sanitizers/text";

  let lista = $state<DevolucaoDto[]>([]);
  let openModal = $state<boolean[]>([true]);
  let filtros = $state({
    status:"PENDENTE",
    pesquisa:""
  })
  let pagina = $state(1);
  let paginacao = $state({
    totalPaginas: 1,
    qtdPaginas: 10,
  });
  let loading = $state(false)

  async function listar() {
    loading=true
    const [r, e] = await devolucaoClienteController.listar({
      ...filtros,
      quantidade:paginacao.qtdPaginas,
      pagina
    });
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
    {@render filtrosSec()}
    {#if loading}
      <div class="flex flex-col w-full mt-5 items-center">
        <LoaderMinhocaExpend label="Procurando seus pedidos" />
      </div>
    {:else if lista.length === 0}
      <div class="flex flex-col w-full items-center">
        <h5 class="font-semibold">Não encontramos a sua devolução</h5>
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
      colSpan: "col-span-4",
      label: "Produto",
    },
    {
      colSpan: "col-span-1",
      label: "Motivo",
    },
    {
      colSpan: "col-span-1",
      label: "Data",
    },
    {
      colSpan: "col-span-1",
      label: "Valor",
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
    {#each lista as devolucao, i}
      <button
        onclick={() => (openModal[i] = true)}
        class="w-full py-2 px-3 gap-8 hover:bg-soft-200/25 items-center grid grid-cols-7 text-sub-600 text-[14px] rounded-[8px]"
      >
        <div class="flex gap-2 items-center {headers[0].colSpan}">
          <NomeItem
            nome={devolucao.produto}
            email=""
            url={sanitizeUrl(devolucao.imagemUrl)}
          />
        </div>
        <div
          class="flex flex-col items-start justify-start {headers[1].colSpan}"
        >
          <b class="font-medium text-strong-950 text-left">
            {handleText.snakeCaseConvert(devolucao.motivo.toLowerCase())}
          </b>
        </div>
        <div
          class="flex flex-col items-start justify-start {headers[2].colSpan}"
        >
          <b
            class="text-strong-950 font-normal bg-weak-50 p-0.5 px-1 rounded-lg"
          >
            {handleDate.formatISODate(
              devolucao.criadoEm,
              `dd 'de' MMMM','yyyy'`
            )}
          </b>
        </div>
        <div class="flex justify-between gap-2 {headers[3].colSpan}">
          R${sanitizar.centavosToReais(devolucao.valor)}
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
    <BotaoDeslizante 
    onChange={()=>{
      pagina=1
    }}
    bind:value={filtros.status} opcoes={[
      { label: "Solicitados", value: "PENDENTE" },
      { label: "Em processo", value: "EM_PROCESSAMENTO" },
      { label: "Aprovados", value: "APROVADO" },
      { label: "Negados", value: "NEGADO" }
    ]}/>
    <Pesquisa
      onSearch={() => {
        pagina=1
      }}
      placeholder={"Digite o nome de um produto"}
      bind:value={filtros.pesquisa}
      maxWidth="max-w-[300px] "
    />
  </div>
{/snippet}
