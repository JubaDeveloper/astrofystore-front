<script lang="ts">
  import FormEstoqueVariavel from "$components/sections/loja/estoque/FormEstoqueVariavel.svelte";
  import FormEstoqueSimples from "$components/sections/loja/estoque/FormEstoqueSimples.svelte";
  import Typer from "$components/assets/anim/Typer.svelte";
  import SvgX from "$components/assets/svg/SvgX.svelte";
  import toast from "$lib/utils/toast.svelte";

  import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
  import { EstoqueController } from "$lib/api/modules/lojas/estoque/estoque.controller";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount, untrack } from "svelte";
  import type {
    FormDeEstoqueSimples,
    InfoEstoqueDto,
  } from "$lib/api/modules/lojas/estoque/estoque.dto";

  const produtoController = new ProdutoController();

  type Form = {
    tipoEstoque: "lista" | "mensagem";
    mensagem?: string;
    estoqueBaixo: number;
  };

  let infoEstoque = $state<InfoEstoqueDto>();
  let loadingWholeForm = $state(true);

  let form = $state<FormDeEstoqueSimples>({
    nome: "",
    estoqueBaixo: 0,
    preco: 0,
    status: "ativo",
    tipo: "lista",
    mensagem: "",
    itensEstoque: [],
  });

  let tags = $state<any[]>([]);

  const estoqueController = new EstoqueController(
    parseInt(page.params.id),
    parseInt(page.params.idProduto)
  );

  async function save() {
    await atualizarSimples({
      tipoEstoque: form.tipo,
      mensagem: form.mensagem,
      estoqueBaixo: form.estoqueBaixo,
    });
  }

  $effect(() => {
    if (form.tipo && !loadingWholeForm) {
      untrack(alterarTempoReal);
    }
  });

  async function alterarTempoReal() {
    if(!infoEstoque) return
    if (form.itensEstoque.length > 0 && form.tipo === "mensagem") {
      form.tipo = "lista";
      return toast.alert(
        "Não é possivel fazer a troca de tipos de estoque",
        "Para prosseguir com a mudança, por favor limpe os itens de estoque."
      );
    }

    const body: Form = {
      tipoEstoque: form.tipo,
      mensagem: form.mensagem.length > 0 ? form.mensagem : ".",
      estoqueBaixo: form.estoqueBaixo,
    };

    if (form.tipo === "lista") {
      delete body.mensagem;
    }

    const [r, e] = await estoqueController.editar(infoEstoque.id, body);
  }

  async function atualizarSimples(body: Form): Promise<boolean> {
    if (body.tipoEstoque === "lista") {
      delete body.mensagem;
    }
    const [r, e] = await estoqueController.editar(infoEstoque!.id, body);
    const [r2, e2] = await produtoController.atualizar(
      parseInt($idLoja),
      infoEstoque!.produto.id,
      {
        preco: form.preco * 100,
        nome: infoEstoque!.produto.nome,
      }
    );
    if (e) {
      toast.error("Erro ao editar estoque", "Tente novamente");
      return false;
    }
    toast.success("Estoque editado com sucesso", "");
    goto(`/loja/${$idLoja}/produtos`);
    return true;
  }

  onMount(async () => {
    const tmp = parseInt(page.params.idProduto);
    const [data, error] = await produtoController.pegar(parseInt($idLoja), tmp);
    if (error) {
      toast.error("Produto não encontrado", "Tente novamente");
      return goto(`/loja/${$idLoja}/produtos`);
    }
    if (!data.estoque && data.variacoes.length === 0) {
      goto(
        `/loja/${parseInt($idLoja)}/cadastro-estoque/${page.params.idProduto}`
      );
      return;
    }

    if (data.estoque) {
      const idEstoque = data.estoque!.id;
      const [infoEstoqueTmp, errorEstoque] =
        await estoqueController.listar(idEstoque);
      infoEstoque = infoEstoqueTmp.data;
      form.mensagem = infoEstoque!.mensagem;
      form.preco = infoEstoque!.produto.precoReferencia / 100;
      form.tipo =
        infoEstoque!.tipoEstoque === "mensagem" ? "mensagem" : "lista";
      form.itensEstoque = infoEstoque!.estoqueItens.map((obj) => obj.conteudo);
      tags = infoEstoque!.estoqueItens.map((obj) => {
        return {
          value: obj.conteudo,
          selected: false,
          id: obj.id,
        };
      });
    }
    loadingWholeForm = false;
  });
</script>

<div class="flex flex-col gap-6 h-full relative">
  {@render header()}
  <div class="flex items-start gap-4 grow">
    <div class="relative grow h-full flex">
      {#if !loadingWholeForm && estoqueController}
        <div class="flex items-start grow">
          {#if infoEstoque && infoEstoque.tipoProduto === "simples" && !infoEstoque.variacaoProduto}
            <div class="absolute flex justify-center items-center w-full">
              <FormEstoqueSimples
                bind:tags
                idEstoque={infoEstoque.id}
                bind:formSimples={form}
                onSalvar={save}
              />
            </div>
          {:else}
            <div class="absolute">
              <FormEstoqueVariavel />
            </div>
          {/if}
        </div>
      {:else}
        <div class="flex w-full grow items-center justify-center">
          <Typer
            label="Buscando informações de estoque desse produto..."
            infinite={false}
            frames={10}
          />
        </div>
      {/if}
    </div>
  </div>
</div>

{#snippet header()}
  <div
    class="flex w-full items-center justify-between border-b border-soft-200 py-4 pb-5"
  >
    <span class="text-[18px] font-medium"> Edição de estoque </span>
    <button onclick={() => window.history.back()}>
      <SvgX props={{ class: "fill-sub-600" }} />
    </button>
  </div>
{/snippet}

<!-- <style>
    .user-gradient{
            background: linear-gradient(180deg, rgba(113, 119, 132, 0.10) 0%, rgba(113, 119, 132, 0.00) 100%);
        }
  </style> -->
