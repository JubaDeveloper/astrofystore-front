<script lang="ts">
        import Badge from "$components/assets/badge/Badge.svelte";
        import SvgClock from "$components/assets/svg/SvgClock.svelte";
        import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
    
  
      interface Props{
        diffDays:number,
        diffHours:number,
        diffMinutes:number,
        modo?:"passado" | "prazo"
      }
  
      let {diffDays,diffHours,diffMinutes,modo="prazo"}:Props = $props()
  
  
      function getDateLabel() {

          if(modo==="passado"){
  
              if (diffMinutes<60) return {
                  tema:"success-lighter",
                  fill:"fill-success-base",
                  label:diffMinutes+"m"
              }
              if (diffHours<24) return {
                  tema:"success-lighter",
                  fill:"fill-success-base",
                  label:diffHours+"h"
              }
              return {
                  tema:"success-lighter",
                  fill:"fill-success-base",
                  label:diffDays+"d"
              }
  
          }
  
          if (diffDays === 0) return {
              tema:"error-lighter",
              fill:"fill-error-base",
              label:"Hoje" 
          };
          if (diffDays === 1) return {
              tema:"warning-lighter",
              fill:"fill-warning-base",
              label:"Amanhã"
          };
          if (diffDays > 1) return {
              tema:"information-lighter",
              fill:"fill-information-base",
              label:diffDays + " dias"
          };
          return {
              tema:"faded-lighter",
              fill:"fill-faded-base",
              label:"Esgotado"
          }
      }
  
  </script>
  
  <Badge tema={getDateLabel().tema} css="h-[20px] rounded-[16px] px-2 text-[12px] font-medium">
      <SvgClock props={{
          class: `${getDateLabel().fill} w-[12px] h-[12px]`   
      }}/>
      {getDateLabel().label}
  </Badge>