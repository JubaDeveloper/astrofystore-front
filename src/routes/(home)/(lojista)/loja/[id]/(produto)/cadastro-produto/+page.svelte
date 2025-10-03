<script lang="ts">
    import { goto } from '$app/navigation';
  import { page } from '$app/state';
    import Botao from '$components/assets/buttons/Botao.svelte';
    import SvgTrofeu from '$components/assets/svg/SvgTrofeu.svelte';
    import SvgX from '$components/assets/svg/SvgX.svelte';
    import StepIndicator from '$components/elements/progress/StepIndicator.svelte';
    import FormProduto from '$components/sections/produtos/FormProduto.svelte';
    import FormProdutoImg from '$components/sections/produtos/FormProdutoImg.svelte';
    import { ProdutoController } from '$lib/api/modules/produto/produto.controller.svelte';
    import type { Produto, ProdutosForm } from '$lib/api/modules/produto/produto.dto.svelte';
    import { idLoja } from '$lib/utils/rotas.svelte';
    import toast from '$lib/utils/toast.svelte';

    const passosNovoProduto = [
      { label:"Informações Básicas" },
      { label:"Galeria" },
    ]

    let form = $state<ProdutosForm>({
      nome: '',
      categoriaId: undefined,
      lojaId:parseInt(page.params.id),
      urlAmigavel: '',
      descricao: '',
      ativo: true,
      preco: null
    })

    let formImages = $state([{
      data64:"",
      file:null,
      id:"",
    }])

    let etapaAtual = $state<number>(1)
    let loading = $state(false)
    let produtoEdicao = $state<Produto>()
    let produtoRecemSalvo = $state<Produto>()

    const produtoController = new ProdutoController()

    async function salvar() {
        loading = true
        
        const body = {...form}
        const lojaId = parseInt($idLoja)
        
        if(!body.descricao || body.descricao === "") delete body.descricao
        delete body.preco
        delete body.ativo
        delete body.lojaId
        const [res, err] = await produtoController.criar(body,lojaId)
        if(err){
          toast.error('Mensagem do sistema.', err.message)
          return loading = false
        }
        const idTmp = res.id
        formImages.forEach((obj)=>{
            if(!obj.file) return
            produtoController.atribuirImagem(lojaId ,idTmp,obj.file)
        })

        loading = false
        produtoRecemSalvo=res
        etapaAtual++

    }

</script>

<div class="flex flex-col gap-6 h-full">
  {@render header()}
  <div class="flex items-start grow justify-center">
      {#if etapaAtual === 1}
        <div class="absolute">
          <FormProduto {produtoEdicao} bind:form={form} onContinuar={()=> etapaAtual++}/>   
        </div>
      {:else if etapaAtual === 2}
        <div class="absolute">
          <FormProdutoImg {loading} bind:formImages={formImages} bind:form back={()=>etapaAtual--} salvar={salvar}/>
        </div>
      {:else}
          <div class="absolute">
            {@render finalizado()}
          </div>
      {/if}
    </div>
</div> 

{#snippet finalizado()}
<div class="flex flex-col w-[521px] h-full items-center pt-40">
  <div class="user-gradient rounded-full w-[96px] aspect-square flex justify-center items-center">
    <div class="rounded-full border border-soft-200 shadow-sm w-[64px] aspect-square bg-white-0 flex justify-center items-center">
        <SvgTrofeu/>
    </div>
  </div>  
  <h5 class="mt-2 font-medium">
      Produto criado com sucesso!
  </h5>
  <span class="text-[16px] font-medium text-center text-sub-600">
    O próximo passo é configurar o estoque para que ele apareça na sua loja.
  </span>
  <div class="grid grid-cols-2 h-[40px] w-[335px] mt-4 gap-x-2">
      <Botao tema="gray-transparent" onClick={()=>{
        goto(`/loja/${$idLoja}/produtos`)
      }}>
          Ver meus produtos
      </Botao>
      <Botao tema="primary" onClick={()=>{
        goto(`/loja/${$idLoja}/cadastro-estoque/${produtoRecemSalvo!.id}`)
      }}>
        Adicionar estoque
      </Botao>
  </div>

</div>
{/snippet}

{#snippet header()}
  <div class="flex w-full items-center relative justify-between border-b border-soft-200 py-4 pb-5">
      <span class="text-[18px] font-medium">
            Cadastro  de produto
      </span>
      
      <div class="absolute flex justify-center items-center w-full">
        <StepIndicator format="inline" steps={passosNovoProduto} currentStep={etapaAtual}/>
      </div>

      <button onclick={()=> window.history.back()}>
          <SvgX props={{
              class:"fill-sub-600"
          }}/>
      </button>
  </div>
{/snippet}

<style>
.user-gradient{
        background: linear-gradient(180deg, rgba(113, 119, 132, 0.10) 0%, rgba(113, 119, 132, 0.00) 100%);
    }
</style>