<script lang="ts">
    import DayMode from "./DayMode.svelte";
    import { fade, fly } from "svelte/transition";
    import { quadInOut } from "svelte/easing";
    import FocusBlock from "../logic/FocusBlock.svelte";
  import { portal } from "$lib/actions/portal.svelte";

    type RangeType={
        start:Date | null,
        end:Date | null
    }

    type RangeString={
        start:string,
        end:string
    }

    interface Props{
        range?:RangeType | undefined | null,
        rangeString?:RangeString | undefined | null,
        isVisible:boolean,
        extraTailwind?:string,
        onlyOneDay?:boolean,
        onSelecionar:(v:RangeType)=>void
    }

    let {range = $bindable(),rangeString = $bindable(),isVisible = $bindable(),extraTailwind="",onlyOneDay=false,onSelecionar}:Props = $props()
    let innerWidth = $state<number>(1280)

    $effect(()=>{
        if(range && range.start!==null){
            if(!rangeString){
                rangeString = {
                    start: range.start ? range.start.toISOString() : "",
                    end: range.end ? range.end.toISOString() :  ""
                }                
            }
            rangeString.start = range.start ? range.start.toISOString() : "";
            rangeString.end = range.end ? range.end.toISOString() :  "";
        }
    })


  </script>

  <svelte:window bind:innerWidth/>
  {#if isVisible}

        <div use:portal={"body"}
        class="fixed outline-none w-screen h-svh right-0 bottom-0 flex justify-center items-center 
        z-20 bg-[rgba(0,0,0,.4)] backdrop-blur-[1px]" id="dataRange" transition:fade>

            <div 
            class="relative bg-white-0 rounded-[8px] border border-soft-200 shadow-xl  
            flex flex-col flex-grow-0 z-10 w-[400px] xl:w-auto xl:max-w-[90vw] max-h-[80svh] overflow-y-auto"
            transition:fly={{y:500,duration:600,easing:quadInOut}}>
                <DayMode onlyOneDay={onlyOneDay} onSelecionar={onSelecionar}  bind:isVisible bind:range/>
            </div>
            <button aria-label="Fechar modal" onclick={()=>isVisible=false} class="z-0 absolute w-full h-full">

            </button>

        </div>
  
{/if}