import TipAction from "$components/elements/card/TipAction.svelte";
import { mount, unmount } from "svelte";
import type { Action } from "svelte/action";

type Info = {text:string | null,posTriangulo:"top-middle" | "top-left" | "top-right" | "bottom-middle" | "bottom-left" | "bottom-right"}
type MyAction = Action<HTMLElement | SVGElement | SVGRectElement,Info,{}>

export const tooltip:MyAction = (node:Element,info:Info) => {

    $effect(()=>{


      if(info.text===null) return
    
      let props = $state({ 
        visible:false,
        tip:info.text,
        father:node,
        posTri:info.posTriangulo
       });
  
      let div = mount(TipAction,{
        target: document.body,
        props: props
      })
  
      const handleOver = () => { 
          props.visible=true
      }
  
      const handleOut = () => {
          props.visible=false
      }
      
      
      node.addEventListener('mouseover', handleOver)
      node.addEventListener('mouseout', handleOut)
  
      return () => {
          unmount(div)
          node.removeEventListener('mouseover', handleOver)
          node.removeEventListener('mouseover', handleOut)
      }

    })
  }
  