<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import Input from "$components/assets/input/Input.svelte";
  import InputData from "$components/assets/input/InputData.svelte";
  import InputNumber from "$components/assets/input/InputNumber.svelte";
  import InputPreco from "$components/assets/input/InputPreco.svelte";
  import FillText from "$components/assets/limiter/FillText.svelte";
  import DropBlock from "$components/assets/logic/DropBlock.svelte";
  import FocusBlock from "$components/assets/logic/FocusBlock.svelte";
  import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
  import PopUp from "$components/assets/modals/PopUp.svelte";
  import SidePop from "$components/assets/modals/SidePop.svelte";
  import SvgAlerta from "$components/assets/svg/SvgAlerta.svelte";
  import SvgCheckMin from "$components/assets/svg/SvgCheckMin.svelte";
  import SvgCopiar from "$components/assets/svg/SvgCopiar.svelte";
  import SvgPlus from "$components/assets/svg/SvgPlus.svelte";
  import SvgThreeDots from "$components/assets/svg/SvgThreeDots.svelte";
  import CardStatus from "$components/elements/card/CardStatus.svelte";
  import Notificacao from "$components/elements/notificacao/Notificacao.svelte";
  import PaginacaoCompleta from "$components/elements/pagination/PaginacaoCompleta.svelte";
  import Pesquisa from "$components/elements/search/Pesquisa.svelte";
  import SelectVisibilidade from "$components/sections/select/SelectVisibilidade.svelte";
  import categoriaController from "$lib/api/modules/categoria/categoria.controller";
  import cupomController from "$lib/api/modules/cupom/cupom.controller";
  import { ProdutoUtils } from "$lib/api/modules/produto/produto.utils";
  import sanitizar from "$lib/sanitizers/sanitizer";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import storageService from "$lib/utils/storageService";
  import toast from "$lib/utils/toast.svelte";
  import type { Option } from "$lib/utils/types";
  import {
    consoleDev,
    copiarTexto,
    formatarDataHora,
    formatarPreco,
  } from "$lib/utils/utils.svelte";
  import { onMount } from "svelte";

  const produtoUtils = new ProdutoUtils();

  let openDropDown = $state<boolean[]>([]);
  let recemCopiado = $state<boolean[]>([])
  let tipo: boolean = $state(false);
  let open: boolean = $state(false);
  let cupons = $state<any[]>([]);
  let openModalDeletar = $state<boolean[]>([]);
  let openModalEditar = $state<boolean[]>([]);
  let categorias = $state<Option[]>([]);
  let loadingDelete = $state(false);
  let loadingAtualizar = $state(false)
  let ativos: number = $state(0);
  let inativos: number = $state(0);
  let formBody = $state({
    nome: "",
    tipoDesconto: "percentual",
    codigo: "",
    valorDesconto: 0,
    dataInicio: "",
    dataVencimento: "",
    quantidade: 0,
    categoriaId: 0,
    ativo: true,
    gastoMinimo: 0,
    limiteDesconto: 0,
  });

  let paginacao = $state({
    pagina: 1,
    qtdPaginas: 10,
    totalPaginas: 1,
  });

  let filtros = $state({
    nome: "",
    categoriaId: "",
    ativo: true,
  });

  async function listar() {
    const [res, err] = await cupomController.listarCupons(
      parseInt(page.params.id),
      {
        ...filtros,
        pagina: paginacao.pagina,
        quantidade: paginacao.qtdPaginas,
      }
    );

    if (err) return toast.error("Mensagem do sistema.", err.message);

    cupons = res.data.resultado;
    consoleDev(cupons);
    ativos = cupons.filter((obj) => obj.ativo === true).length;
    inativos = cupons.filter((obj) => obj.ativo === false).length;

    paginacao.totalPaginas = res.data.totalPaginas;
  }

  async function status(id: number) {
    const body = {
      ativo: formBody.ativo,
    };
    const [res, err] = await cupomController.statusCupom(
      parseInt(page.params.id),
      id,
      body
    );
    if (err) return toast.error("Mensagem do sistema.", err.message);
  }

  async function atualizar(id: number, index: number) {
    const body = { ...formBody };
    loadingAtualizar=true
    body.gastoMinimo = body.gastoMinimo!*100
    body.limiteDesconto = body.limiteDesconto*100
    if(body.tipoDesconto==="percentual"){

    }
    else{
      //@ts-ignore
      delete body.limiteDesconto
      body.valorDesconto = body.valorDesconto*100 //Para centavos
    }

    if(!body.dataVencimento){
      //@ts-ignore
      delete body.dataVencimento
    }

    const [res, err] = await cupomController.atualizarCupom(
      parseInt(page.params.id),
      id,
      body
    );
    loadingAtualizar=false
    if (err) return toast.error("Mensagem do sistema.", err.message);

    await status(id);

    openModalEditar[index] = false;
    toast.success("Mensagem do sistema.", res.message);
    listar();
  }

  async function deletar(id: number) {
    const [res, err] = await cupomController.excluirCupom(
      parseInt(page.params.id),
      id
    );

    if (err) return toast.error("Mensagem do sistema.", err.message);

    toast.success("Mensagem do sistema.", res.message);
    listar();
  }

  async function buscarCategorias() {
    const [res, err] = await categoriaController.listar(
      parseInt(page.params.id),
      {}
    );
    if (err) return toast.error("Mensagem do sistema.", err.message);
    const received = res.resultado;
    categorias = received.map((obj: any) => {
      return { label: obj.nome, value: obj.id };
    });
  }

  $effect(() => {
    if (filtros) listar();
  });

  onMount(() => {
    listar();
    buscarCategorias();
    // consoleDev(storageService.getStoredData('astronfy-token'))
  });
</script>

<div class="flex flex-col gap-8 h-full">
  {@render header()}
  {@render filtrosSec()}
  {#if cupons.length === 0}
    <div class="flex flex-col gap-4 justify-center items-center">
      <div class="flex flex-col items-center justify-center text-center">
        <img
          class="max-w-[500px]"
          src="/images/anxious-face.png"
          alt="anxious-face"
        />
        <div class="flex flex-col gap-1">
          <p class="text-20 font-medium text-strong-950">
            Você ainda não tem cupons criados
          </p>
          <p class="text-14 font-medium text-sub-600">
            Crie cupons na sua loja para disponibiliza-los para venda.
          </p>
        </div>
      </div>
      <div class="grid h-[40px] w-[150px]">
        <Botao
          tema={"primary"}
          onClick={() => goto(`/loja/${$idLoja}/cupom/criar-cupom`)}
        >
          Cupons
          <SvgPlus
            props={{
              class: "fill-white-0",
            }}
          />
        </Botao>
      </div>
    </div>
  {:else}
    <div class="relative w-full">
      <div class="w-full absolute top-0 left-0">
        {@render tabela()}
        {#if cupons.length > 10}
          <PaginacaoCompleta
            bind:pagina={paginacao.pagina}
            onSelecionarPagina={() => ""}
            bind:qtdPaginas={paginacao.qtdPaginas}
            totalPaginas={paginacao.totalPaginas}
          />
        {/if}
      </div>
    </div>
  {/if}
</div>

{#snippet header()}
  <div class="border-b border-soft-200 pb-5 flex items-center justify-between">
    <div class="flex flex-col">
      <span class="text-[18px] font-medium"> Cupons </span>
      <p class="text-[14px] text-sub-600">Visualize e gerencie seus cupons</p>
    </div>
    <div class="grid h-[40px]">
      <Botao
        tema={"primary"}
        onClick={() => goto(`/loja/${$idLoja}/cupom/criar-cupom`)}
      >
        Adicionar cupom
        <SvgPlus props={{ class: "fill-white-0" }} />
      </Botao>
    </div>
  </div>
{/snippet}

<Notificacao bind:open />

{#snippet filtrosSec()}
  <div class="flex w-full justify-between items-center">
    {@render tipoValor()}
    <span class="flex gap-4 justify-end items-center w-1/2">
      <Pesquisa
        onSearch={listar}
        placeholder={"Pesquise o nome do cupom..."}
        bind:value={filtros.nome}
      />
      <div class="grid h-[43px] min-w-[200px]">
        <SelectBlock
          bind:options={categorias}
          bind:value={filtros.categoriaId}
          placeholder="Categoria"
          dropCss="absolute top-[120%] right-0 w-[300px] max-h-[200px] rounded-lg overflow-y-auto bg-transparent border border-[rgba(0,0,0,.05)] 
            dark:border-none outline-none shadow-lg dark:shadow-none flex flex-col gap-1 p-2"
        />
      </div>
    </span>
  </div>
{/snippet}

{#snippet tipoValor()}
  <div class="bg-weak-50 p-1 rounded-[10px] flex items-center min-w-80">
    <button
      class="w-full text-14 font-medium rounded-[10px] p-1 {!tipo
        ? 'bg-white-0 text-strong-950 shadow-lg'
        : 'bg-transparent text-sub-600'}"
      onclick={() => {
        (tipo = !tipo), (filtros.ativo = true);
      }}
    >
      Ativos
    </button>
    <button
      class="w-full text-14 rounded-[10px] p-1 {tipo
        ? 'bg-white-0 text-strong-950 shadow-lg'
        : 'bg-transparent text-sub-600'}"
      onclick={() => {
        (tipo = !tipo), (filtros.ativo = false);
      }}
    >
      Inativos
    </button>
  </div>
{/snippet}

{#snippet tabela()}
  {@const headers = produtoUtils.headersCupons}
  <div class="flex flex-col gap-2 pb-5 w-full">
    <div
      class="w-full px-3 py-[6px] text-[14px] font-light rounded-[8px] bg-weak-50 text-sub-600 grid grid-cols-8 gap-8"
    >
      {#each headers as h, i}
        <div class="flex items-center gap-2 {h.colSpan}">
          <p class="text-sub-600 text-14 font-normal">{h.label}</p>
        </div>
      {/each}
    </div>
    {#each cupons as cupom, i}
      {@const categoria = cupom.categoria}
      <div
        class="w-full py-2 px-3 gap-8 items-center grid grid-cols-8 text-sub-600 text-[14px] rounded-[8px]"
      >
        <div class="flex gap-2 items-center {headers[0].colSpan}">
          <button
            class="flex items-center"
            onclick={() => {
              recemCopiado[i]=true
              setTimeout(()=>{
                recemCopiado[i]=false
              },1500)
              navigator.clipboard.writeText(cupom.codigo),
                toast.success("Mensagem do sistema.", "Código copiado!");
            }}
          >
            <span class="border border-soft-200 {recemCopiado[i] ? "bg-success-base" : ""} rounded-[8px] shrink-0 w-7 flex items-center justify-center aspect-square p-0.5">
              {#if recemCopiado[i]}
                <SvgCheckMin props={{
                  class:"fill-white-0"
                }}/>
              {:else}
                <SvgCopiar />
              {/if}
            </span>
          </button>
          <div class="flex flex-col">
            <p class="text-14 font-medium text-strong-950">
              {cupom.nome ?? "--"}
            </p>
            <p class="text-12 font-normal text-sub-600">
              {formatarDataHora(cupom.dataInicio) +
                " - " +
                formatarDataHora(cupom.dataVencimento)}
            </p>
          </div>
        </div>
        <div class="flex gap-2 {headers[1].colSpan}">
          <div class="flex flex-col">
            {#if cupom.tipoDesconto !== "percentual"}
              <p class="text-14 font-normal text-strong-950">
                {"R$" + sanitizar.centavosToReais(cupom.valorDesconto)}
              </p>
              <p class="text-12 font-normal text-sub-600">
                Até R$ {sanitizar.centavosToReais(cupom.limiteDesconto)}
              </p>
            {:else}
              <p class="text-14 font-normal text-strong-950">
                {cupom.valorDesconto + "%"}
              </p>
              <p class="text-12 font-normal text-sub-600">
                Até R$ {sanitizar.centavosToReais(cupom.limiteDesconto)}
              </p>
            {/if}
          </div>
        </div>
        <div class="flex gap-2 {headers[2].colSpan}">
            <p
              class="text-12 font-medium text-sub-600 py-0.5 px-1.5 rounded-2xl bg-weak-50"
            >
              {categoria.nome}
            </p>
        </div>
        <div class="flex gap-2 {headers[3].colSpan}">
          <div class="flex flex-col">
            <p class="text-14 font-normal text-strong-950">
              {cupom.quantidade}
            </p>
            <p class="text-12 font-normal text-sub-600">
              {cupom.quantidadeUtilizada} utilizados
            </p>
          </div>
        </div>
        <div class="flex gap-2 {headers[4].colSpan}">
          <p class="text-14 font-normal text-strong-950">
            R${sanitizar.centavosToReais(cupom.gastoMinimo)}
          </p>
        </div>
        <div class="flex items-center justify-between {headers[5].colSpan}">
          <CardStatus status={cupom.ativo ? "Ativo" : "Inativo"}>
            <div
              class="m-1 flex-shrink-0 h-1.5 w-1.5 rounded-full {cupom.ativo
                ? 'bg-green-500'
                : 'bg-red-500'}"
            ></div>
          </CardStatus>
          <div class="flex gap-2">
            <button
              class="flex-col py-2 px-2 hover:bg-weak-50 flex items-center justify-center text-center rounded-md"
              onclick={() => (openDropDown[i] = true)}
            >
              <SvgThreeDots />
            </button>
            <FocusBlock bind:isFocus={openDropDown[i]} className="relative">
              <DropBlock
                isDrop={openDropDown[i]}
                className="absolute bottom-0 right-12"
              >
                {@render dropDown(i)}
              </DropBlock>
            </FocusBlock>
          </div>
        </div>
      </div>
      {@render popupDeletar(i, cupom.id)}
      {@render sidePopup(i, cupom.id)}
    {/each}
  </div>
{/snippet}

{#snippet sidePopup(i: number, id: number)}
  <SidePop bind:open={openModalEditar[i]}>
    <div class="flex flex-col justify-between h-full">
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between gap-4 px-4 pt-4 w-full">
          <p class="text-strong-950 font-medium text-16">Editar Cupom</p>
          <SelectVisibilidade
            bind:value={formBody.ativo}
            statusOp={[
              {
                label: "Ativo",
                value: true,
                color: "bg-green-500",
              },
              {
                label: "Inativo",
                value: false,
                color: "bg-red-500",
              },
            ]}
          />
        </div>

        <FillText texto="INFORMAÇÕES BÁSICAS" />
        <div class="flex flex-col gap-3 px-4">
          <Input
            label={"Nome"}
            placeholder={"Digite o nome do seu cupom"}
            bind:value={formBody.nome}
            mandatory={true}
          />
          <Input
            label={"Código"}
            placeholder={"Digite o código de aplicação do seu cupom"}
            bind:value={formBody.codigo}
            mandatory={true}
          />
          <div class="flex flex-col gap-0.5">
            <p class="text-14 font-medium text-strong-950">
              Categoria<span class="text-primary-base">*</span>
            </p>
            <SelectBlock
              options={categorias}
              bind:value={formBody.categoriaId}
              placeholder={"Selecionar"}
            />
          </div>
        </div>

        <FillText texto="REGRAS DE APLICAÇÃO" />
        <div class="flex flex-col px-4 gap-4">
          <div class="bg-weak-50 p-1 rounded-[10px] flex items-center">
            <button
              class="w-full text-14 font-medium rounded-[10px] p-1 {formBody.tipoDesconto ===
              'percentual'
                ? 'bg-white-0 text-strong-950'
                : 'bg-transparent text-sub-600'}"
              onclick={() => {
                formBody.tipoDesconto = "percentual";
                tipo = false;
              }}
            >
              Porcentagem (%)
            </button>
            <button
              class="w-full text-14 rounded-[10px] p-1 {formBody.tipoDesconto !==
              'percentual'
                ? 'bg-white-0 text-strong-950'
                : 'bg-transparent text-sub-600'}"
              onclick={() => {
                formBody.tipoDesconto = "valor";
                tipo = true;
              }}
            >
              Valor (R$)
            </button>
          </div>

          <div class="flex items-center gap-4">
            {#if formBody.tipoDesconto === "percentual"}
              <InputNumber
                label={"Desconto"}
                placeholder={"0%"}
                bind:value={formBody.valorDesconto}
                mandatory={true}
                extraTip={"Algo aqui"}
              />
              <InputPreco
                label={"Limite desc."}
                placeholder={"R$0,00"}
                bind:value={formBody.limiteDesconto}
                extraTip={"algo aqui"}
                mostrar={false}
              />
            {:else}
              <InputPreco
                label={"Valor Desconto"}
                placeholder={"R$0,00"}
                bind:value={formBody.valorDesconto}
                extraTip={"algo aqui"}
                mostrar={false}
              />
            {/if}
          </div>
          <div class="flex items-center gap-4">
            <InputNumber
              label={"Quantidade"}
              placeholder={"100"}
              bind:value={formBody.quantidade}
              mandatory={true}
              extraTip={"Algo aqui"}
            />
            <InputPreco
              label={"Gasto mín."}
              placeholder={"R$0,00"}
              bind:value={formBody.gastoMinimo}
              mandatory={true}
              extraTip={"Algo aqui"}
              mostrar={false}
            />
          </div>
        </div>

        <FillText texto="VALIDADE DO CUPOM" />
        <div class="flex flex-col px-4">
          <div class="flex items-center gap-4">
            <InputData
              label={"Início"}
              placeholder={"DD / MM / YYYY"}
              bind:value={formBody.dataInicio}
              mandatory={true}
            />
            <InputData
              label={"Vencimento"}
              placeholder={"DD / MM / YYYY"}
              bind:value={formBody.dataVencimento}
              mandatory={true}
            />
          </div>
        </div>
      </div>

      <div class="px-3 my-3 w-full h-[40px] grid grid-cols-2 gap-2.5">
        <Botao
          tema="gray-transparent"
          onClick={() => {
            openModalEditar[i] = false;
            formBody = {
              nome: "",
              codigo: "",
              tipoDesconto: "percentual",
              valorDesconto: 0,
              dataInicio: "",
              dataVencimento: "",
              quantidade: 0,
              categoriaId: 0,
              ativo: true,
              gastoMinimo: 0,
              limiteDesconto: 0,
            };
          }}
        >
          Cancelar
        </Botao>
        <Botao tema="primary"
        loading={loadingAtualizar}

        onClick={() => atualizar(id, i)}>
          Salvar edições
        </Botao>
      </div>
    </div>
  </SidePop>
{/snippet}

{#snippet dropDown(index: number)}
  {@const actions = [
    {
      label: "Editar",
      action: () => {
        function convertToISO(date: string): string {
          if (!date) return "";
          const datePart = date.split("T")[0];
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(datePart)) return "";
          return datePart;
        }

        formBody = {
          nome: cupons[index].nome ?? "",
          codigo: cupons[index].codigo ?? "",
          tipoDesconto: cupons[index].tipoDesconto ?? "percentual",
          valorDesconto: cupons[index].valorDesconto ? cupons[index].valorDesconto/100 :  0,
          dataInicio: convertToISO(cupons[index].dataInicio ?? ""),
          dataVencimento: convertToISO(cupons[index].dataVencimento ?? ""),
          quantidade: cupons[index].quantidade ?? 0,
          categoriaId: cupons[index].categoria?.[0]?.id ?? 0,
          ativo: cupons[index].ativo ?? true,
          gastoMinimo: cupons[index].gastoMinimo ? cupons[index].gastoMinimo/100 : 0,
          limiteDesconto: cupons[index].limiteDesconto ?? 0,
        };
        openModalEditar[index] = true; // Abre o modal
      },
    },
    {
      label: "Excluir",
      action: () => {
        openModalDeletar[index] = true;
      },
    },
  ]}

  <div
    class="p-2 w-40 bg-white-0 rounded-2xl shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.10)] outline outline-offset-[-1px] outline-soft-200 inline-flex flex-col justify-start items-start gap-1 overflow-hidden"
  >
    {#each actions as ac}
      <button
        onclick={ac.action}
        class="self-stretch p-2 bg-white-0 hover:bg-weak-50 rounded-lg inline-flex justify-start items-center gap-2 overflow-hidden"
      >
        <div class="flex justify-start items-center gap-1">
          <div
            class="justify-start {ac.label === 'Excluir'
              ? 'text-error-base'
              : 'text-strong-950'} text-sm font-normal leading-tight"
          >
            {ac.label}
          </div>
        </div>
      </button>
    {/each}
  </div>
{/snippet}

{#snippet popupDeletar(i: number, id: number)}
  <PopUp
    bind:open={openModalDeletar[i]}
    withCloseButton={false}
    withDefaultPadding={false}
  >
    <div class="flex flex-col w-[440px]">
      <div class="flex gap-4 px-4 mt-4">
        <div
          class="bg-error-light mt-1 shrink-0 rounded-md w-[40px] h-[40px] aspect-square flex items-center justify-center"
        >
          <SvgAlerta
            props={{
              class: "fill-error-base w-[24px] h-[24px]",
            }}
          />
        </div>
        <div class="flex-col justify-start items-start gap-1.5">
          <p class="text-16 font-medium text-strong-950">
            Tem certeza que deseja excluir esse cupom?
          </p>
          <p class="text-14 font-normal text-sub-600">
            Ele não aparecerá mais em sua lista e não será possível recuperá-lo.
          </p>
        </div>
      </div>
      <div class="w-[100%] left-[0] my-3 h-[1px] bg-soft-200"></div>
      <div class="grid grid-cols-2 mb-4 w-full h-[36px] gap-x-3 px-4">
        <Botao
          tema="gray-transparent"
          onClick={() => {
            openModalDeletar[i] = false;
          }}
        >
          Cancelar
        </Botao>
        <Botao
          tema="red"
          onClick={() => {
            deletar(id), (openModalDeletar[i] = false);
          }}
          loading={loadingDelete}
        >
          Excluir
        </Botao>
      </div>
    </div>
  </PopUp>
{/snippet}
