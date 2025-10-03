<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import SvgMilho from "$components/assets/svg/SvgMilho.svelte";
  import SvgPipoca from "$components/assets/svg/SvgPipoca.svelte";
  import SvgX from "$components/assets/svg/SvgX.svelte";
  import StepIndicator from "$components/elements/progress/StepIndicator.svelte";
  import RatioManager from "$components/elements/ratio/RatioManager.svelte";
  import BubbleWrapper from "$components/elements/wrappers/BubbleWrapper.svelte";
  import FormEstoqueSimples from "$components/sections/loja/estoque/FormEstoqueSimples.svelte";
  import FormEstoqueVariavel from "$components/sections/loja/estoque/FormEstoqueVariavel.svelte";
  import SideBarEstoqueSimples from "$components/sections/loja/estoque/SideBarEstoqueSimples.svelte";
  import { EstoqueController } from "$lib/api/modules/lojas/estoque/estoque.controller";
  import type { FormDeEstoqueSimples } from "$lib/api/modules/lojas/estoque/estoque.dto";
  import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
  import type {
    Produto,
    ProdutosForm,
  } from "$lib/api/modules/produto/produto.dto.svelte";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import toast from "$lib/utils/toast.svelte";
  import { parse } from "date-fns";
  import { onMount } from "svelte";

  const estoqueController = new EstoqueController(
    parseInt(page.params.id),
    parseInt(page.params.idProduto)
  );
  const produtoController = new ProdutoController();
  const options = [
    {
      label: "Produto Simples",
      subLabel: "",
      value: "simples",
      descricao:
        "Crie um produto único 😎, sem opções de preço ou conteúdo diferentes.",
      LeftSnippet: iconMilho,
    },
    {
      label: "Produto Variável",
      subLabel: "",
      value: "variado",
      descricao:
        "🛠️ Crie um produto com variações de preço e conteúdo para atender a diferentes necessidades.",
      LeftSnippet: iconPipoca,
    },
  ];

  let form = $state<{ tipo: "simples" | "variado" }>({ tipo: "simples" });
  let formSimples = $state<FormDeEstoqueSimples>({
    nome: "",
    estoqueBaixo: 0,
    itensEstoque: [],
    preco: 0,
    status: "ativo",
    tipo: "lista",
    mensagem: "",
  });
  let temEstoque = $state<boolean>(false);
  let produtoEdicao = $state<Produto>();
  let listaEstoque = $state<string[]>([]);
  let editando = $state<boolean>(false);
  let loadingWholeForm = $state(true);
  let etapaAtual = $state<number>(1);
  let idProduto = $state<number>();
  let idEstoque = $state<number>();

  async function salvarTipoEstoque() {
    const body = {
      nome: formSimples.nome,
      tipo: form.tipo,
    };
    const [_, err] = await produtoController.atualizar(
      parseInt($idLoja),
      idProduto!,
      body
    );
    if (err) return toast.error("Erro ao atualizar produto", err.message);
    etapaAtual = 2;
  }
  async function criarEstoque(body: {
    tipoEstoque: "lista" | "mensagem";
    mensagem: string;
    estoqueBaixo: number;
  }): Promise<boolean> {
    if (editando === true) return false;
    editando = true;
    const [r, e] = await estoqueController.criar(body);
    if (e) {
      toast.error("Erro ao criar estoque", "Tente novamente");
      return false;
    }
    idEstoque = r.data.id;
    if (body.tipoEstoque === "lista") {
      const list = await criarLista();
      if (!list) return false;
    }
    return true;
  }

  async function criarLista() {
    const promisses = formSimples.itensEstoque.map(async (item) => {
      const body = { conteudo: item };
      return await estoqueController.criarItens($idLoja, idEstoque!, body);
    });
    const list = await Promise.all(promisses);
    const errors = list.some((item) => item[1] !== null);
    if (!errors) return true;
    return false;
  }

  async function salvarSimples() {
    const body2 = {
      nome: produtoEdicao?.nome!,
      preco: formSimples.preco * 100,
      tipo: form.tipo,
    };
    const [r2, e2] = await produtoController.atualizar(
      parseInt($idLoja),
      idProduto!,
      body2
    );
    if (e2) return toast.error("Erro ao atualizar produto", "Tente novamente");

    const body = {
      tipoEstoque: formSimples.tipo,
      mensagem: formSimples.mensagem ?? "",
      estoqueBaixo: formSimples.estoqueBaixo,
    };
    if (!(await criarEstoque(body))) return;

    toast.success("Estoque criado com sucesso", "Redirecionando...");
    goto(`/loja/${$idLoja}/produtos`);
  }

  onMount(async () => {
    idProduto = parseInt(page.params.idProduto);
    const [data, error] = await produtoController.pegar(
      parseInt($idLoja),
      idProduto
    );

    if (error) {
      toast.error("Produto não encontrado", "Tente novamente");
      goto(`/loja/${$idLoja}/produtos`);
      return;
    }
    produtoEdicao = data;
    loadingWholeForm = false;
    temEstoque = data.tipo && data.tipo !== null ? true : false;
    if (!temEstoque)
      return toast.alert(
        "Este produto ainda não possui estoque cadastrado",
        "Selecione um tipo estoque para ele"
      );
    form.tipo = data.tipo!;
    etapaAtual = 2;
  });
</script>

<div class="flex flex-col gap-6 h-full">
  {@render header()}
  {#if !loadingWholeForm}
    <div class="flex items-start grow justify-center">
      {#if etapaAtual === 1}
        <div class="absolute">
          {@render escolha()}
        </div>
      {:else if etapaAtual === 2}
        <div class="absolute w-full flex justify-center">
          {#if form.tipo === "simples"}
            <FormEstoqueSimples bind:formSimples onSalvar={salvarSimples} />
          {:else}
            <div class="px-6 w-full">
              <FormEstoqueVariavel />
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>

<SideBarEstoqueSimples open={false} back={() => {}} />

{#snippet escolha()}
  <BubbleWrapper css="flex flex-col px-0 py-4 w-[440px]">
    <div class="flex flex-col px-4">
      <b class="text-strong-950 text-[16px] font-medium">Cadastre o estoque</b>
      <span class="text-[12px] font-medium text-sub-600 mt-[2px]">
        Não esqueça! Cadastre o estoque para que este produto comece a gerar
        vendas na sua loja.
      </span>
    </div>
    <div class="w-full h-[1px] bg-soft-200 my-3"></div>
    <div class="px-4">
      <RatioManager {options} bind:value={form.tipo} />
    </div>
    <div class="w-full h-[1px] bg-soft-200 my-3"></div>
    <div class="grid grid-cols-2 gap-x-3 mx-4 h-[40px]">
      <Botao
        onClick={() => goto(`/loja/${$idLoja}/produtos`)}
        tema="gray-transparent"
      >
        Cancelar
      </Botao>
      <Botao onClick={salvarTipoEstoque} tema="primary">Continuar</Botao>
    </div>
  </BubbleWrapper>
{/snippet}

{#snippet iconMilho()}
  <div
    class="w-[40px] shrink-0 aspect-square rounded-full bg-white-0 border border-soft-200 flex items-center justify-center"
  >
    <SvgMilho />
  </div>
{/snippet}

{#snippet iconPipoca()}
  <div
    class="w-[40px] shrink-0 aspect-square rounded-full bg-white-0 border border-soft-200 flex items-center justify-center"
  >
    <SvgPipoca />
  </div>
{/snippet}

{#snippet header()}
  <div
    class="flex w-full items-center justify-between border-b border-soft-200 py-4 pb-5"
  >
    <span class="text-[18px] font-medium"> Cadastro de estoque </span>

    <!-- <StepIndicator format="inline" steps={passosNovoProduto} currentStep={etapaAtual}/> -->

    <button onclick={() => window.history.back()}>
      <SvgX
        props={{
          class: "fill-sub-600",
        }}
      />
    </button>
  </div>
{/snippet}
