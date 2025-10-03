<script lang="ts">
    import Botao from "$components/assets/buttons/Botao.svelte";
    import Number from "$components/assets/input/Number.svelte";
    import TextArea from "$components/assets/input/TextArea.svelte";
    import FillText from "$components/assets/limiter/FillText.svelte";
    import SidePop from "$components/assets/modals/SidePop.svelte";
    import SvgTrash from "$components/assets/svg/SvgTrash.svelte";
    import SvgX from "$components/assets/svg/SvgX.svelte";
    import UploadMin from "$components/assets/upload/UploadMin.svelte";
    import FileMimic from "$components/elements/card/FileMimic.svelte";
  import { DenunciaLojistaController } from "$lib/api/modules/denuncias/denuncias.controller";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import toast from "$lib/utils/toast.svelte";

  
   
    interface Props{
      open:boolean
      idDenuncia:number
    }  
  
    let {open = $bindable(),idDenuncia}:Props = $props()

    let formImage = $state<{
        file:File | null,
        data64:string
    }[]>([])
    
    let form = $state({
        resposta:""
    })
    let loading = $state(false)
  
    const denunciaController = new DenunciaLojistaController(parseInt($idLoja))

    async function enviar(){
      loading=true

      const [r,e] = await denunciaController.responder(idDenuncia,form)
      loading=false  
      if(e){
        return toast.alert(e.message,"")
      }
      formImage.forEach((obj)=>{
        denunciaController.anexar(idDenuncia,obj.file!).then((obj2)=>{
          console.log(obj2)
        });
      })
      open=false
    }
  
  </script>
  
  
  
  <SidePop bind:open withDefaultPadding={false} curved={true} >
          <div class="flex flex-col grow justify-between w-full">
              <div class="flex flex-col">
                  {@render main()}
              </div>
              <div class="pt-2 border-t border-soft-200">
                  <div class="grid grid-cols-2 gap-x-3 px-5 h-[40px]">
                      <Botao tema="gray-transparent" onClick={()=>{
                        open=false
                      }}>
                        Cancelar
                      </Botao>
                      <Botao tema="primary" {loading} onClick={enviar}>
                        Enviar
                      </Botao>
                  </div>               
              </div>
          </div>  
  </SidePop>
  
  
  {#snippet main()}
      <div class="flex justify-between px-5 w-full text-[16px] pb-4 border-b border-soft-200">
            Responder denúncia
            <button onclick={()=>open=false} class="p-1">
              <SvgX props={{
                  class:"fill-sub-600"
              }}/>
            </button>
      </div>
      <div class="flex flex-col px-5 gap-3 mt-3">
        <TextArea  mandatory={true} bind:value={form.resposta} label="Resposta  " placeholder="Envia sua mensagem aqui" limit={500}/>
      </div>
      <div class="mt-3"></div>
      <FillText texto="EVIDÊNCIAS"/>
      <div class="grow w-full mt-4 px-5">
        <UploadMin size="w-full h-[160px]" formImage={{
            data64:"",
            file:null
          }} 
          onDelete={()=>{}}
          onNewFile={(e)=>{
            formImage.push(...e)
          }}/>
          <div class="flex flex-col gap-4 mt-4">
            {#each formImage as image,index}
                <div class="border border-soft-200 p-2 px-3 rounded-[8px] flex justify-between">
                    <div class="flex items-center gap-3">
                        <FileMimic mimetype={image.file!.type}/>
                        <div class="flex flex-col text-[12px] w-[180px]">
                            <b class="font-medium truncate">
                                {image.file!.name}
                            </b>
                            <span class="text-left font-light">
                                {(image.file!.size/(1024*10)).toFixed(2)}MB
                            </span>
                        </div>
                    </div>

                    <button onclick={()=>{
                        formImage = formImage.filter((obj,i)=>i!==index)
                    }} class="p-1">
                        <SvgTrash props={{
                            class:"fill-sub-600"
                        }}/>
                    </button>
                </div>
            {/each}
          </div>
      </div>
  {/snippet}
  