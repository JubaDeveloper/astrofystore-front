<script lang="ts">
  import Botao from "$components/assets/buttons/Botao.svelte";
  import PopUp from "$components/assets/modals/PopUp.svelte";
  import SvgMaozinha from "$components/assets/svg/SvgMaozinha.svelte";
  import sinalizador from "$lib/utils/signal.svelte";
  import type { Component } from "svelte";

 

    let data =$state<{
        label:string,
        desc:string,
        btnLabel:string,
        icon:Component
    }>({
        label:"",
        btnLabel:"",
        desc:"",
        icon:SvgMaozinha
    })

    let open = $state(false)

    $effect(()=>{
        if(sinalizador.signal.tipo==="openGenericModal"){
            data = sinalizador.signal.data
            open=true
        }
    })

    let Icon = $derived.by(()=>{
        return data.icon
    })

</script>



<PopUp withCloseButton={true} bind:open>
    <div class="flex flex-col items-center gap-4 w-[340px] py-1 pb-0">
            <div class="shrink-0 mt-4">
                <Icon props={{
                    class:"w-[40px] h-[40px]"
                }}/>
            </div>
            <div class="flex flex-col text-[16px] text-center justify-center">
                {data.label}
                <p class="text-sub-600 text-[14px] mt-0.5 text-center">
                    {data.desc}
                </p>
            </div>
        <div class="grid h-[40px] mt-3 w-full">
            <Botao tema="primary" onClick={()=>open=false}>
                {data.btnLabel}
            </Botao>
        </div>
    </div>

</PopUp>