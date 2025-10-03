<script lang="ts">
  import Badge from "$components/assets/badge/Badge.svelte";

    interface Props{
        qtd:number
    }
    
    let {qtd}:Props = $props()

    let status = $derived.by(()=>{
        if(qtd>=10){
            return {text:"😁 OK",tema:"success-lighter"}
        }
        if(qtd>3){
            return {text:"😦 BAIXO",tema:"warning-light"}
        }
        if(qtd===0){
            return {text:"😫 ESGOTADO",tema:"error-base"}
        }
        return {text:"🚀 ILIMITADO",tema:"feature-lighter"}
    })


</script>

<Badge tema={status.tema}>
    <div class="flex items-center font-medium text-[11px]">
        {status.text}
        {#if qtd>0}
            ({qtd})
        {/if}
    </div>
</Badge>