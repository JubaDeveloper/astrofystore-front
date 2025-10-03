<script lang="ts">
  import Badge from "$components/assets/badge/Badge.svelte";
  import SvgClock from "$components/assets/svg/SvgClock.svelte";
  import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";


    interface Props{
        dataPrevista:Date,
        modo?:"passado" | "prazo"
    }

    let {dataPrevista,modo="prazo"}:Props = $props()


    function getDateLabel(date:Date) {
        const today = new Date();
        const targetDate = new Date(date);

        const minutes = Math.abs(differenceInMinutes(today,targetDate))
        const hours = Math.abs(differenceInHours(today, targetDate))
        const days = Math.abs(differenceInDays(today, targetDate))

        if(modo==="passado"){

            if (minutes<60) return {
                tema:"success-lighter",
                fill:"fill-success-base",
                label:minutes+"m"
            }
            if (hours<24) return {
                tema:"success-lighter",
                fill:"fill-success-base",
                label:hours+"h"
            }
            return {
                tema:"success-lighter",
                fill:"fill-success-base",
                label:days+"d"
            }

        }

        if (days === 0) return {
            tema:"error-lighter",
            fill:"fill-error-base",
            label:"Hoje" 
        };
        if (days === 1) return {
            tema:"warning-lighter",
            fill:"fill-warning-base",
            label:"Amanhã"
        };
        if (days > 1) return {
            tema:"information-lighter",
            fill:"fill-information-base",
            label:days + " dias"
        };
        return {
            tema:"faded-lighter",
            fill:"fill-faded-base",
            label:"Esgotado"
        }
    }

</script>

<Badge tema={getDateLabel(dataPrevista).tema} css="h-[20px] rounded-[16px] px-2 text-[12px] font-medium">
    <SvgClock props={{
        class: `${getDateLabel(dataPrevista).fill} w-[12px] h-[12px]`   
    }}/>
    {getDateLabel(dataPrevista).label}
</Badge>