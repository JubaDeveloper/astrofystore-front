<script lang="ts">
  import CardInfoProduto from "$components/sections/produtos/CardInfoProduto.svelte";
  import CardImgProduto from "$components/sections/produtos/CardImgProduto.svelte";
  import GridProdutos from "$components/sections/produtos/GridProdutos.svelte";
  import SvgSetaDireita from "$components/assets/svg/SvgSetaDireita.svelte";
  import domainManager from "$lib/settings/domain.svelte";
  import toast from "$lib/utils/toast.svelte";

  import { LojaPublicaController } from "$lib/api/modules/loja-publica/loja.publica.controller";
  import type { ProdutoDetalhado } from "$lib/api/modules/produto/produto.dto.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import LoaderMinhocaExpend from "$components/assets/loading/LoaderMinhocaExpend.svelte";

  const lojaPublicaController = new LojaPublicaController();

  let produtos = $state<ProdutoDetalhado[]>([]);
  let loading = $state(true)
  let produto = $state<ProdutoDetalhado>({
    id: 0,
    nome: "",
    preco: 0,
    desconto: null,
    descricao: "",
    sku: null,
    urlAmigavel: "",
    ativo: true,
    lojaId: 0,
    criadoEm: "",
    atualizadoEm: "",
    categoria: {
      id: 0,
      nome: "",
    },
    estoque: null,
    variacoes: null,
    imagens: [],
    mediaAvaliacao: 0,
    quantidadeAvaliacoes: 0,
    atributos: [],
  });
  let dominio = $state("");
  let slug = $state("");

  async function produtoDetalhado() {
    const [res, err] = await lojaPublicaController.pegarProduto(dominio, slug);
    if (err) return toast.error("Mensagem do sistema", err.message);
    produto = res.data;
    console.log(produto)

  }
  async function listarProdutos() {
    const [res, err] = await lojaPublicaController.listarProdutos(dominio, {});
    if (err) return toast.error("Mensagem do sistema", err.message);
    produtos = res.data.resultado;

  }

  onMount(() => {
    dominio = domainManager.ultimoDominioAcessado!;
    slug = page.params.slug;

    Promise.all([produtoDetalhado(),listarProdutos()]).then(()=>{
      loading=false
    })


  });
</script>

<div class="flex flex-col grow gap-8 p-4">
  {#if loading}
    <div class="w-full grow flex items-center justify-center">
      <LoaderMinhocaExpend label="Carregando dados do produto"/>
    </div>
  {:else}
    <div class="flex items-center gap-1.5">
      <button class="text-14 font-medium text-sub-600" onclick={() => goto("/")}
        >Início</button
      >
      <SvgSetaDireita props={{ fill: "#CACFD8" }} />
      <button class="text-14 font-medium text-sub-600"
      onclick={()=>{
        goto("/categoria/"+produto.categoria.nome)
      }}
        >{produto.categoria.nome}</button
      >
      <SvgSetaDireita props={{ fill: "#CACFD8" }} />
      <span class="text-14 font-medium text-sub-600">{produto.nome}</span>
    </div>
    <div class="flex items-start gap-6">
      <CardImgProduto produtoId={produto.id} />
      <CardInfoProduto {produto} />
    </div>
    <GridProdutos title={"Produtos relacionados"} {produtos} />
  {/if}
</div>
