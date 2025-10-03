<script lang="ts">
  import Avatar from "$components/assets/avatar/Avatar.svelte";
  import Botao from "$components/assets/buttons/Botao.svelte";
  import FillText from "$components/assets/limiter/FillText.svelte";
import LoaderMinhocaExpend from "$components/assets/loading/LoaderMinhocaExpend.svelte";
  import SidePop from "$components/assets/modals/SidePop.svelte";
  import SvgSad from "$components/assets/svg/min/SvgSad.svelte";
  import SvgMaozinha from "$components/assets/svg/SvgMaozinha.svelte";
  import SvgX from "$components/assets/svg/SvgX.svelte";
  import LabelSoft from "$components/elements/wrappers/LabelSoft.svelte";
  import { DevolucaoLojistaController } from "$lib/api/modules/pedido/devolucoes/devolucoes.controller";
  import type { DevolucaoLojistaDetalhesDto, DevolucaoLojistaDto } from "$lib/api/modules/pedido/devolucoes/devolucoes.dto";
  import sanitizar from "$lib/sanitizers/sanitizer";
  import handleText from "$lib/sanitizers/text";
  import handleDate from "$lib/sanitizers/time";
  import { idLoja } from "$lib/utils/rotas.svelte";
  import sinalizador from "$lib/utils/signal.svelte";

  interface Props {
    open: boolean;
    idPedido: number;
  }

  let { open = $bindable(), idPedido }: Props = $props();

  let loading = $state(false)
  

  const devolucaoController  = new DevolucaoLojistaController(parseInt($idLoja))
  let pedido = $state<DevolucaoLojistaDetalhesDto>()
  async function mount() {
    loading = true;
    const [res, err] = await devolucaoController.pegar(idPedido);
    if (err) {
      return console.log(err);
    }
    pedido=res.data
    loading = false;
  }

  async function negar(){
    sinalizador.sendMeGenericActionModal({
        label:"Calma aí, paizão!",
        desc:"Ao negar o pedido de devolução o item continuará com o cliente e ele não poderá solicitar uma nova devolução.",
        action: async()=>{
            const [res,err] = await devolucaoController.negar(idPedido)
            if(err){
                sinalizador.sendMeGenericModal({
                    label:"Opss, algo deu errado!",
                    desc:err.message,
                    btnLabel:"Vish, entendo!",
                    icon:SvgSad
                })
                return
            }
            open=false
            sinalizador.sendSignal("reloadDevolucoes")
        },
        icon:SvgMaozinha,
        btnLabel:'Confirmar'
    })
  }
  async function aceitar(){
    sinalizador.sendMeGenericActionModal({
        label:"Calma aí, paizão!",
        desc:"Ao aceitar o pedido de devolução o valor do item será restituído ao cliente.",
        action: async()=>{
            const [res,err] = await devolucaoController.aprovar(idPedido)
            if(err){
                sinalizador.sendMeGenericModal({
                    label:"Opss, algo deu errado!",
                    desc:err.message,
                    btnLabel:"Vish, entendo!",
                    icon:SvgSad
                })
                return
            }
            open=false
            sinalizador.sendSignal("reloadDevolucoes")
        },
        icon:SvgMaozinha,
        btnLabel:'Confirmar'
    })
  }

  $effect(()=>{
    if(open==true){
        mount()
    }
  })

</script>

<SidePop
  bind:open
  withDefaultPadding={false}
  withCloseButton={false}
  curved={true}
>
  <div class="flex flex-col w-[400px] grow h-full">
    {#if loading}
      <div class="h-full flex items-center grow justify-center">
        <LoaderMinhocaExpend label="Carregando dados do seu pedido" />
      </div>
    {:else if pedido}
      <div class="flex flex-col justify-between grow">
        <div class="flex flex-col gap-4">
            {@render detalhes(pedido)}
        </div>
        {#if pedido.status==="PENDENTE"}
        <div class="grid grid-cols-2 gap-2 px-2 h-[40px]">
            <Botao tema="gray-transparent" onClick={aceitar}>
                Aceitar
            </Botao>
            <Botao tema="gray-transparent" onClick={negar}>
                Negar
            </Botao>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</SidePop>

{#snippet detalhes(p:DevolucaoLojistaDetalhesDto)}
<div class="flex items-center gap-3 px-5 relative">
    <Avatar name={p.produto} src={""} size="w-[48px]" rounded="rounded-[6px]"/>
    <div class="flex flex-col max-w-[200px]">
        <span class="truncate text-[18px] font-normal">
            {p.produto}
        </span>
        <span class="text-sub-600 text-[14px]">
            {handleDate.formatISODate(p.criadoEm)} • R${sanitizar.centavosToReais(p.valor)}
        </span>
    </div>
    <button class="p-1 right-0 top-2 mr-7  absolute">
        <SvgX props={{
            class:"fill-sub-600"
        }}/>
    </button>
</div>
<FillText texto="CLIENTE"/>
<div class="flex items-center gap-3 px-5 relative">
    <Avatar name={p.cliente.nome} src={""} size="w-[48px]" rounded="rounded-[6px]"/>
    <div class="flex flex-col max-w-[200px]">
        <span class="truncate text-[18px] font-normal">
            {p.cliente.nome}
        </span>
        <span class="text-sub-600 text-[14px]">
            {p.cliente.email}
        </span>
    </div>
</div>
<FillText texto="DETALHES"/>
<div class="flex flex-col gap-4 px-5">
    <LabelSoft label="MOTIVO" color="text-soft-400">
        {handleText.snakeCaseConvert(p.motivo.toLowerCase())}
    </LabelSoft>    
    <div class="w-full h-[1px] bg-soft-200"></div>
    <LabelSoft label="COMENTÁRIO" color="text-soft-400">
        {p.detalhes}
    </LabelSoft>    
    <div class="w-full h-[1px] bg-soft-200"></div>
    <LabelSoft label="DATA E HORA DO PEDIDO" color="text-soft-400">
        {handleDate.formatISODate(p.criadoEm,`dd 'de' MMM','yyyy 'as' hh':'mm`)}
    </LabelSoft>    
    <div class="w-full h-[1px] bg-soft-200"></div>    
    <LabelSoft label="VALOR A SER DEVOLVIDO" color="text-soft-400">
        R${sanitizar.centavosToReais(p.valor)}
    </LabelSoft>    
</div>
{/snippet}