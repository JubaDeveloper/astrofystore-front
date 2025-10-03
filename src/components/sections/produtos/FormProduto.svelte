<script lang="ts">
  import Botao from '$components/assets/buttons/Botao.svelte';
  import Input from '$components/assets/input/Input.svelte';
  import TextArea from '$components/assets/input/TextArea.svelte';
  import FillText from '$components/assets/limiter/FillText.svelte';
  import SelectBlock from '$components/assets/logic/SelectBlock.svelte';
  import BubbleWrapper from '$components/elements/wrappers/BubbleWrapper.svelte';
  import InputWrapper from '$components/elements/wrappers/InputWrapper.svelte';
  import categoriaController from '$lib/api/modules/categoria/categoria.controller';
    import type { Categoria, Produto, ProdutosForm } from '$lib/api/modules/produto/produto.dto.svelte';
  import validacaoInputNormalizada from '$lib/utils/input.svelte';
  import sinalizador from '$lib/utils/signal.svelte';
  import type { Option } from '$lib/utils/types';
    import { generateSlug } from '$lib/utils/utils.svelte';
  import { onMount } from 'svelte';
  import ModalCriarCategoria from '../categorias/ModalCriarCategoria.svelte';
  import { page } from '$app/state';
    import toast from '$lib/utils/toast.svelte';

  interface Props {
    loading?: any,
    form: ProdutosForm,
    produtoEdicao:Produto | null | undefined
    onContinuar: VoidFunction,
  }

  let {
    produtoEdicao,
    loading = $bindable(),
    form = $bindable(),
    onContinuar,
  } : Props = $props()


  let openCategoria = $state(false)
  let optionsCategoria = $state<Option[]>([])

  let hasCategoria = $state(true)

  async function listarCategorias(){

    const [data,error] = await categoriaController.listar(parseInt(page.params.id),{
      quantidade:100
    })
    if(error){
      return toast.error('Erro ao listar categorias', error.message)
    }
    optionsCategoria = data.resultado.map((obj:any)=>{
      return{
        label:obj.nome,
        value:obj.id
      }
    })
    if(produtoEdicao){
      form.categoriaId = produtoEdicao.categoria ? produtoEdicao.categoria.id : undefined
      if(!produtoEdicao.categoria) return
      const tmp = {label: produtoEdicao.categoria.nome,
        value: produtoEdicao.categoria.id
        }
      optionsCategoria = optionsCategoria.filter((obj:any) => obj.value != tmp.value)
      optionsCategoria = [tmp, ...optionsCategoria]
    }
    

  }
  
  async function continuar(){

    if(validacaoInputNormalizada.NaoVazio(form.nome,"da") || validacaoInputNormalizada.NotNull(form.categoriaId,"sadas")){

      if(!form.categoriaId) hasCategoria=false
      sinalizador.sendSignal("validarInputs");
      return
    }

    onContinuar()
  }

  $effect(()=> {
    if(form.nome) form.urlAmigavel = generateSlug(form.nome)
  })

  onMount(()=> listarCategorias())
</script>

<BubbleWrapper css="w-[440px] px-0 gap-4">
  <div class="flex w-full items-center justify-between px-4">
      <p class="text-16 font-medium text-strong-950">{'Informações do produto'}</p>
  </div>

  <!-- <FillText texto="DADOS DO PRODUTO"/> -->
  <div class="border-b border-soft-200"></div>

  {@render formulario()}
  
  <div class="w-full h-[1px] bg-soft-200"></div>
  <div class="grid grid-cols-2 gap-3 px-4 h-[40px]">
    <Botao onClick={()=> window.history.back()} {loading} tema={"transparent"}>
      Cancelar
    </Botao>
    <Botao onClick={continuar} {loading} tema={"primary"}>
      Continuar
    </Botao>
  </div>
</BubbleWrapper>

{#snippet formulario()}
  <div class="flex flex-col px-4 gap-3 w-full">
      <Input label="Nome do produto" placeholder="Digite o nome do produto" 
      validate={()=>validacaoInputNormalizada.NaoVazio(form.nome,"Insira o nome do produto")} mandatory={true} bind:value={form.nome}/>
      <Input label="Slug" extraTip={'Esse item vai representar'} placeholder="/" mandatory={true} bind:value={form.urlAmigavel!}/>
      <InputWrapper 
      label="Categoria" 
      mandatory={true} 
      value="" 
      error={hasCategoria ? "" : "Insira uma categoria para o produto"}
      rightSide={btnCategoria}>
        <SelectBlock hasError={!hasCategoria} onGainFocus={()=>{
          hasCategoria=true
        }}
        bind:value={form.categoriaId} options={optionsCategoria} 
        placeholder="Selecione"/>
      </InputWrapper>
      <TextArea label="Descrição" placeholder="Descreva o produto para o cliente" bind:value={form.descricao!} limit={200} />
  </div>
{/snippet}


{#snippet btnCategoria()}

  <button class="text-[12px] text-sub-600 underline font-medium" onclick={()=>openCategoria=true}>
    Criar categoria
  </button>

{/snippet}

<ModalCriarCategoria onSalvar={()=>listarCategorias()} bind:open={openCategoria}/>