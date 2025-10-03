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
          icon:Component,
          action:()=>Promise<void>
      }>({
          label:"TESTE",
          btnLabel:"TESTE",
          desc:"TESTE",
          icon:SvgMaozinha,
          action: async()=>{}
      })
  
      let open = $state(false)
      let loading = $state(false)
  
      $effect(()=>{
          if(sinalizador.signal.tipo==="openGenericActionModal"){
              data = sinalizador.signal.data
              open=true
          }
      })
  
      let Icon = $derived.by(()=>{
          return data.icon
      })
  
  </script>
  
  
  
  <PopUp  withDefaultPadding={false} withCloseButton={false} bind:open>
    <div class="w-[380px] flex flex-col gap-3 pb-3">
        <div class="flex flex-col justify-center items-center  gap-4 pt-5 px-5">
          <div class="shrink-0">
            <Icon/>
          </div>
          <div class="flex flex-col text-left gap-1">
            <p class="text-16 text-strong-950 font-medium text-center">{data.label}</p>
            <p class="text-14 text-sub-600 font-normal text-center">
                {data.desc}
            </p>
          </div>
        </div>
        <div class="border-b border-soft-200"></div>
        <div class="grid grid-cols-2 gap-x-3 px-5 h-[40px]">
          <Botao 
          disabled={loading}
          onClick={() => (open = false)} tema="gray-transparent">
            Voltar
          </Botao>
          <Botao 
            {loading}
            onClick={async() => {
                loading=true
                await data.action();
                loading=false
                open=false
            }}
            tema="red"
          >
          {data.btnLabel}
          </Botao>
        </div>
      </div>  
  </PopUp>