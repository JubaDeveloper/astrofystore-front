<script lang="ts">
  import CardStatus from "$components/elements/card/CardStatus.svelte";
  import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
  import ListAvatar from "$components/elements/card/ListAvatar.svelte";
  import Pesquisa from "$components/elements/search/Pesquisa.svelte";
  import ModalPedidoDetalhes from "./ModalPedidoDetalhes.svelte";
  import SvgCaret from "$components/assets/svg/SvgCaret.svelte";
  import sanitizar from "$lib/sanitizers/sanitizer";
  import handleDate from "$lib/sanitizers/time";

  import { comprasController } from "$lib/api/modules/pedido/compras/compras.controller";
  import type { CompraDto } from "$lib/api/modules/pedido/compras/compras.dto";
  import { sanitizeUrl } from "$lib/utils/utils.svelte";
  import { untrack } from "svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import { goto } from "$app/navigation";
  import LoaderMinhocaExpend from "$components/assets/loading/LoaderMinhocaExpend.svelte";
  import Paginacao from "$components/elements/pagination/Paginacao.svelte";
  import PaginacaoCompleta from "$components/elements/pagination/PaginacaoCompleta.svelte";
  import storageService from "$lib/utils/storageService";
  import CardIconStatus from "$components/elements/card/CardIconStatus.svelte";

  const sttsList = [
    { label: "Pendente", value: "PENDENTE" },
    { label: "Aprovado", value: "APROVADO" },
    { label: "Cancelado", value: "CANCELADO" },
    { label: "Rejeitado", value: "REJEITADO" },
    { label: "Em disputa", value: "EM_DISPUTA" },
    { label: "Em análise", value: "EM_ANALISE" },
    { label: "Reembolsado", value: "REEMBOLSADO" },
  ];

  let lista = $state<CompraDto[]>([]);
  let openModal = $state<boolean[]>([]);
  let loading = $state(true);
  let pesquisa = $state("");
  let status = $state("");
  let pagina = $state(1);
  let paginacao = $state({
    totalPaginas: 1,
    qtdPaginas: 10,
  });

  async function listar() {
    loading = true;
    const [r, e] = await comprasController.listar({
      pesquisa,
      status,
      pagina,
      quantidade:paginacao.qtdPaginas
    });
    if (e) {
      return;
    }
    lista = r.data.resultado;
    paginacao.totalPaginas= r.data.totalPaginas
    console.log(lista)
    loading = false;
  }

  function handleOpen(index: number) {
    if (lista[index].status === "APROVADO") return (openModal[index] = true);
    else if (lista[index].status === "PENDENTE") {
      storageService.storeData("id-pedido-pendente", lista[index].id);
      goto("/finalizar-compra");
    }
  }

  listar();

  $effect(() => {
    if (pesquisa.length >= 0 || status.length >= 0) {
      listar();
    }
  });
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
        <h5 class="font-semibold">Não encontramos o seu pedido</h5>
        <span class="text-sub-600 text-[14px]">
          Tente alterar os filtros de suas compras
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
      label: "Pedido",
    },
    {
      colSpan: "col-span-1",
      label: "Total",
    },
    {
      colSpan: "col-span-1",
      label: "Data e hora",
    },
    {
      colSpan: "col-span-1",
      label: "Status",
    },
  ]}
  <div class="flex flex-col pb-5 w-full">
    <div
      class="w-full px-3 py-[8px] text-[14px] font-light rounded-[8px] bg-weak-50 text-sub-600 grid grid-cols-7 gap-8"
    >
      {#each headers as h, i}
        <div class="flex items-center gap-2 {h.colSpan}">
          <p class="text-sub-600 text-14 font-normal">{h.label}</p>
        </div>
      {/each}
    </div>
    {#each lista as pedido, i}
      <button
        disabled={pedido.status !== "APROVADO" && pedido.status !== "PENDENTE"}
        onclick={() => handleOpen(i)}
        class="w-full py-2.5 px-3 gap-8 disabled:cursor-not-allowed not-disabled:hover:bg-soft-200/25 items-center grid grid-cols-7 text-sub-600 text-[14px] {i ===
        lista.length - 1
          ? ''
          : 'border-b border-soft-200'}"
      >
        <div class="flex gap-2 items-center {headers[0].colSpan}">
          <ListAvatar
            maskSize = "circle at 40px,transparent 13px"
            size="w-8"
            users={pedido.itens.map((obj) => {
              return {
                name: obj.nome,
                src:obj.imagem ?? "",
              };
            })}
          />
        </div>
        <div
          class="flex flex-col items-start justify-start {headers[1].colSpan}"
        >
          <b class="font-medium text-strong-950 text-left">
            {sanitizar.reais(pedido.total.toString())}
          </b>
        </div>
        <div
          class="flex flex-col items-start justify-start {headers[2].colSpan}"
        >
          <b class="text-strong-950 font-normal whitespace-nowrap">
            {handleDate.formatISODate(pedido.criadoEm, `dd 'de' MMMM','yyyy'`)}
          </b>
          <span class="text-sub-600 text-[12px]">
            {handleDate.formatISODate(pedido.criadoEm, `'ás' hh':'mm'`)}
          </span>
        </div>
        <div class="flex justify-between gap-2 {headers[3].colSpan}">
          <CardIconStatus status={pedido.status}/>
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
      <ModalPedidoDetalhes bind:open={openModal[i]} idPedido={pedido.id} />
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
      bind:value={pesquisa}
      maxWidth="grow"
    />
    <div class="w-40 grid">
      <SelectBlock
        placeholder="Status"
        bind:value={status}
        onSelect={()=>{
          pagina=1
        }}
        options={sttsList}
      />
    </div>
  </div>
{/snippet}
