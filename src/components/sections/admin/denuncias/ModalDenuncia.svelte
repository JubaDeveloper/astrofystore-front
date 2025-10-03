<script lang="ts">
  import { goto } from "$app/navigation";
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import FillText from "$components/assets/limiter/FillText.svelte";
  import LoaderMinhocaExpend from "$components/assets/loading/LoaderMinhocaExpend.svelte";
  import SidePop from "$components/assets/modals/SidePop.svelte";
  import SvgChorandinho from "$components/assets/svg/historico/SvgChorandinho.svelte";
  import SvgSad from "$components/assets/svg/min/SvgSad.svelte";
  import SvgCaret from "$components/assets/svg/SvgCaret.svelte";
  import SvgCiclo from "$components/assets/svg/SvgCiclo.svelte";
  import SvgX from "$components/assets/svg/SvgX.svelte";
  import Tabs from "$components/assets/tabs/Tabs.svelte";
  import CardDownload from "$components/elements/card/CardDownload.svelte";
  import IconDenuncia from "$components/elements/card/IconDenuncia.svelte";
  import ListAvatar from "$components/elements/card/ListAvatar.svelte";
  import LabelSoft from "$components/elements/wrappers/LabelSoft.svelte";
  import avatarController from "$lib/api/modules/avatar/avatar.controller";
  import { denunciaAdminController } from "$lib/api/modules/denuncias/denuncias.controller";
  import { DENUNCIA_STATUS_ENUM, type DenunciaDetalhadaDto } from "$lib/api/modules/denuncias/denuncias.dto";
  import { ProdutoController } from "$lib/api/modules/produto/produto.controller.svelte";
  import handleDate from "$lib/sanitizers/time";
  import sinalizador from "$lib/utils/signal.svelte";
  import toast from "$lib/utils/toast.svelte";
  import ModalNotificacaoDenuncia from "./ModalNotificacaoDenuncia.svelte";

  interface Props{
    open:boolean
    idDenuncia:number
  }


  let {open = $bindable(),idDenuncia}:Props = $props()

  let denuncia = $state<DenunciaDetalhadaDto>()
  let loading = $state(false)
  let loadingBtn = $state(false)
  let openNotificar = $state(false)

  let visualizacao = $state<"Detalhes" | "Resposta" | "Denúncias">("Detalhes")

  async function buscarDenuncia(){
    loading = true
    const [r,e] = await denunciaAdminController.pegar(idDenuncia)
    denuncia = r.data
    console.log(r.data)
    loading = false
  }

  async function arquivar(){
    denunciaAdminController.arquivar(idDenuncia).then((result)=>{
        console.log(result)
    })
    open=false
    toast.success("Grupo de denuncias arquivado","Para desarquivar faça o seguinte procedimento:")
  }

  function notificar(){
    open=false
    openNotificar=true
  }

  async function desbloquear(){
    loadingBtn=true
    const [res,err] = await denunciaAdminController.desbloquear(denuncia!.loja.lojaId)
    loadingBtn=false
    open=false
 
    if(err){
        sinalizador.sendMeGenericModal({
            label:"Opss, algo deu errado!",
            desc:err.message,
            btnLabel:"Vish, entendo!",
            icon:SvgSad
        })
        return
    }
    console.log(res)
    sinalizador.sendSignal("reloadDenuncias")

  }
  async function bloquear(){
    sinalizador.sendMeGenericActionModal({
        label:"Tem certeza que deseja banir esta loja?",
        desc:"A loja ficara inativa permanentemente.",
        btnLabel:"Confirmar",
        action:async()=>{   
            const [res,err] = await denunciaAdminController.bloquear(denuncia!.loja.lojaId)
            if(err){
                sinalizador.sendMeGenericModal({
                    label:"Opss, algo deu errado!",
                    desc:err.message,
                    btnLabel:"Vish, entendo!",
                    icon:SvgSad
                })
                return
            }
            console.log(res)
            sinalizador.sendSignal("reloadDenuncias")
        },
        icon:SvgChorandinho
    })
  }

  async function reavaliar(){
        loadingBtn=true
        const [r,e] = await denunciaAdminController.reavaliar(idDenuncia)
        sinalizador.sendSignal("reloadDenuncias")
        buscarDenuncia()
        visualizacao="Detalhes"
        loadingBtn=false
        console.log(r,e)
  }

  $effect(()=>{
    if(open) buscarDenuncia()
  })

</script>



<SidePop bind:open withDefaultPadding={false} curved={true} >
    {#if loading}
        <div class="h-full flex items-center grow justify-center w-full">
            <LoaderMinhocaExpend label="Carregando dados da denúncia" />
        </div>
    {:else if denuncia}
        <div class="flex flex-col grow justify-between w-full">
            <div class="flex flex-col">
                {@render main()}
            </div>
            <div class="pt-2 border-t border-soft-200 w-full">
                {#if denuncia.loja.bloqueado}
                    <div class="grid grid-cols-1 gap-x-3 px-5 h-[40px]">
                        <Botao tema="red-transparent-inverted" onClick={desbloquear}>
                            Desbloquear loja
                        </Botao>
                    </div>           
                {:else}
                {#if denuncia.status==="PENDENTE"}
                    <div class="grid grid-cols-2 gap-x-3 px-5 h-[40px]">
                            <Botao tema="gray-transparent" onClick={arquivar}>
                                {#if visualizacao==="Denúncias"}
                                    Não procede
                                {:else}
                                    Arquivar
                                {/if}
                            </Botao>
                        <Botao loading={loadingBtn} tema="red-transparent-inverted"  onClick={notificar}>
                            {#if visualizacao==="Denúncias"}
                                Procede
                            {:else}
                                Notificar lojista
                            {/if}

                        </Botao>
                    </div>              
                    {:else if denuncia.status==="NOTIFICADO"}
                        <div class="grid grid-cols-1 gap-x-3 px-5 h-[40px]">
                            <Botao tema="gray-transparent" onClick={reavaliar}>
                                Reavaliar
                            </Botao>
                        </div>              
                    {:else if denuncia.status==="ARQUIVADO"}
                    <div class="grid grid-cols-1 gap-x-3 px-5 h-[40px]">
                        <Botao tema="gray-transparent" onClick={reavaliar}>
                            Reavaliar
                        </Botao>
                    </div>              
                    {:else if denuncia.status==="BANIDO"}
                    <div class="grid grid-cols-1 gap-x-3 px-5 h-[40px]">
                        <Botao tema="red-transparent-inverted" onClick={reavaliar}>
                            Reavaliar
                        </Botao>
                    </div>              
                    {:else}
                    <div class="grid grid-cols-2 gap-x-3 px-5 h-[40px]">
                            <Botao tema="gray-transparent" onClick={arquivar}>
                                    Arquivar
                            </Botao>
                        <Botao loading={loadingBtn} tema="red-transparent-inverted"  onClick={bloquear}>
                            Bloquear loja
                        </Botao>
                    </div>              
                    {/if}

                {/if}
            </div>
        </div>

    {/if}
</SidePop>


{#snippet main()}
{#if denuncia}
    <div class="flex justify-between px-5 w-full">
        <IconDenuncia status={denuncia.status} motivo={denuncia.motivo}/>
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
            label:"Denúncias",
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

{#if visualizacao==="Denúncias"}
    <div class="flex flex-col gap-2 w-full">
        {#each denuncia.denuncias as item}
            <div class="flex flex-col gap-4 p-5 border-b border-soft-200">
                <div class="flex items-start gap-2.5 w-full">
                    <Avatar src={avatarController.url("USUARIO",item.cliente.clienteId)} name={item.cliente.nome} size="w-[48px]"/>
                    <div class="flex flex-col w-full">
                        <div class="flex justify-between w-full">
                            <b class="font-medium text-[14px]">
                                {item.cliente.nome}
                            </b>
                            <span class="text-sub-600 font-normal text-[14px]">
                                {handleDate.formatISODate(item.criadoEm)}
                            </span>
                        </div>
                        <p class="text-sub-600 text-[14px]">
                            {item.descricao ?? "Não informado na denúncia"}
                        </p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 items-center max-h-[200px] overflow-y-auto ">
                    {#each item.anexos as anexo}
                        <CardDownload url={anexo.url} mimetype={anexo.tipo} filename={anexo.nome} size="300"/>
                    {/each}    
                </div>
            </div>
        {/each}
    </div>
{:else}
    <div class="flex flex-col px-5 mt-5 gap-3 w-full">
            {#if visualizacao==="Detalhes"}
                <LabelSoft label="DATA DA PRIMEIRA DENÚNCIA">
                    <b class="font-medium">
                        {handleDate.formatISODate(denuncia.denuncias[0].criadoEm)}
                    </b>
                </LabelSoft>
                <div class="w-full h-[1px] bg-soft-200"></div>
                <LabelSoft label="USUÁRIOS QUE FIZERAM A DENÚNCIA">

                    <ListAvatar users={denuncia.denuncias.map((obj)=>{
                        return{
                            name: obj.cliente.nome,
                            src: avatarController.url("USUARIO",obj.cliente.clienteId)
                        }
                    })}/>
                </LabelSoft>        
            {:else}
                <LabelSoft label="DEFESA">
                    {denuncia.resposta ?? "Sem resposta no momento"}
                </LabelSoft>

            {/if}
    </div>
    <div class="flex flex-col gap-3 w-full mt-5">
        <FillText texto="EVIDÊNCIAS"/>
        <div class="grid grid-cols-2 gap-4 items-center max-h-[200px] overflow-y-auto px-5">
            {#if denuncia.evidencias.length===0}
                <span class="text-[14px] text-sub-600 my-1 w-full col-span-2">
                    Nenhuma evidência reportada
                </span>
            {:else}
                {#if visualizacao==="Detalhes"}
                    {#each denuncia.evidencias as evidencia}
                        <CardDownload url={evidencia.url} mimetype={evidencia.tipo} filename={evidencia.nome} size="3000"/>
                    {/each}
                {:else if visualizacao==="Resposta"}
                    {#each denuncia.anexos as evidencia}
                        <CardDownload url={evidencia.url} mimetype={evidencia.tipo} filename={evidencia.nome} size="3000"/>
                    {/each}
                {/if}
            {/if}
        </div>
        {#if visualizacao==="Detalhes"}
        <FillText texto="PRODUTO"/>
            {@render imagemNome(denuncia.produto.nome,denuncia.produto.categoria,
            denuncia.produto.imagens[0] ? new ProdutoController().pegarImagem(denuncia.produto.produtoId,denuncia.produto.imagens[0].id) : "",
            ()=>window.open(`https://${denuncia!.loja.subdominioPersonalizado.subdominio}.pinaculo.fun/produto/${denuncia!.produto.urlAmigavel}`)
            )}
        <FillText texto="LOJA"/>
            {@render imagemNome(denuncia.loja.nome,denuncia.loja.quantidadeDenunciasAprovadas.toString()+" denúncias aprovadas",
            denuncia.loja.logo,
            ()=>window.open(`https://${denuncia!.loja.subdominioPersonalizado.subdominio}.pinaculo.fun`)
            )}
        <FillText texto="LOJISTA"/>
            {@render imagemNome(denuncia.lojista.nome,denuncia.lojista.quantidadeLojas.toString()+" lojas",
            denuncia.loja.logo,
            ()=>{}
            )}
        {/if}
    </div>
    {/if}
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

<ModalNotificacaoDenuncia bind:open={openNotificar} idDenuncia={idDenuncia}/>