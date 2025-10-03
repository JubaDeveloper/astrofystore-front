<script lang="ts">
  import Botao from "$components/assets/buttons/Botao.svelte";
  import Input from "$components/assets/input/Input.svelte";
  import InputPreco from "$components/assets/input/InputPreco.svelte";
  import Number from "$components/assets/input/Number.svelte";
  import TextArea from "$components/assets/input/TextArea.svelte";
  import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
  import SelectMainWithSnippet from "$components/assets/select/Select_Main_With_Snippet.svelte";
  import SelectOptionWithSnippet from "$components/assets/select/Select_Option_With_Snippet.svelte";
  import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import InputEstoque from "./InputEstoque.svelte";
  import SidePop from "$components/assets/modals/SidePop.svelte";
  import SvgImagem from "$components/assets/svg/SvgImagem.svelte";
  import SvgThreeDots from "$components/assets/svg/SvgThreeDots.svelte";
  import Upload from "$components/assets/upload/Upload.svelte";
  import Tabs from "$components/assets/tabs/Tabs.svelte";
  import type { FormDeEstoqueSimples } from "$lib/api/modules/lojas/estoque/estoque.dto";
  import { page } from "$app/state";
  import { effectBy, encurtarTexto } from "$lib/utils/utils.svelte";
  import { ProdutoVariacaoController } from "$lib/api/modules/produto/variacao/produto.variacao.controller";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import { EstoqueVariacaoController } from "$lib/api/modules/lojas/estoque/variacao/estoque.variacao.controller";
  import type { ProdutoVariacaoDto } from "$lib/api/modules/produto/variacao/produto.variacao.dto";
  import toast from "$lib/utils/toast.svelte";
  import SvgLixeira from "$components/assets/svg/SvgLixeira.svelte";
  import SvgTrash from "$components/assets/svg/SvgTrash.svelte";
  import { EstoqueController } from "$lib/api/modules/lojas/estoque/estoque.controller";
  import sinalizador from "$lib/utils/signal.svelte";
  import { EstoqueItemController } from "$lib/api/modules/lojas/estoque/item/estoque.item.controller";

  interface Props {
    back: VoidFunction;
    open: boolean;
    onSalvar: VoidFunction;
    onExcluir: (id: number) => void;
  }

  let { back, open = $bindable(), onSalvar, onExcluir }: Props = $props();

  let idEstoque = $state<number>();
  let tags = $state<
    {
      value: string;
      selected: boolean;
      id?: number;
    }[]
  >([]);

  let formImage = $state({
    file: null,
    data64: "",
  });

  let form = $state<FormDeEstoqueSimples>({
    nome: "",
    estoqueBaixo: 0,
    itensEstoque: [],
    mensagem: "",
    preco: 0,
    status: "ativo",
    tipo: "lista",
  });

  let formAtributos = $state<
    {
      id: number;
      value: string;
    }[]
  >([]);

  let tabItem = $state("Configurações");
  let modo = $state<"criacao" | "edicao">("criacao");
  let loading = $state(false);
  let loadingDelete = $state(false);
  let idProdutoVariacao = $state<number>();

  const idProduto = parseInt(page.params.idProduto);
  const variacaoController = new ProdutoVariacaoController(
    idProduto,
    parseInt($idLoja)
  );

  export async function modoEdicao(p: ProdutoVariacaoDto) {
    form.nome = p.nome;
    form.status = p.ativo ? "ativo" : "inativo";
    form.preco = p.preco ? p.preco / 100 : 0;
    idProdutoVariacao = p.id;
    form.estoqueBaixo = p.estoque ? (p.estoque.estoqueBaixo ?? 0) : 0;
    if (p.imagem) {
      formImage.data64 = variacaoController.pegarImagem(p.id, p.imagem.id);
    }
    formAtributos = p.valorAtributoProduto;
    modo = "edicao";
    if (p.estoque) {
      idEstoque = p.estoque.id;

      form.tipo = p.estoque.tipoEstoque as "lista" | "mensagem";
      if (form.tipo === "mensagem") {
        form.mensagem = p.estoque.mensagem;
      }
      const estoqueItemController = new EstoqueItemController(
        p.estoque.id,
        parseInt($idLoja)
      );
      const [r, e] = await estoqueItemController.listar();
      if (!e) {
        tags = r.data.map((obj: any) => {
          return {
            id: obj.id,
            value: obj.conteudo,
            selected: false,
          };
        });
      }
    }

    open = true;
  }

  async function excluir() {
    loadingDelete = true;
    const [r, e] = await variacaoController.excluir(idProdutoVariacao!);
    const [r2, e2] = await new EstoqueController(parseInt($idLoja), -1).deletar(
      idEstoque!
    );
    loadingDelete = false;
    if (e || e2) {
      return toast.error(
        "Erro ao excluir estoque variado",
        e ? e.message : e2.message
      );
    }
    open = false;
    onExcluir(idProdutoVariacao!);
  }

  async function salvar() {
    loading = true;
    let r, e;
    if (modo === "criacao") {
      [r, e] = await variacaoController.criar({
        nome: form.nome,
        preco: form.preco * 100,
        ativo: form.status === "ativo" ? true : false,
        desconto: 0,
      });
      if (e) {
        loading = false;
        toast.error("Erro ao criar variação de produto", e.message);
        return;
      }
    } else {
      [r, e] = await variacaoController.editar(idProdutoVariacao!, {
        nome: form.nome,
        preco: form.preco * 100,
        ativo: form.status === "ativo" ? true : false,
        desconto: 0,
      });
      if (e) {
        loading = false;
        toast.error("Erro ao editar variação de produto", e.message);
        return;
      }
    }
    const idVariacao = r.data.id;

    if (formImage.file) {
      if (modo === "criacao")
        await variacaoController.inserirImagem(idVariacao, formImage.file);
      else await variacaoController.atualizarImagem(idVariacao, formImage.file);
    }

    const estoqueVariacaoController = new EstoqueVariacaoController(
      parseInt($idLoja),
      idVariacao
    );
    const body = {
      tipoEstoque: form.tipo as "lista" | "mensagem",
      mensagem: form.mensagem,
      estoqueBaixo: form.estoqueBaixo,
    };

    if (modo === "criacao" || !idEstoque) {
      const [rE, eE] = await estoqueVariacaoController.criar(body);
      if (eE) {
        loading = false;
        toast.error("Erro ao criar estoque de produto", eE.message);
        return;
      }
      const idEstoque = rE.data.id;

      if (form.tipo === "lista") {
        const promisses = tags.map(async (item) => {
          const body = { conteudo: item.value };
          await new EstoqueController(parseInt($idLoja), -1).criarItens(
            $idLoja,
            idEstoque,
            body
          );
        });
        const list = await Promise.all(promisses);
      }
    } else if (idEstoque) {
      const estoqueController = new EstoqueController(parseInt($idLoja), -1);
      const [rE, eE] = await estoqueController.editar(idEstoque, body);
      if (eE) {
        loading = false;
        toast.error("Erro ao editar estoque de produto", eE.message);
        return;
      }
    }
    loading = false;
    onSalvar();
    open = false;
  }

  effectBy(
    () => [open],
    () => {
      if (open === false) {
        modo = "criacao";
        form.preco = 0;
        form.itensEstoque = [];
        form.mensagem = "";
        form.estoqueBaixo = 0;
        form.nome = "";
        form.tipo = "lista";
        formImage.file = null;
        formImage.data64 = "";
        idEstoque = undefined;
        tags = [];
      }
    }
  );
</script>

<SidePop curved={true} bind:open>
  <div class="w-full px-4 flex items-center justify-between">
    <div class="flex gap-3 items-center">
      <div class="flex flex-col leading-4 gap-1">
        <span class="text-[14px] font-medium">
          {encurtarTexto(
            form.nome.length > 0 ? form.nome : "Novo produto variado",
            30
          )}
        </span>
        <span
          class="text-[12px] {form.preco !== 0
            ? 'text-sub-600'
            : 'text-error-base'}"
          >{form.preco !== 0 ? "R$ " + form.preco : "Item sem preço"}</span
        >
      </div>
    </div>
    {#if modo === "edicao"}
      <Botao tema="red-transparent-inverted" onClick={excluir}>
        <SvgTrash
          props={{
            class: "fill-error-base",
          }}
        />
        Excluir
      </Botao>
    {/if}
  </div>

  <div class="w-full h-[1px] bg-soft-200 my-3"></div>
  {#if formAtributos.length > 0}
    <Tabs
      bind:labelSelected={tabItem}
      options={[
        {
          label: "Configurações",
        },
        {
          label: "Atributos",
        },
      ]}
    />
    <div class="mb-3"></div>
  {/if}

  {#if tabItem === "Configurações"}
    {@render formSnippet()}
  {:else}
    <div></div>
  {/if}

  <div class="flex flex-col grow justify-end w-full">
    <div class="w-full h-[1px] bg-soft-200 my-3"></div>
    <div class="grid grid-cols-2 gap-x-3 px-4 h-[40px] w-full">
      <Botao onClick={back} disabled={loading} tema="gray-transparent">
        Voltar
      </Botao>
      <Botao onClick={salvar} {loading} tema="primary">Salvar</Botao>
    </div>
  </div>
</SidePop>

{#snippet greenBtn()}
  <div class="w-2 aspect-square bg-green-400 rounded-full"></div>
{/snippet}

{#snippet redBtn()}
  <div class="w-2 aspect-square bg-red-400 rounded-full"></div>
{/snippet}

{#snippet formSnippet()}
  <div class="grid grid-cols-8 gap-x-3 gap-y-2 px-4">
    <div class="col-span-5">
      <Input
        label="Nome do Item"
        mandatory={true}
        bind:value={form.nome}
        placeholder="Ex: item 1"
      />
    </div>
    <div class="col-span-3">
      <InputWrapper label="Status" value="">
        <SelectBlock
          placeholder="Selecione"
          bind:value={form.status}
          focusCss="relative h-[40px]"
          MainComponent={SelectMainWithSnippet}
          OptionComponent={SelectOptionWithSnippet}
          options={[
            {
              label: "Ativo",
              value: "ativo",
              snippet: greenBtn,
            },
            {
              label: "Inativo",
              value: "inativo",
              snippet: redBtn,
            },
          ]}
        />
      </InputWrapper>
    </div>
    <div class="col-span-8">
      <Upload
        bind:formImage
        mandatory={false}
        size="h-[200px] max-h-[200px] object-contain"
        label="Imagem"
      />
    </div>
    <div class="col-span-8">
      <InputPreco
        bind:value={form.preco}
        placeholder=""
        label="Preço"
        mandatory={true}
      />
    </div>
    <div class="col-span-5">
      <InputWrapper label="Tipo de Estoque" mandatory={true} value="">
        <SelectBlock
          placeholder="Selecione"
          removableOnClick={false}
          bind:value={form.tipo}
          focusCss="relative h-[40px]"
          MainComponent={SelectMainWithSnippet}
          OptionComponent={SelectOptionWithSnippet}
          options={[
            {
              label: "Lista",
              value: "lista",
            },
            {
              label: "Mensagem Padrão",
              value: "mensagem",
            },
          ]}
        />
      </InputWrapper>
    </div>
    <div class="col-span-3">
      <Number
        extraTip="Para ser notificado quando o estoque estiver acabando, defina um valor abaixo do qual você quer ser alertado."
        label="Estoque Baixo"
        bind:value={form.estoqueBaixo}
        limit={1000}
      />
    </div>
    <div class="col-span-8">
      {#if form.tipo === "lista"}
        {#if idEstoque}
          <InputEstoque bind:tags {idEstoque} />
        {:else}
          <InputEstoque bind:tags />
        {/if}
      {:else}
        <TextArea
          label="Descrição"
          limit={300}
          placeholder="Digite..."
          bind:value={form.mensagem}
        />
      {/if}
    </div>
  </div>
{/snippet}
