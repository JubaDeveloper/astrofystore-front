<script lang="ts">
  import { goto } from "$app/navigation";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import Input from "$components/assets/input/Input.svelte";
  import TextArea from "$components/assets/input/TextArea.svelte";
  import SelectBlock from "$components/assets/logic/SelectBlock.svelte";
  import SvgChorandinho from "$components/assets/svg/historico/SvgChorandinho.svelte";
  import SvgSad from "$components/assets/svg/min/SvgSad.svelte";
  import SvgTrash from "$components/assets/svg/SvgTrash.svelte";
  import UploadMin from "$components/assets/upload/UploadMin.svelte";
  import BubbleWrapper from "$components/elements/wrappers/BubbleWrapper.svelte";
  import InputWrapper from "$components/elements/wrappers/InputWrapper.svelte";
  import PesquisaProduto from "$components/sections/loja/loja-publica/PesquisaProduto.svelte";
  import { DenunciaClienteController } from "$lib/api/modules/denuncias/denuncias.controller";
  import { DenunciaMotivosDto } from "$lib/api/modules/denuncias/denuncias.dto";
  import domainManager from "$lib/settings/domain.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
  import toast from "$lib/utils/toast.svelte";
  import { expoInOut } from "svelte/easing";
  import { scale } from "svelte/transition";

  const denunciaController = new DenunciaClienteController(domainManager.lojaId!)

  let form = $state ({
    motivo:DenunciaMotivosDto[0].value,
    produtoId:undefined,
    descricao:""
  })

  let disabled = $derived.by(()=>{
    if(!form.produtoId || !form.descricao) return true
    return false
  })
  let formImage = $state<{
        file:File | null,
        data64:string
    }[]>([])

  let loading = $state(false)

  let finalizado = $state(false)

  function voltar(){
    goto("/")
  }

  async function enviar(){
    loading = true
    const [r,e] = await denunciaController.denunciar(form);
    if(e){
        loading=false
        goto("/")
        return sinalizador.sendMeGenericModal({
            label:"Não foi possivel denunciar este produto",
            desc:"Você já denunciou este produto da loja! Aguarde para que os administradores resolvam esta pendência",
            btnLabel:"Tudo bem, entendi!",
            icon:SvgSad
        })
        
    }
    formImage.forEach((obj)=>{
        denunciaController.anexar(r.data.id,obj.file!).then((obj2)=>{
          console.log(obj2)
        });
    })
    loading=false
    finalizado=true
  }

</script>

 
<div class="flex items-center justify-center w-full grow">
    {#if finalizado===true}
        <div class="flex flex-col self-start mt-12 items-center absolute" transition:scale={{easing:expoInOut}}>
            <img src="/images/foguete.png" alt="" class="w-[300px]"/>
            <b class="font-medium text-[16px]">
                Denuncia enviada com sucesso!
            </b>
            <span class="text-sub-600 text-[14px] font-normal">
                Obrigado por tornar a plataforma um lugar muito melhor!
            </span>
            <div class="grid h-[40px] w-full mt-3">
                <Botao tema="primary" onClick={()=>{
                    goto("/")
                }}>
                    Retornar à loja
                </Botao>    
            </div>
        </div>

    {:else}
        <BubbleWrapper css="flex flex-col px-0 py-4 gap-2 w-[440px]">
            <span class="px-5 font-medium">
                Denunciar
            </span>
            <div class="w-full h-[1px] bg-soft-200"></div>
            <div class="flex flex-col px-5 gap-2">
                <InputWrapper label="Motivo" mandatory={true} value="">
                    <SelectBlock removableOnClick={false} placeholder="Seu motivo" options={DenunciaMotivosDto} bind:value={form.motivo}/>
                </InputWrapper>
                <PesquisaProduto bind:produtoId={form.produtoId}/>
                <TextArea limit={300} label="Descrição" mandatory={true} placeholder="Insira o motivo de sua denúncia" bind:value={form.descricao}/>
                <UploadMin size="w-full h-[160px]" formImage={{
                        data64:"",
                        file:null
                    }} 
                    onDelete={()=>{}}
                    onNewFile={(e)=>{   
                        const MAX_FILE_SIZE = 5 * 1024 * 1024;
                        e.forEach((obj)=>{
                            if(obj.file && obj.file.size<=MAX_FILE_SIZE){
                                formImage.push(obj)
                            }
                            else{
                                toast.alert("Arquivo excedeu limite de tamanho de 5MB","")
                            }
                        })
                    }}/>
                    <div class="grid grid-cols-4 flex-wrap gap-3.5">
                        {#each formImage as image,index}
                            <div class="relative w-[90px] group h-[90px] overflow-hidden shrink-0 grow-0 border border-soft-200 rounded-[8px]">
                                <img src={image.data64} class="object-cover w-[90px] h-[90px] shrink-0 grow-0" alt="">
                                <button onclick={()=>{
                                    formImage = formImage.filter((obj,i)=>i!==index)
                                }} class="p-1 absolute group-hover:opacity-100 opacity-0  right-0 top-0 m-0.5 bg-error-base rounded-md">
                                    <SvgTrash props={{
                                        class:"fill-white-0"
                                    }}/>
                                </button>
                            </div>
                        {/each}
                    </div>
            </div>
            <div class="pt-3 px-5 border-t border-soft-200">
                <div class="grid grid-cols-2 gap-3 h-[40px]">
                    <Botao tema="gray-transparent" onClick={voltar}>
                        Cancelar
                    </Botao>
                    <Botao tema="primary" disabled={disabled} {loading} onClick={enviar}>
                        Denunciar                
                    </Botao>
                </div>
                
            </div>        
        </BubbleWrapper>
    {/if}
</div>
