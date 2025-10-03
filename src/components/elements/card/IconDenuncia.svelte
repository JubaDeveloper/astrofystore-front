<script lang="ts">
    import SvgAlerta from "$components/assets/svg/SvgAlerta.svelte";
    import SvgCheck from "$components/assets/svg/SvgCheck.svelte";
  import SvgClock from "$components/assets/svg/SvgClock.svelte";
  import SvgOrangeBell from "$components/assets/svg/SvgOrangeBell.svelte";
    import SvgPendente from "$components/assets/svg/SvgPendente.svelte";
  import SvgRespondido from "$components/assets/svg/SvgRespondido.svelte";
  import SvgSemResposta from "$components/assets/svg/SvgSemResposta.svelte";
  import { DENUNCIA_STATUS_ENUM, type DenunciaStatusDto } from "$lib/api/modules/denuncias/denuncias.dto";
      import type {Component, Snippet} from "svelte";
    
      interface Props {
          status: DENUNCIA_STATUS_ENUM,
          motivo:string
      }
  
      let {status,motivo}:Props = $props()
  
  
      let Icon = $derived.by<Component>(()=>{
          if(status === DENUNCIA_STATUS_ENUM.NOTIFICADO){
              return SvgOrangeBell
          }
          if(status === DENUNCIA_STATUS_ENUM.PENDENTE){
            return SvgClock
          }
          if(status === DENUNCIA_STATUS_ENUM.BANIDO){
            return SvgAlerta
          }

          if(status===DENUNCIA_STATUS_ENUM.RESPONDIDO){
            return SvgRespondido
          }

          if(status === DENUNCIA_STATUS_ENUM.SEM_RESPOSTA){
            return SvgSemResposta
          }
          return SvgCheck
      })

      function converterMotivo(){
          if(motivo==="PRODUTOS_ILEGAIS"){
            return "Produtos ilegais"
          }
          else{ 
            return "Direitos autorais"
          }
      }
  </script>
  
  <div class="flex items-center gap-2 text-18 text-strong-950 font-medium">
      <Icon props={{
        class:"w-[18px] h-[18px]"
      }}/>
      Denúncia por {converterMotivo()}
  </div>