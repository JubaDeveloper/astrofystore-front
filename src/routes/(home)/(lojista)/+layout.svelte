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
  
    function verificarUsuario(callback:AfterNavigate){
      if(!callback.to) return
      const id  = callback.to.route.id
      if(!id) return
      const usuario = storageService.getStoredData("astronfy-user")
      if(!usuario) {
        return permissaoNegada()
      }
      
      const perfil = usuario.perfil as string
  
      if(perfil==="USUARIO" && id.includes("(lojista)")){
         return
      }
      else{
        return permissaoNegada()
      }
      
    }
  
    function permissaoNegada(){
      goto("/login")
      return
    }
  
    afterNavigate((callback)=>verificarUsuario(callback))
  </script>
  
{@render children()}            