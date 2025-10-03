<script lang="ts">
    import Avatar from "$components/assets/avatar/Avatar.svelte";
    import Botao from "$components/assets/buttons/Botao.svelte";
    import FillText from "$components/assets/limiter/FillText.svelte";
    import SidePop from "$components/assets/modals/SidePop.svelte";
  import SvgAlertaTriangulo from "$components/assets/svg/SvgAlertaTriangulo.svelte";
    import SvgBanir from "$components/assets/svg/SvgBanir.svelte";
    import CardInfoGo from "$components/elements/card/CardInfoGo.svelte";
  import { flySlide } from "$lib/anim/transitions";
    import { fade, fly } from "svelte/transition";
  
    interface Props{
      open:boolean
    }
  
    let {open = $bindable()}:Props = $props()
    
    let clientes = $state([])

    let queroSuspender = $state<boolean>(false)
    let loading = $state<boolean>(false)
  
  
    const buscarUsuarios = async () => {
      loading=true
      //Criar controller
      loading = false
    }
  
    const suspender = async() => {
  
    }
  
  
  </script>
  
  <SidePop bind:open label="Suspender Prédio" {loading}>
  
      <FillText texto="CLIENTES VINCULADOS"/>
      
      {#if clientes.length===0}
        <div class="grow w-full justify-center items-center flex flex-col">
            <img src="/images/empty-clientes.webp" alt="Vazio"/>
            <span class="text-sub-600 text-[16px] leading-tight mt-3 w-[200px] text-center">
                Não há clientes vinculados nesse prédio.
            </span>
        </div>
      {/if}

      {#if queroSuspender}
          {@render suspenderGroup()}
      {/if}

      {#if !queroSuspender}
          <div class="grid h-[40px] w-full px-4 my-4"
          in:flySlide={{x:800,duration:800}}
          out:flySlide={{x:-400,duration:800}}
      
          >
              <Botao tema="red-transparent-inverted" onClick={()=>queroSuspender=true}>
                  <SvgBanir/>
                    Suspender Prédio
               </Botao>    
          </div>
      {/if}
  
  
  </SidePop>
  
  {#snippet suspenderGroup()}
    <div class="px-4" 
    in:flySlide={{x:800,duration:800}}
    out:flySlide={{x:-400,duration:800}}
    
    >
    
        <div class="flex items-center gap-2 w-full px-3 py-1 border border-soft-200 rounded-[8px]">
            <SvgAlertaTriangulo/>
            <p class="text-[12px] font-normal leading-tight">
                A ação de suspender um prédio com usuários ativos apagará todos os vínculos.
            </p>
        </div>
        <div class="grid grid-cols-2 gap-x-2 h-[40px] mt-2">
              <Botao tema="gray-transparent" onClick={()=>queroSuspender=false}>
                  Cancelar
              </Botao>    
              <Botao tema="red" onClick={()=>{}}>
                  <SvgBanir props={{
                    fill:"white"
                  }}/>
                  Suspender Prédio
              </Botao>    
        </div>
    </div>
  {/snippet}
  
  
  {#snippet lojasSec()}
  <div class="flex flex-col w-full"
  transition:fade
  >
      <FillText texto="LOJAS"/>
      <div class="flex flex-col gap-2 px-4 my-4 w-full">
          <CardInfoGo label="Nome fantasia da loja" desc="Nome da loja" action={()=>{}}>
              <Avatar src="" name="Loja"/>
          </CardInfoGo>
          <CardInfoGo label="Nome fantasia da loja" desc="Nome da loja" action={()=>{}}>
              <Avatar src="" name="Loja"/>
          </CardInfoGo>
      </div>    
  </div>
  {/snippet}
  
  
  
  
  
  {#snippet agrupamentoValor(label:string,valor:string)}
      <div class="flex flex-col">
          <span class="text-soft-400 text-[12px] font-normal">{label}</span>
          <b class="text-[14px] font-medium">{valor}</b>
      </div>
  {/snippet}