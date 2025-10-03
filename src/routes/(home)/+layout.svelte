<script lang="ts">
    import { browser } from "$app/environment";
    import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
    import { page } from "$app/state";
    import SideBar from "$components/sections/nav/SideBar.svelte";
    import { rotasLojista, rotasPublicas } from "$lib/utils/rotas.svelte";
    import storageService from "$lib/utils/storageService";
    import toast from "$lib/utils/toast.svelte";
    import type { AfterNavigate, BeforeNavigate } from "@sveltejs/kit";
    import { fly, scale } from "svelte/transition";
  
    let {children} = $props()

    console.log(storageService.getStoredData("astronfy-token"))

</script>
  
  
  {#if browser}
  
  <div class="w-screen h-svh flex relative overflow-hidden">
    <SideBar/>
    <div class="flex h-full grow overflow-hidden relative">
      {#key page.url.pathname}
      {@const duration = 800}
        <div class="absolute top-0 left-0 shrink-0 p-5 px-6 w-full grow overflow-y-auto h-full origin-center"
        in:fly={{duration,x:1400,delay:duration/3}}
        out:fly={{duration,x:-1400}}>
          {@render children()}            
        </div>
      {/key}
    </div>    
  </div>
  
  {/if} 
  