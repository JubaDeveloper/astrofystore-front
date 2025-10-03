<script lang="ts">
  import Botao from '$components/assets/buttons/Botao.svelte';
  import Tip from '$components/assets/labels/Tip.svelte';
  import UploadMin from '$components/assets/upload/UploadMin.svelte';
  import BubbleWrapper from '$components/elements/wrappers/BubbleWrapper.svelte';
  import type { ProdutosForm } from '$lib/api/modules/produto/produto.dto.svelte';
  import toast from '$lib/utils/toast.svelte';
  import { effectBy } from '$lib/utils/utils.svelte';
  import ShortUniqueId from 'short-unique-id';
  import {dndzone, type DndEvent} from "svelte-dnd-action";
  import { flip } from 'svelte/animate';

  interface Props {
      formImages:formIm[],
      form:ProdutosForm,
      loading:boolean,
      salvar: (idsDelete:string[],idsOrdem:string[])=>void,
      back:VoidFunction,
      modo?:"criacao" | "edicao"
  }

  type formIm = {
    file:File | null,
    data64:string,
    id:string,
  }

  let {
    form = $bindable(),
    loading,
    formImages: formImages = $bindable(),
    back,
    salvar,
    modo="criacao"
  }: Props = $props()


  let idsDelete = $state<string[]>([])
  let idsOrdem = $derived.by<string[]>(()=>{
    return formImages.filter((obj)=>obj.id!=="" && obj.data64.length>0).map((obj)=>{
      return obj.id
    })
  })

  const shortU = new ShortUniqueId()

  function handleDndConsider(e:CustomEvent<DndEvent<formIm>>){
    formImages=e.detail.items
  }
  function handleDndFinalize(e:CustomEvent<DndEvent<formIm>>){
    formImages=e.detail.items
  }

  function continuar(){

    if(formImages.length<=1){
      return toast.alert("Insira pelo menos uma imagem para esse produto","Para prosseguir preencha todas as informações de cadastro desse produto")
    }

    salvar(idsDelete,idsOrdem)
  }

</script>

<div class="flex items-start gap-6">
  <BubbleWrapper css="w-[440px] px-0 gap-4">
      <div class="flex w-full items-center justify-between px-4">
          <p class="text-16 font-medium text-strong-950">{'Imagens do produto'}</p>
      </div>

      <div class="border-b border-soft-200"></div>


      <div class="px-5 flex flex-col gap-1 text-sub-600 text-[14px]">
        <div class="flex items-center gap-1 text-strong-950 font-medium">
          Galeria
          {#if formImages.length>1}
          <b class="text-sub-600 font-normal">
            ({formImages.length-1} imagens)
          </b> 
          {/if}
  
        </div>
        <div class="grid w-full mb-1 gap-x-2 gap-y-5 {formImages.length>1 ? "grid-cols-2" : "grid-cols-1"}"
          use:dndzone={{
            items:formImages,
            flipDurationMs:400,
            dragDisabled:formImages.length<=1
          }}  
          onconsider={handleDndConsider} onfinalize={handleDndFinalize}>
          {#each formImages as formIm,i(formIm.id)}
            <div animate:flip={{duration:400}}>
              <UploadMin bind:formImage={formImages[i]} 
              size={formImages.length>1 ? "w-[200px] h-[200px]" : " w-full h-[202px]"}
              onDelete={()=>{
                if(modo==="edicao"){
                  idsDelete.push(formIm.id)
                }
                formImages = formImages.filter((obj,index)=>index!==i)
              }}
              onNewFile={(f)=>{
                formImages = formImages.filter((o,i2)=>i2!==i)
                f.forEach((obj)=>{
                  formImages.push({
                    file:obj.file,
                    data64:obj.data64,
                    id: shortU.rnd(10)
                  })
                })
                formImages.push({
                  file:null,
                  data64:"",
                  id: shortU.rnd(10)
                })
              }}/>       
            </div>
           {/each}
        </div>
        <Tip type="tip" label="A primeira imagem será a imagem principal."/>
      </div>

      <div class="w-full h-[1px] bg-soft-200"></div>

      <div class="grid grid-cols-2 gap-3 px-4 h-[40px]">
          <Botao onClick={back} disabled={loading} tema={"transparent"}>
              Voltar
          </Botao>
          <Botao onClick={continuar} {loading} tema={"primary"}>
              Continuar
          </Botao>
      </div>
  </BubbleWrapper>

</div>

