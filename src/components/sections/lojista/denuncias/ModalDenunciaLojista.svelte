<script lang="ts">
    import { goto } from "$app/navigation";
    import Avatar from "$components/assets/avatar/Avatar.svelte";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import FillText from "$components/assets/limiter/FillText.svelte";
    import LoaderMinhocaExpend from "$components/assets/loading/LoaderMinhocaExpend.svelte";
    import SidePop from "$components/assets/modals/SidePop.svelte";
    import SvgCaret from "$components/assets/svg/SvgCaret.svelte";
    import SvgCiclo from "$components/assets/svg/SvgCiclo.svelte";
    import SvgX from "$components/assets/svg/SvgX.svelte";
    import Tabs from "$components/assets/tabs/Tabs.svelte";
    import CardDownload from "$components/elements/card/CardDownload.svelte";
    import IconDenuncia from "$components/elements/card/IconDenuncia.svelte";
    import ListAvatar from "$components/elements/card/ListAvatar.svelte";
    import NomeItem from "$components/elements/tabela/componentes/nomeItem.svelte";
    import LabelSoft from "$components/elements/wrappers/LabelSoft.svelte";
  import SideBar from "$components/sections/nav/SideBar.svelte";
    import avatarController from "$lib/api/modules/avatar/avatar.controller";
    import { denunciaAdminController, DenunciaLojistaController } from "$lib/api/modules/denuncias/denuncias.controller";
    import { DENUNCIA_STATUS_ENUM, type DenunciaDetalhadaDto, type DenunciaLojistaDetalhesDto, type DenunciaLojistaDto } from "$lib/api/modules/denuncias/denuncias.dto";
    import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
    import handleDate from "$lib/sanitizers/time";
  import { idLoja } from "$lib/utils/rotas.svelte";
    import storageService from "$lib/utils/storageService";
    import toast from "$lib/utils/toast.svelte";
  import ModalResponderLojistaDenuncia from "./ModalResponderLojistaDenuncia.svelte";

    interface Props{
      open:boolean
      idDenuncia:number
    }
  
    const denunciaController = new DenunciaLojistaController(parseInt($idLoja))

    let {open = $bindable(),idDenuncia}:Props = $props()
  
    let loading = $state(false)
    let openNotificar = $state(false)
  
    let denuncia = $state<DenunciaLojistaDetalhesDto>()
    let visualizacao = $state<"Detalhes" | "Resposta">("Detalhes")
  

    async function mainClick(){
        open=false
        if(denuncia!.status==="NOTIFICADO"){
            openNotificar=true
        }
    }
  
    async function mount(){
        loading = true
        const [r,e] = await denunciaController.pegar(idDenuncia)
        if(e){
            toast.error("Erro ao abrir denuncia",e.message)
            open=false
            loading=false
            return
        }
        denuncia = r.data
        console.log(denuncia)
        loading = false
    }  

    $effect(()=>{
        if(open===true) mount()
    })
  
  </script>


  
  
  
  <SidePop bind:open withDefaultPadding={false} curved={true} >
      {#if loading}
          <div class="h-full flex items-center grow justify-center w-full">
              <LoaderMinhocaExpend label="Carregando dados da denúncia" />
          </div>
      {:else if denuncia}
          <div class="flex flex-col grow justify-between w-full">
              <div class="flex flex-col w-full">
                  {@render main()}
              </div>
              <div class="pt-2 border-t border-soft-200">
                  <div class="grid  gap-x-3 px-5 h-[40px]">
                      <Botao tema={(
                        denuncia.status===DENUNCIA_STATUS_ENUM.NOTIFICADO
                    )
                      ? "primary" :  "gray-transparent"} onClick={mainClick}>
                                {#if (
                                denuncia.status===DENUNCIA_STATUS_ENUM.NOTIFICADO
                                )}
                                    Responder
                                {:else}
                                    Voltar
                                {/if}
                      </Botao>
                  </div>               
              </div>
          </div>
  
      {/if}
  </SidePop>
  
  
  {#snippet main()}
  {#if denuncia}
      <div class="flex justify-between px-5 w-full">
          <IconDenuncia status={denuncia.status as DENUNCIA_STATUS_ENUM} motivo={denuncia.status}/>
          <button onclick={()=>open=false} class="p-1">
              <SvgX props={{
                  class:"fill-sub-600"
              }}/>
          </button>
      </div>
      <div class="pt-3 mt-4 border-t w-full border-soft-200">
          <Tabs bind:labelSelected={visualizacao} options={[
              {
              label:"Detalhes",
              },
              {
              label:"Resposta",
              }
          ]}/>    
      </div>
      {@render detalhes()}
  
  {/if}
  {/snippet}
  
  {#snippet detalhes()}
  {#if denuncia}

    <div class="flex flex-col px-5 mt-5 gap-3 w-full">
        {#if visualizacao==="Detalhes"}
            <LabelSoft label="MENSAGEM">
                <b class="font-medium">
                    {denuncia.mensagem ?? "Nenhuma mensagem registrada no momento."}
                </b>
            </LabelSoft>
        {:else}
            <LabelSoft label="RESPOSTA">
                <b class="font-medium">
                    {denuncia.resposta ?? "Nenhuma resposta registrada no momento."}
                </b>
            </LabelSoft>
        {/if}
    </div>
    <div class="flex flex-col gap-3 w-full mt-5">
      <FillText texto="EVIDÊNCIAS"/>
      <div class="grid grid-cols-2 gap-4 items-center max-h-[200px] overflow-y-auto px-5">
            {#if denuncia.anexos.length===0}
                <span class="text-sub-600 text-[12px]">
                    Nenhuma evidência anexada
                </span>
            {:else}
                {#each denuncia.anexos as evidencia}
                    <CardDownload url={evidencia.arquivo.url ?? ""} mimetype={evidencia.arquivo.tipo} filename={evidencia.arquivo.nome} size="3000"/>
                {/each} 
            {/if}
      </div>
       <FillText texto="PRODUTO"/>
          {@render imagemNome(denuncia.produto.categoria,denuncia.produto.categoria,"",()=>goto("")
          )} 
  </div>
  {/if}
  {/snippet}
  
  
  {#snippet imagemNome(nome:string,desc:string,imagem:string,action:VoidFunction)}
      
  <button class="group relative flex items-center gap-5 px-5 justify-between w-full" onclick={action}>
      <div
      class="absolute w-full h-full bg-soft-200/20 z-0 left-0 translate-x-[-100%] ease-in-out group-hover:translate-x-0"
    ></div>
      <div class="flex items-center gap-3">
          <div class="shrink-0">
              <Avatar name={nome} src={imagem} size="w-[48px]"/>
          </div>
          <div class="flex flex-col items-start">
              <p class="text-[14px] font-medium text-strong-950 text-left">{nome}</p>
              <p class="text-[12px] font-normal text-sub-600">{desc}</p>
          </div>    
      </div>
      <SvgCaret props={{
          class:"-rotate-90 shrink-0"
      }}/>
  </button>
  {/snippet}
  
  <ModalResponderLojistaDenuncia bind:open={openNotificar} idDenuncia={idDenuncia}/>