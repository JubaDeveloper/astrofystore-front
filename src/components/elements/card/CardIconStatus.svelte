<script lang="ts">
  import SvgAlerta from "$components/assets/svg/SvgAlerta.svelte";
  import SvgCheck from "$components/assets/svg/SvgCheck.svelte";
  import SvgClock from "$components/assets/svg/SvgClock.svelte";
  import SvgOrangeBell from "$components/assets/svg/SvgOrangeBell.svelte";
  import SvgPendente from "$components/assets/svg/SvgPendente.svelte";
  import SvgRespondido from "$components/assets/svg/SvgRespondido.svelte";
  import SvgSemResposta from "$components/assets/svg/SvgSemResposta.svelte";
    import type {Component, Snippet} from "svelte";

    interface Props {
        status: string,
    }

    let {status}:Props = $props()


    let Icon = $derived.by<Component>(()=>{
        if(status==="PENDENTE"){
            return SvgClock
        }
        if(status==="CANCELADO" || status==="REJEITADO"){
            return SvgAlerta
        }
        if(status==="RESPONDIDO"){
            return SvgRespondido
        }
        if(status==="SEM_RESPOSTA"){
            return SvgSemResposta
        }
        if(status==="NOTIFICADO"){
            return SvgOrangeBell
        }
        return SvgCheck
    })
</script>

<div class="flex items-center gap-1.5 text-12 text-sub-600 font-medium border border-soft-200 py-1 px-2 rounded-[8px]">
    <Icon props={{
        class:"w-[12px] h-[12px] shrink-0"
    }}/>
    {status}
</div>