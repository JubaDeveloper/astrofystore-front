<script lang="ts">
  import Botao from "$components/assets/buttons/Botao.svelte";
  import Input from "$components/assets/input/Input.svelte";
  import PopUp from "$components/assets/modals/PopUp.svelte";
  import categoriaController from "$lib/api/modules/categoria/categoria.controller";
  import type { Categoria } from "$lib/api/modules/produto/produto.dto.svelte";
  import validacaoInputNormalizada from "$lib/utils/input.svelte";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
  import toast from "$lib/utils/toast.svelte";

  interface Props{
    open:boolean
    onSalvar:VoidFunction
    categoria?:Categoria
  }

  let form = $state({
    nome:"",
    slug:""
  })
  let loading = $state(false)
  let {open=$bindable(),onSalvar,categoria = $bindable()}:Props = $props()


  async function salvar(){
    if(validacaoInputNormalizada.NaoVazio(form.nome,"sdad")){
        sinalizador.sendSignal("validarInputs")
        return
    }
    loading=true

    
    if(categoria){
      const body = {...form}
      if(categoria.slug===form.slug){
        //@ts-ignore
        delete body.slug
      }

      if(categoria.nome===form.nome){
        //@ts-ignore
        delete body.nome
      }
      const [d,e] = await categoriaController.editar(parseInt($idLoja),categoria.id,body)
      if(e){
          toast.error("Erro ao editar categoria",e.message)
          loading=false
          return
      }
      categoria=undefined
    }
    else{
      const [d,e] = await categoriaController.criar(parseInt($idLoja),form)
      if(e){
          toast.error("Erro ao criar categoria",e.message)
          loading=false
          return
      }
    }

    open=false
    loading=false
    form.nome=""
    onSalvar()
  }

  $effect(()=>{
    if(categoria){
      form.nome=categoria.nome
      form.slug = categoria.slug
    }
  })


</script>

<PopUp bind:open withCloseButton={false} withDefaultPadding={false}>
    <div class="flex flex-col border border-soft-200 overflow-hidden p-4 pt-[10px] rounded-[16px] w-[640px] px-0 gap-4">
      <div class="flex w-full items-center justify-between px-4">
        <div class="flex flex-col">
          <p class="text-16 font-medium text-strong-950">{'Informações do produto'}</p>
          <p class="text-14 font-normal text-sub-600">Preencha os campos abaixo para criar uma nova categoria</p>
        </div>
      </div>

      <div class="border-b border-soft-200"></div>

      <div class="flex flex-col gap-3 px-5">
        <Input label="Nome da categoria" validate={()=>validacaoInputNormalizada.NaoVazio(form.nome,"Nome de categoria não pode ser vazio")} 
        placeholder="Ex: jogos" mandatory={true} bind:value={form.nome}/>
        <Input label="Slug" placeholder="Ex: jogos" mandatory={true} bind:value={form.slug}/>
      </div>

      <div class="w-full h-[1px] bg-soft-200"></div>
      <div class="grid grid-cols-2 gap-3 px-4 h-[40px]">
        <Botao onClick={()=> open=false} tema={"transparent"}>
          Cancelar
        </Botao>
        <Botao onClick={salvar} {loading} tema={"primary"}>
          {#if categoria}
          Editar categoria
          {:else}
          Criar categoria
          {/if}
        </Botao>
      </div>
    </div>
</PopUp>