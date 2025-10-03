<script lang="ts">
  import Botao from "$components/assets/buttons/Botao.svelte";
  import Input from "$components/assets/input/Input.svelte";
  import InputMultiplos from "$components/assets/input/InputMultiplos.svelte";
  import Number from "$components/assets/input/Number.svelte";
  import Tag from "$components/assets/input/Tag.svelte";
  import PopUp from "$components/assets/modals/PopUp.svelte";
  import SvgClose from "$components/assets/svg/SvgClose.svelte";
  import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
  import { ProdutoVariacaoController } from "$lib/api/modules/produto/variacao/produto.variacao.controller";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import { effectBy } from "$lib/utils/utils.svelte";

  interface Form {
    nome: string;
    variacoes: string[];
  }

  interface Props {
    open: boolean;
    loading?: boolean;
    click: VoidFunction;
    idProduto: number;
  }

  let { open = $bindable(false), loading, idProduto, click }: Props = $props();

  let form = $state<Form>({
    nome: "",
    variacoes: [],
  });

  let modo = $state<"edicao" | "criacao">("criacao");
  let idEdicao = $state<number>(-1);

  const produtoController = new ProdutoController();

  export function modoEdicao(formEd: Form, idEd: number) {
    idEdicao = idEd;
    form = formEd;
    open = true;
    modo = "edicao";
  }

  async function salvar() {
    const tmp = [...form.variacoes]; //Porfavor não removam
    loading = true;
    let r, e;
    if (modo === "edicao") {
      [r, e] = await produtoController.editarAtributo(
        parseInt($idLoja),
        idProduto,
        idEdicao,
        {
          nome: form.nome,
          valores: tmp,
        }
      );
    } else {
      [r, e] = await produtoController.atribuirAtributo(
        parseInt($idLoja),
        idProduto,
        {
          nome: form.nome,
          valores: tmp,
        }
      );
    }
    loading = false;
    if (e) {
      return;
    }
    open = false;
    click();
  }

  effectBy(
    () => [open],
    () => {
      if (open === false) {
        modo = "criacao";
        form = {
          nome: "",
          variacoes: [],
        };
      }
    }
  );
</script>

<PopUp bind:open withCloseButton={false} withDefaultPadding={false}>
  <div
    class="flex flex-col border border-soft-200 overflow-hidden p-4 pt-[10px] rounded-[16px] w-[640px] px-0 gap-4"
  >
    <div class="flex w-full items-center justify-between px-4">
      <p class="text-16 font-medium text-strong-950">{"Cadastrar Atributo"}</p>
      <button onclick={() => (open = !open)}>
        <SvgClose />
      </button>
    </div>

    <div class="border-b border-soft-200"></div>

    <div class="flex flex-col gap-3 px-5">
      <Input
        label="Nome do atributo"
        placeholder="Ex: cor"
        mandatory={true}
        bind:value={form.nome}
        extraTip={"String"}
      />
      <Tag
        placeholder="Insira seus valores"
        label="Variações do atributo"
        mandatory={true}
        bind:tags={form.variacoes}
      />
    </div>

    <div class="w-full h-[1px] bg-soft-200"></div>
    <div class="grid grid-cols-2 gap-3 px-4 h-[40px]">
      <Botao onClick={() => (open = false)} tema={"transparent"}>Voltar</Botao>
      <Botao onClick={salvar} {loading} tema={"primary"}>
        {modo == "criacao" ? "Cadastrar" : "Editar"}
      </Botao>
    </div>
  </div>
</PopUp>
