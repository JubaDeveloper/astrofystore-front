<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import SvgBread from "$components/assets/svg/SvgBread.svelte";


    let rotas = $derived.by(()=>{

        const pagina = page.url.pathname
        const tmp = pagina.split("/").slice(1,99999)
        let rotasTmp = tmp.map((obj)=>{
            return {
                link:obj,
                rota:obj
            }
        })
        let cumulador = ""
        for(let i in rotasTmp){
            cumulador+="/"+rotasTmp[i].link
            
            rotasTmp[i].link=cumulador
        }
        return rotasTmp


    })  


</script>

<div class="flex items-center gap-2 text-sub-600 text-[14px] font-medium">
    <SvgBread/>
    <div class="items-center flex gap-3">
        {#each rotas as rota,i}
            <button class="{rota.link===page.url.pathname ? "text-strong-950" : ""}"
            onclick={()=>goto(rota.link)}>
                {rota.rota}        
            </button>
            {#if i<rotas.length-1}
                /
            {/if}
        {/each}
    </div>
</div>