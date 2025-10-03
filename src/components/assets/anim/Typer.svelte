<script lang="ts">
	import { onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
  import Portal from "../logic/Portal.svelte";
  import { portal } from "$lib/actions/portal.svelte";

    interface Props extends HTMLAttributes<HTMLDivElement> {
        label: string;
        infinite?: boolean;
        frames?: number;
        delay?:number;
        color?:string;
        size?:string;
    }



    let {label,infinite=true,frames=80,color="text-neutral-700",size="text-[16px]",delay=0}:Props = $props()


    let step = $state<number>(0)
    let fade = $state<boolean>(false)
    let realWidth = $state<number>(0)
    let container = $state<HTMLDivElement>()

    let pixelSize = $derived.by(()=>{   
        return (realWidth*step)/100
    })

    function anim(){
        const id = setInterval(()=>{

            if(step===100){
                if(!infinite){
                    clearInterval(id)
                    return;
                }
                clearInterval(id)
                setTimeout(reset,frames*6)
                return;
            }

            step+=1;
        },frames)
    }

    function reset(){
        step=0
        anim();
    }

    onMount(() => {
        if(container){
            realWidth = container.getBoundingClientRect().width;
            fade=true;
            setTimeout(()=>{
                anim()
            },delay)
        }
    });

</script>





<div class="border-r fade {!fade && "opacity-0"} overflow-hidden whitespace-nowrap {color} {size}" 
style="width:{fade ? (pixelSize)+"px" : "auto"};">
    {label}
</div>

<div use:portal={"body"} class="absolute bg-red-500 z-50 pointer-events-none opacity-0 text-white top-0 left-0 flex justify-start items-start content-start" >
        <div class="flex {size}"  bind:this={container} >
            {label}
        </div>
</div>


<style>
    .fade{
        animation: fade 0.5s infinite;
    }
    @keyframes fade{
        0%{
            border-color: initial;
        }
        100%{
            border-color: transparent;
        }
    }
</style>