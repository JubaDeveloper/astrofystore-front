<script lang="ts">
    import { browser } from "$app/environment";
    import LoaderSmooth from "$components/elements/loading/LoaderSmooth.svelte";
    import { tooltip } from "$lib/actions/title.svelte";
    import { untrack, type Component } from "svelte";
    import SvgDefaultUser from "../svg/SvgDefaultUser.svelte";
    import type { SVGAttributes } from "svelte/elements";
    import SvgBuildRounded from "../svg/SvgBuildRounded.svelte";
    import SvgBuildRect from "../svg/SvgBuildRect.svelte";
  
    interface Props{
        src:string,
        name:string,
        size?:string,
        textSize?:string,
        hasTitle?:boolean,
        rounded?:string,
        placeholder?:"icon" | "letter" | "skyscrapper"
    }

    let {src,name,size="w-10",placeholder="letter",textSize="text-[16px]",hasTitle=false, rounded = 'rounded-full'}:Props = $props()

    let loaded = $state<boolean>(false);
    let error = $state<boolean>(false);
    let interval:number;

    $effect(()=>{
        if(src || browser){
            if(interval){
                clearTimeout(interval)
            }
            untrack(loadImage)
        }
    })


    async function loadImage(){

        loaded=false
        error=false
        const img = new Image()
        
        img.src=src;

        interval = setTimeout(()=>{
            error=true
            loaded=true
        },300)
        
        img.onload = (event)=>{
            clearTimeout(interval)
            loaded=true
            error=false
        }
        
        img.onerror = (event) =>{
            loaded=true
            error=true;
        }
    }

    const randomColor = () => {
        const colors = [
        "bg-purple-200 text-purple-950 fill-purple-950",
        "bg-sky-200 text-sky-950 fill-sky-950",
        "bg-blue-200 text-blue-950 fill-blue-950",
        "bg-yellow-200 text-yellow-950 fill-yellow-950",
        "bg-red-200 text-red-950 fill-red-950",
        ];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }
    const randomColorBuild = () => {
        const colors = [
        "fill-white bg-gradient-to-t from-orange-400 to-orange-300",
        "fill-white bg-gradient-to-t from-green-400 to-green-300",
        "fill-white bg-gradient-to-t from-red-400 to-red-300",
        "fill-white bg-gradient-to-t from-gray-400 to-gray-300",
        ];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    let esquema = $state<string>("")

    if(placeholder==="skyscrapper"){
        esquema = randomColorBuild()
    }
    else{
        esquema = randomColor()
    }


</script>


<!-- 
  @component
    Componente padrão para avatares.
  
  Uso:
    ```tsx
    <Avatar src={url} name="Fulano de tal"/>
-->
    <div class="flex  overflow-hidden z-0 relative aspect-square {rounded} {size}" use:tooltip={{text:hasTitle ? name : null,posTriangulo:"bottom-middle"}}>
        {#if loaded===true && error===true}

                
                <div class="flex justify-center overflow-hidden items-center m-0 leading-0 select-none {textSize} w-full h-full {esquema}">
                    {#if placeholder==="letter"}
                        {name[0] ? name[0].toUpperCase() : "A"}
                    {:else if placeholder==="skyscrapper"}
                    {@const tipo = Math.floor(Math.random() * 100) > 49 ? "rounded" : "rect-rounded"}
                        {#if tipo==="rounded"}
                            <div class="translate-y-[12px] translate-x-[1px]">
                                <SvgBuildRounded fillTailwind={esquema}/>
                            </div>
                        {:else}
                            <div class="translate-y-[12px] translate-x-[1px]">
                                <SvgBuildRect fillTailwind={esquema}/>
                            </div>
                        {/if}

                    {:else}
                        <SvgDefaultUser props={{
                            class:esquema,
                            style:"background:none"
                        }}/>
                    {/if}
                </div>
        {/if}  

        {#if loaded===true && error===false}
            <img src={src} class="w-full object-cover" alt=""/>
        {/if}
        
        {#if !loaded}
            <div class="flex flex-col justify-center items-center {textSize} w-full h-full text-white bg-neutral-600">
                <LoaderSmooth cor="white" tamanho="w-[45%]"/>
            </div>
        {/if}
    </div>