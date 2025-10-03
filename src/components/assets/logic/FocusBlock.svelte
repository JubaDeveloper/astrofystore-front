<script lang="ts">
   import { browser } from "$app/environment";
   import { onMount, type Snippet } from "svelte";

    interface Props {
        className:string,
        isFocus:boolean,
        itensWithFocus?:string[],
        children:Snippet,
        onKeyDown?: (key:string) => void,
        onLostFocus?:VoidFunction,
        onGainFocus?:VoidFunction
    }
    
    let {className,onLostFocus,onGainFocus,isFocus = $bindable(),onKeyDown = () => {},itensWithFocus=[],children}:Props = $props()    

    let container = $state<HTMLDivElement>();

    let htmlWithFocus = $state<Element[]>([])


    $effect(()=>{
        if(isFocus===true){
            setTimeout(()=>{
                buscarElementos()
            },100)  
        }
    })

    $effect(()=>{
        if(container && isFocus===true){
            container.focus();
        }
    })
    
    function lostFocus(event:any){
        if(onLostFocus)
            onLostFocus()
        if(!container) return
        const elemento = event.relatedTarget;
        if(!container.contains(elemento)){
            isFocus=false;
        }
        else if(htmlWithFocus.some((obj)=>obj===elemento)){
            
        }
        else{
            container.focus();
        }
    }

    function buscarElementos(){
        if(!container) return
        for(const item of itensWithFocus){
            const div = container.querySelector(item)
            if(div && htmlWithFocus.some((obj)=>obj===div)){
                continue
            }
            if(div){
                div.addEventListener("blur",(event)=>lostFocus(event));
                htmlWithFocus.push(div)
            }
        }
    }

</script>


<!-- 
  @component
  Componente usado para detectar foco em um componente, mantendo o controle da variavel "isFocus" para detectar a ausencia ou presença de foco nela
  Casos de uso incluem: Selects, Menus flutuantes, etc.
  Dica: Use em conjunto com FocusBlock para ter melhor leitura e entendimento do codigo
  Uso:
    ```tsx
  <FocusBlock bind:isFocus>
    {#if isFocus}
        Componente está com foco
    {:else}
        Não está com foco
    {/if}
  </FocusBlock>
    
-->

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div role="contentinfo" class={className} bind:this={container} 
onkeydown={(e)=>onKeyDown(e.key)} 
onblur={lostFocus} 
onfocus={()=>{
    if(onGainFocus){
        onGainFocus()
    }
}}
tabindex="-1">
    {@render children()}
</div>