<script lang="ts">
    import { fade, fly, scale } from "svelte/transition";
    import { quadInOut } from "svelte/easing";
    import {flySlide} from "$lib/anim/transitions"
    import toast from "$lib/utils/toast.svelte"
    import Banner from "$components/assets/banners/Banner.svelte";
    import banner from "$lib/utils/banner.svelte";


</script>


<div class="fixed pointer-events-none z-50  overflow-hidden top-0 left-0 w-screen
    h-svh p-3 xl:p-12 flex flex-col justify-end items-start">
    {#each banner.banners as b,i (b.id)}
        {@const easing = quadInOut}
        {@const tema = b.status+"-"+banner.tema}

        <div 
        class="w-full my-2"
        in:flySlide={{ y: 20, duration: 800,easing }}
        out:flySlide={{ x: 1600, duration: 800,easing }}
        >
            <Banner titulo={b.titulo} descricao={b.conteudo} link={b.link} onClose={()=>banner.remove(b.id)} tema={tema}/>
        </div>
     {/each}
</div>

