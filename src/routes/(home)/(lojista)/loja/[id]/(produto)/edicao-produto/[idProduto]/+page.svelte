<script lang="ts">
      import { goto } from '$app/navigation';
      import { page } from '$app/state';
      import Botao from '$components/assets/buttons/Botao.svelte';
      import SvgAlertaStroke from '$components/assets/svg/SvgAlertaStroke.svelte';
      import SvgImagem from '$components/assets/svg/SvgImagem.svelte';
      import SvgTrofeu from '$components/assets/svg/SvgTrofeu.svelte';
      import SvgX from '$components/assets/svg/SvgX.svelte';
      import StepIndicator from '$components/elements/progress/StepIndicator.svelte';
      import BubbleWrapper from '$components/elements/wrappers/BubbleWrapper.svelte';
      import FormProduto from '$components/sections/produtos/FormProduto.svelte';
      import FormProdutoImg from '$components/sections/produtos/FormProdutoImg.svelte';
      import { ProdutoController } from '$lib/api/modules/produto/produto.controller.svelte';
      import type { Produto, ProdutosForm } from '$lib/api/modules/produto/produto.dto.svelte';
      import { idLoja } from '$lib/utils/rotas.svelte';
      import toast from '$lib/utils/toast.svelte';
      import { onMount } from 'svelte';
  
      const buttons = [
        { label:"Informações", icon: SvgAlertaStroke },
        { label:"Imagens", icon: SvgImagem },
      ]
 
      let form = $state<ProdutosForm>({
        nome: '',
        categoriaId:undefined,
        urlAmigavel: '',
        lojaId:parseInt(page.params.id),
        descricao: '',
        ativo: false,
        preco: null
      })
  
      let formImages = $state([{
        data64:"",
        file:null,
        id:"",
      }])
  
      let etapaAtual = $state<number>(1)
      let loading = $state(false)
      let loadingWholeForm = $state(true)
      let idProduto = $state<number>(-1)
      let produtoEdicao = $state<Produto>()
      let produtoRecemSalvo = $state<Produto>()
  
      const produtoController = new ProdutoController()

      async function salvar(idsDelete:string[],idsOrdem:string[]) {
          loading = true

          const body = {...form}

          if(!body.descricao || body.descricao === "") delete body.descricao

          //Temporario
          if(!body.preco) body.preco=0

          delete body.lojaId
          
          const  [res, err] = await produtoController.atualizar(parseInt($idLoja),idProduto,body)
          if(err){
            toast.error('Mensagem do sistema.', err.message)
            return loading = false
          }
          produtoRecemSalvo=res.data  
          reodernar(idsDelete,idsOrdem)
      }

      async function reodernar(idsDelete:string[],idsOrdem:string[]){
        const [r,e] = await produtoController.deletarImagens(parseInt($idLoja),idProduto,idsDelete)
        let novaOrdem:string[] = await Promise.all(
          idsOrdem.map(async(obj)=>{
            if(!parseInt(obj)){
              const file = formImages.find((objIm)=>objIm.id===obj);
              if(!file || !file.file) return
              const [r,e] = await produtoController.atribuirImagem(parseInt($idLoja),idProduto,file.file)
              return r.data[0].id.toString()
            }
            else{
              return obj
            }
          })
        )
        const [r2,e2] = await produtoController.alterarOrdemImagens(parseInt($idLoja),idProduto,novaOrdem)
        etapaAtual++
        loading = false

      }
  
      onMount(async()=>{
        const tmp = parseInt(page.params.idProduto)
        const [data,error] = await new ProdutoController().pegar(parseInt(page.params.id),tmp)
        if(error){
          toast.error("Produto não encontrado","Tente novamente")
          loadingWholeForm=false
          return
        }
        idProduto = tmp
        produtoEdicao=data
        form.nome=data.nome
        form.categoriaId = data.categoria ? data.categoria.id : undefined,
        form.descricao = data.descricao
        form.ativo = data.ativo
        const [list,error2] = await new ProdutoController().listarImagens(produtoEdicao.id)
        list.imagens.forEach((obj:any)=>{
          formImages.push({
            data64: new ProdutoController().pegarImagem(produtoEdicao!.id,obj.id),
            file:null,
            id: obj.id.toString()
          })
        })
        loadingWholeForm=false
      })
  
  </script>
  
  <div class="flex flex-col gap-6 h-full">
    {@render header()}
    <div class="relative flex w-full {etapaAtual==3 ? "justify-center items-center" : ""} gap-4">
        {#if etapaAtual<3}
        {@render sideMenu()}        
        {/if}
        {#if !loadingWholeForm}
        <div class="flex items-start ">
            {#if etapaAtual === 1}
              <div class="absolute">
                <FormProduto {produtoEdicao} bind:form onContinuar={()=> etapaAtual++}/>
              </div>
            {:else if etapaAtual === 2}
              <div class="absolute">
                <FormProdutoImg {loading} modo="edicao" bind:formImages={formImages} bind:form back={()=>etapaAtual--} salvar={salvar}/>
              </div>
            {:else}
               {@render finalizado()}
            {/if}
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
        Produto editado com sucesso!
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
    <div class="flex w-full items-center justify-between border-b border-soft-200 py-2 pb-5">
        <span class="text-[18px] font-medium">
              Edição de produto
        </span>
        
        <button onclick={()=> window.history.back()}>
            <SvgX props={{
                class:"fill-sub-600"
            }}/>
        </button>
    </div>
  {/snippet}
  
  {#snippet sideMenu()}
  <BubbleWrapper css="w-[256px] px-0">
      <span class="text-sub-600 text-[12px] px-4 font-normal mb-2">MENU</span>
      <div class="px-2">
          <StepIndicator format="col" indicator="icon" steps={buttons} bind:currentStep={etapaAtual} click={true}/>
      </div>
  </BubbleWrapper>
  {/snippet}
  <style>
  
  .user-gradient{
          background: linear-gradient(180deg, rgba(113, 119, 132, 0.10) 0%, rgba(113, 119, 132, 0.00) 100%);
      }
  </style>