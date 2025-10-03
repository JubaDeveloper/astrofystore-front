
import toast from "$lib/utils/toast.svelte";
import type { Action } from "svelte/action";

type MyAction = Action<HTMLElement,string,{}>


export const portal:MyAction = (node:HTMLElement, selector:string) => {
   $effect(()=>{
      
      const target = document.querySelector(selector)
      if(!target){
         toast.alert("Portal","Portal nao encontrado")
         return
      }

      const copy = node
      node.remove()
      target.append(copy)
      
      return () => {
         
         if(target.contains(copy)){
            target.removeChild(copy)
         }

      }

   })
}